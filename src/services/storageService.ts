import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { ResumeData, UserProfile, ResumeVersion, CoverLetter } from '../types/resume';
import { INITIAL_RESUMES } from '../data/initialResumes';
import { calculateATSMetrics, calculateCompletionScore } from '../utils/atsCalculator';

const STORAGE_KEYS = {
  RESUMES: 'resumeforge_resumes_v1',
  ACTIVE_RESUME_ID: 'resumeforge_active_resume_id',
  USER_PROFILE: 'resumeforge_user_profile_v1',
  VERSIONS: 'resumeforge_versions_v1',
  COVER_LETTERS: 'resumeforge_cover_letters_v1',
  ANALYTICS: 'resumeforge_analytics_v1',
};

const DEFAULT_USER: UserProfile = {
  id: 'user-default',
  name: 'Alexander Wright',
  email: 'alex.wright@example.com',
  careerLevel: 'Senior',
  industry: 'Software & Technology',
  targetRole: 'Senior Full Stack Engineer',
  yearsOfExperience: '6+',
  location: 'San Francisco, CA',
  primaryGoal: 'improve_existing',
  plan: 'pro',
  isOnboarded: true,
  aiCreditsRemaining: 150,
};

export class StorageService {
  // --- Resumes Management ---
  static getResumes(): ResumeData[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESUMES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading resumes from localStorage', e);
    }
    // Initialize with defaults if empty
    this.saveResumes(INITIAL_RESUMES);
    return INITIAL_RESUMES;
  }

  static async syncResumesFromFirestore(userId: string): Promise<ResumeData[]> {
    if (!userId) return this.getResumes();
    try {
      const q = query(collection(db, 'resumes'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const firestoreResumes: ResumeData[] = [];
        querySnapshot.forEach(docSnap => {
          firestoreResumes.push(docSnap.data() as ResumeData);
        });
        this.saveResumes(firestoreResumes);
        return firestoreResumes;
      }
    } catch (e) {
      console.warn('Could not sync resumes from Firestore, using local cached data:', e);
    }
    return this.getResumes();
  }

  static saveResumes(resumes: ResumeData[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(resumes));
    } catch (e) {
      console.error('Error saving resumes to localStorage', e);
    }
  }

  static getResumeById(id: string): ResumeData | undefined {
    const resumes = this.getResumes();
    return resumes.find(r => r.id === id);
  }

  static saveResume(resume: ResumeData, createSnapshot = false, snapshotAction = 'Manual Save'): ResumeData {
    const resumes = this.getResumes();
    const ats = calculateATSMetrics(resume);
    const completion = calculateCompletionScore(resume);

    const updatedResume: ResumeData = {
      ...resume,
      atsScore: ats.overallScore,
      completionScore: completion,
      updatedAt: new Date().toISOString(),
    };

    const existingIndex = resumes.findIndex(r => r.id === resume.id);
    if (existingIndex >= 0) {
      resumes[existingIndex] = updatedResume;
    } else {
      resumes.unshift(updatedResume);
    }

    this.saveResumes(resumes);

    if (createSnapshot) {
      this.createVersionSnapshot(updatedResume, snapshotAction);
    }

    // Background asynchronous sync to Firebase Firestore
    try {
      const currentAuthUser = auth.currentUser;
      const targetUserId = updatedResume.userId || currentAuthUser?.uid;
      if (targetUserId) {
        const resumeRef = doc(db, 'resumes', updatedResume.id);
        setDoc(resumeRef, { ...updatedResume, userId: targetUserId }, { merge: true }).catch(err => {
          console.warn('Firestore resume background sync warning:', err);
        });
      }
    } catch (err) {
      console.warn('Firestore resume sync skipped:', err);
    }

    return updatedResume;
  }

  static duplicateResume(id: string): ResumeData | undefined {
    const original = this.getResumeById(id);
    if (!original) return undefined;

    const newId = `resume-${Date.now()}`;
    const duplicated: ResumeData = {
      ...JSON.parse(JSON.stringify(original)),
      id: newId,
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDefault: false,
    };

    const resumes = this.getResumes();
    resumes.unshift(duplicated);
    this.saveResumes(resumes);

    // Sync duplicated resume to Firestore
    try {
      const currentAuthUser = auth.currentUser;
      const targetUserId = duplicated.userId || currentAuthUser?.uid;
      if (targetUserId) {
        const resumeRef = doc(db, 'resumes', duplicated.id);
        setDoc(resumeRef, { ...duplicated, userId: targetUserId }).catch(err => {
          console.warn('Firestore duplicate sync error:', err);
        });
      }
    } catch (err) {}

    return duplicated;
  }

  static deleteResume(id: string): boolean {
    const resumes = this.getResumes();
    const filtered = resumes.filter(r => r.id !== id);
    this.saveResumes(filtered);

    // Delete from Firestore
    try {
      const resumeRef = doc(db, 'resumes', id);
      deleteDoc(resumeRef).catch(err => {
        console.warn('Firestore resume deletion error:', err);
      });
    } catch (e) {}

    return true;
  }

  static getActiveResumeId(): string {
    const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_RESUME_ID);
    if (id) return id;
    const resumes = this.getResumes();
    return resumes[0]?.id || 'resume-1';
  }

  static setActiveResumeId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_RESUME_ID, id);
  }

  // --- Version Snapshots & History ---
  static getVersions(resumeId: string): ResumeVersion[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VERSIONS);
      if (data) {
        const all: ResumeVersion[] = JSON.parse(data);
        return all.filter(v => v.resumeId === resumeId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }
    } catch (e) {
      console.error('Error reading versions', e);
    }
    return [];
  }

  static createVersionSnapshot(resume: ResumeData, action: string, customTitle?: string): ResumeVersion {
    const versions: ResumeVersion[] = [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VERSIONS);
      if (data) versions.push(...JSON.parse(data));
    } catch (e) {}

    const newVersion: ResumeVersion = {
      id: `ver-${Date.now()}`,
      resumeId: resume.id,
      title: customTitle?.trim() || resume.title || 'Resume Snapshot',
      timestamp: new Date().toISOString(),
      action,
      atsScore: resume.atsScore || 80,
      snapshot: JSON.parse(JSON.stringify(resume)),
    };

    versions.unshift(newVersion);
    // Keep max 50 versions
    const pruned = versions.slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.VERSIONS, JSON.stringify(pruned));

    // Async persist to Firestore
    try {
      const currentAuthUser = auth.currentUser;
      const targetUserId = resume.userId || currentAuthUser?.uid;
      if (targetUserId) {
        const versionRef = doc(db, 'resume_versions', newVersion.id);
        setDoc(versionRef, { ...newVersion, userId: targetUserId }).catch(err => {
          console.warn('Firestore snapshot sync error:', err);
        });
      }
    } catch (err) {}

    return newVersion;
  }

  static renameVersion(versionId: string, newTitle: string): boolean {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VERSIONS);
      if (data) {
        const all: ResumeVersion[] = JSON.parse(data);
        const target = all.find(v => v.id === versionId);
        if (target) {
          target.title = newTitle.trim() || target.title;
          localStorage.setItem(STORAGE_KEYS.VERSIONS, JSON.stringify(all));

          // Sync to Firestore
          try {
            const versionRef = doc(db, 'resume_versions', versionId);
            setDoc(versionRef, { title: target.title }, { merge: true }).catch(() => {});
          } catch (e) {}

          return true;
        }
      }
    } catch (e) {
      console.error('Error renaming version', e);
    }
    return false;
  }

  static deleteVersion(versionId: string): boolean {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VERSIONS);
      if (data) {
        const all: ResumeVersion[] = JSON.parse(data);
        const filtered = all.filter(v => v.id !== versionId);
        localStorage.setItem(STORAGE_KEYS.VERSIONS, JSON.stringify(filtered));

        // Firestore deletion
        try {
          const versionRef = doc(db, 'resume_versions', versionId);
          deleteDoc(versionRef).catch(() => {});
        } catch (e) {}

        return true;
      }
    } catch (e) {
      console.error('Error deleting version', e);
    }
    return false;
  }

  static restoreVersion(versionId: string): ResumeData | undefined {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VERSIONS);
      if (data) {
        const all: ResumeVersion[] = JSON.parse(data);
        const target = all.find(v => v.id === versionId);
        if (target) {
          return this.saveResume(target.snapshot, true, `Restored snapshot: ${target.title}`);
        }
      }
    } catch (e) {}
    return undefined;
  }

  // --- User Profile & Entitlements ---
  static getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_USER, ...parsed };
        }
      }
    } catch (e) {}
    return { ...DEFAULT_USER };
  }

  static async fetchUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
    if (!userId) return null;
    try {
      const userDocRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const firestoreProfile = docSnap.data() as UserProfile;
        this.saveUserProfile(firestoreProfile);
        return firestoreProfile;
      }
    } catch (e) {
      console.warn('Could not retrieve user profile from Firestore:', e);
    }
    return null;
  }

  static isOnboardingComplete(): boolean {
    const profile = this.getUserProfile();
    return !!profile.isOnboarded;
  }

  static setOnboardingComplete(val: boolean = true): void {
    const profile = this.getUserProfile();
    profile.isOnboarded = val;
    this.saveUserProfile(profile);
  }

  static saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));

    // Save to Firestore users collection
    if (profile.id) {
      try {
        const userRef = doc(db, 'users', profile.id);
        setDoc(userRef, profile, { merge: true }).catch(err => {
          console.warn('Firestore user profile sync error:', err);
        });
      } catch (err) {}
    }
  }

  // Centralized Entitlement Check
  static canCreateResume(): boolean {
    const profile = this.getUserProfile();
    if (profile.plan === 'pro' || profile.plan === 'premium') return true;
    const resumes = this.getResumes();
    return resumes.length < 2; // Free plan limit
  }

  static canUseAI(): boolean {
    const profile = this.getUserProfile();
    return profile.aiCreditsRemaining > 0 || profile.plan === 'premium';
  }

  static deductAICredit(): void {
    const profile = this.getUserProfile();
    if (profile.aiCreditsRemaining > 0) {
      profile.aiCreditsRemaining -= 1;
      this.saveUserProfile(profile);
    }
  }

  // --- Cover Letters ---
  static getCoverLetters(): CoverLetter[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COVER_LETTERS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  }

  static saveCoverLetter(letter: CoverLetter): void {
    const letters = this.getCoverLetters();
    const idx = letters.findIndex(l => l.id === letter.id);
    if (idx >= 0) {
      letters[idx] = letter;
    } else {
      letters.unshift(letter);
    }
    localStorage.setItem(STORAGE_KEYS.COVER_LETTERS, JSON.stringify(letters));

    // Firestore sync
    try {
      const currentAuthUser = auth.currentUser;
      const targetUserId = currentAuthUser?.uid || 'user-default';
      const letterRef = doc(db, 'cover_letters', letter.id);
      setDoc(letterRef, { ...letter, userId: targetUserId }, { merge: true }).catch(err => {
        console.warn('Firestore cover letter sync error:', err);
      });
    } catch (e) {}
  }

  static deleteCoverLetter(id: string): void {
    const letters = this.getCoverLetters().filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.COVER_LETTERS, JSON.stringify(letters));

    try {
      const letterRef = doc(db, 'cover_letters', id);
      deleteDoc(letterRef).catch(err => {
        console.warn('Firestore cover letter deletion error:', err);
      });
    } catch (e) {}
  }

  // --- Analytics Event Tracking ---
  static trackEvent(eventName: string, properties?: Record<string, any>): void {
    try {
      const log = {
        event: eventName,
        timestamp: new Date().toISOString(),
        properties: properties || {},
      };
      const raw = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
      const events = raw ? JSON.parse(raw) : [];
      events.push(log);
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(events.slice(-100)));

      // Optional Firestore Analytics logging
      try {
        const currentAuthUser = auth.currentUser;
        if (currentAuthUser?.uid) {
          const eventRef = doc(collection(db, 'analytics_events'));
          setDoc(eventRef, { ...log, userId: currentAuthUser.uid }).catch(() => {});
        }
      } catch (e) {}
    } catch (e) {}
  }
}

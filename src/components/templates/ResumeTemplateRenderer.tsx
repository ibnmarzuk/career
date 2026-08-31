import React from 'react';
import { ResumeData, SectionKey } from '../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react';

interface TemplateRendererProps {
  resume: ResumeData;
  scale?: number;
  isPreview?: boolean;
  className?: string;
}

export const ResumeTemplateRenderer: React.FC<TemplateRendererProps> = ({
  resume,
  scale = 1,
  isPreview = false,
  className = '',
}) => {
  const {
    personalInfo,
    summary,
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    awards = [],
    languages = [],
    volunteer = [],
    publications = [],
    customSections = [],
    sectionOrder = ['personal', 'summary', 'experience', 'skills', 'projects', 'education', 'certifications', 'awards', 'languages'],
    enabledSections = {} as Record<SectionKey, boolean>,
    customization,
    templateId = 'modern',
  } = resume;

  const accentColor = customization?.accentColor || '#2563eb';
  const textColor = customization?.textColor || '#0f172a';

  // Font family mapping
  const getFontFamily = () => {
    switch (customization?.fontFamily) {
      case 'EB Garamond':
        return 'font-serif-classic';
      case 'Playfair Display':
        return 'font-serif-display';
      case 'Outfit':
        return 'font-display-modern';
      case 'Space Grotesk':
        return 'font-space';
      case 'Cinzel':
        return 'font-cinzel';
      case 'Fira Code':
        return 'font-mono-code';
      case 'Inter':
        return 'font-sans';
      case 'Plus Jakarta Sans':
      default:
        return 'font-sans-modern';
    }
  };

  // Spacing & sizing scales
  const getFontSizeClass = () => {
    switch (customization?.fontSize) {
      case 'sm':
        return 'text-[12px] leading-[1.4]';
      case 'lg':
        return 'text-[14.5px] leading-[1.6]';
      case 'base':
      default:
        return 'text-[13px] leading-[1.5]';
    }
  };

  const getHeadingSizeClass = () => {
    switch (customization?.headingSize) {
      case 'sm':
        return 'text-[14px] font-bold tracking-tight';
      case 'xl':
        return 'text-[20px] font-extrabold tracking-tight';
      case 'lg':
      default:
        return 'text-[16px] font-bold tracking-tight';
    }
  };

  const getSectionSpacingClass = () => {
    switch (customization?.sectionSpacing) {
      case 'compact':
        return 'mb-3.5';
      case 'spacious':
        return 'mb-6';
      case 'normal':
      default:
        return 'mb-4.5';
    }
  };

  const getMarginsClass = () => {
    switch (customization?.margins) {
      case 'compact':
        return 'p-6';
      case 'spacious':
        return 'p-12';
      case 'normal':
      default:
        return 'p-8 sm:p-10';
    }
  };

  const getBulletClass = () => {
    switch (customization?.bulletStyle) {
      case 'circle':
        return 'list-circle pl-4';
      case 'dash':
        return 'list-none pl-3 before:content-["–_"]';
      case 'arrow':
        return 'list-none pl-3 before:content-["▸_"]';
      case 'none':
        return 'list-none pl-0';
      case 'disc':
      default:
        return 'list-disc pl-4';
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    if (dateStr.toLowerCase() === 'present') return 'Present';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 2) {
        const year = parts[0];
        const monthNum = parseInt(parts[1], 10);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (customization?.dateFormat === 'MM/YYYY') return `${parts[1]}/${year}`;
        if (customization?.dateFormat === 'YYYY') return year;
        return `${months[monthNum - 1] || parts[1]} ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Section Header Component styled by template
  const renderSectionHeader = (title: string, icon?: React.ReactNode) => {
    if (templateId === 'ats-pro') {
      return (
        <div className="border-b border-slate-400 pb-1 mb-2.5 mt-2 flex items-center justify-between">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-900">{title}</h2>
        </div>
      );
    }
    if (templateId === 'executive') {
      return (
        <div className="border-b-2 pb-1 mb-3 mt-1 flex items-center gap-2" style={{ borderColor: accentColor }}>
          <h2 className={`font-serif-display ${getHeadingSizeClass()} tracking-wide`} style={{ color: accentColor }}>
            {title.toUpperCase()}
          </h2>
        </div>
      );
    }
    if (templateId === 'academic') {
      return (
        <div className="border-b-2 border-slate-900 pb-1 mb-3 mt-2">
          <h2 className={`font-serif-classic ${getHeadingSizeClass()} tracking-wide text-slate-900 uppercase`}>
            {title}
          </h2>
        </div>
      );
    }
    if (templateId === 'graduate') {
      return (
        <div className="flex items-center gap-2 mb-3 pb-1 border-b-2" style={{ borderColor: `${accentColor}30` }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
          <h2 className={`${getHeadingSizeClass()} text-slate-900 tracking-tight font-bold`}>{title}</h2>
        </div>
      );
    }
    if (templateId === 'photo-resume') {
      return (
        <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-slate-200">
          <div className="w-1.5 h-4.5 rounded-full" style={{ backgroundColor: accentColor }} />
          <h2 className={`${getHeadingSizeClass()} text-slate-900 tracking-tight font-bold uppercase text-[13px]`}>{title}</h2>
        </div>
      );
    }
    if (templateId === 'classic') {
      return (
        <div className="text-center border-b border-slate-300 pb-1 mb-3 mt-2">
          <h2 className={`font-serif-classic ${getHeadingSizeClass()} tracking-widest uppercase text-slate-800`}>
            {title}
          </h2>
        </div>
      );
    }
    if (templateId === 'minimal') {
      return (
        <div className="pb-1 mb-2 mt-1 flex items-center justify-between">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.15em] text-slate-600">{title}</h2>
          <div className="h-px bg-slate-200 flex-1 ml-4" />
        </div>
      );
    }
    if (templateId === 'tech') {
      return (
        <div className="flex items-center gap-2 mb-2.5 pb-1 border-b border-slate-200">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          <h2 className="font-space text-[14px] font-bold uppercase tracking-wider text-slate-900">{title}</h2>
        </div>
      );
    }

    // Default Modern Clean Header
    return (
      <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-200">
        <div className="w-1.5 h-4 rounded-sm" style={{ backgroundColor: accentColor }} />
        <h2 className={`${getHeadingSizeClass()} text-slate-900 tracking-tight font-semibold`}>{title}</h2>
      </div>
    );
  };

  // Section Renderers
  const renderSummarySection = () => {
    if (!summary || enabledSections.summary === false) return null;
    return (
      <section className={getSectionSpacingClass()}>
        {renderSectionHeader('Professional Summary')}
        <p className="text-slate-700 leading-relaxed text-justify">{summary}</p>
      </section>
    );
  };

  const renderExperienceSection = () => {
    if (!experience?.length || enabledSections.experience === false) return null;
    return (
      <section className={getSectionSpacingClass()}>
        {renderSectionHeader('Work Experience')}
        <div className="space-y-4">
          {experience.map(exp => (
            <div key={exp.id} className="relative">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1 gap-1">
                <div>
                  <h3 className="font-semibold text-slate-900 text-[14px]">{exp.jobTitle}</h3>
                  <div className="text-slate-700 font-medium text-[13px] flex items-center gap-1.5">
                    <span>{exp.company}</span>
                    {exp.location && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 font-normal">{exp.location}</span>
                      </>
                    )}
                    {exp.employmentType && exp.employmentType !== 'Full-time' && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-normal">
                        {exp.employmentType}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[12px] font-medium text-slate-500 whitespace-nowrap">
                  {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>

              {exp.description && <p className="text-slate-600 text-[12.5px] mb-1.5 italic">{exp.description}</p>}

              {exp.bullets && exp.bullets.length > 0 && (
                <ul className={`space-y-1 text-slate-700 ${getBulletClass()}`}>
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className="leading-snug">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                  <span className="text-[11px] font-semibold text-slate-400">Skills:</span>
                  {exp.skillsUsed.map((sk, idx) => (
                    <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                      {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducationSection = () => {
    if (!education?.length || enabledSections.education === false) return null;
    return (
      <section className={getSectionSpacingClass()}>
        {renderSectionHeader('Education')}
        <div className="space-y-3">
          {education.map(edu => (
            <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <h3 className="font-semibold text-slate-900 text-[14px]">
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                </h3>
                <div className="text-slate-700 text-[13px] flex items-center gap-1.5">
                  <span className="font-medium">{edu.institution}</span>
                  {edu.location && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">{edu.location}</span>
                    </>
                  )}
                  {edu.gpa && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-semibold">GPA: {edu.gpa}</span>
                    </>
                  )}
                </div>
                {edu.honors && <p className="text-[12px] text-slate-600 mt-0.5 italic">{edu.honors}</p>}
                {edu.description && <p className="text-[12px] text-slate-600 mt-0.5">{edu.description}</p>}
              </div>
              <span className="text-[12px] font-medium text-slate-500 whitespace-nowrap">
                {formatDate(edu.startDate)} — {edu.isCurrent ? 'Present' : formatDate(edu.endDate)}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSkillsSection = () => {
    if (!skills?.length || enabledSections.skills === false) return null;

    // Group skills by category
    const technical = skills.filter(s => s.category === 'Technical' || s.category === 'Frameworks' || s.category === 'Languages');
    const tools = skills.filter(s => s.category === 'Tools');
    const soft = skills.filter(s => s.category === 'Soft' || s.category === 'Other');

    return (
      <section className={getSectionSpacingClass()}>
        {renderSectionHeader('Skills & Competencies')}
        <div className="space-y-1.5 text-[13px]">
          {technical.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1">
              <span className="font-semibold text-slate-900 min-w-[130px]">Technical Skills:</span>
              <span className="text-slate-700">{technical.map(s => s?.name || '').filter(Boolean).join(', ')}</span>
            </div>
          )}
          {tools.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1">
              <span className="font-semibold text-slate-900 min-w-[130px]">Tools & Platforms:</span>
              <span className="text-slate-700">{tools.map(s => s?.name || '').filter(Boolean).join(', ')}</span>
            </div>
          )}
          {soft.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1">
              <span className="font-semibold text-slate-900 min-w-[130px]">Core Competencies:</span>
              <span className="text-slate-700">{soft.map(s => s?.name || '').filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderProjectsSection = () => {
    if (!projects?.length || enabledSections.projects === false) return null;
    return (
      <section className={getSectionSpacingClass()}>
        {renderSectionHeader('Featured Projects')}
        <div className="space-y-3">
          {projects.map(proj => (
            <div key={proj.id}>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-0.5 gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 text-[13.5px]">{proj.title}</h3>
                  {proj.url && (
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs flex items-center gap-0.5 hover:underline"
                      style={{ color: accentColor }}
                    >
                      <span>Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-0.5"
                    >
                      <Github className="w-3 h-3" />
                      <span>Code</span>
                    </a>
                  )}
                </div>
                {proj.startDate && (
                  <span className="text-[12px] text-slate-500">
                    {formatDate(proj.startDate)} {proj.endDate ? `— ${formatDate(proj.endDate)}` : ''}
                  </span>
                )}
              </div>

              {proj.role && <p className="text-[12px] text-slate-500 mb-1">{proj.role}</p>}

              {proj.bullets && proj.bullets.length > 0 && (
                <ul className={`space-y-0.5 text-slate-700 ${getBulletClass()}`}>
                  {proj.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              )}

              {proj.techStack && proj.techStack.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {proj.techStack.map((tech, idx) => (
                    <span key={idx} className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertificationsSection = () => {
    if (!certifications?.length || enabledSections.certifications === false) return null;
    return (
      <section className={getSectionSpacingClass()}>
        {renderSectionHeader('Certifications')}
        <div className="space-y-2">
          {certifications.map(cert => (
            <div key={cert.id} className="flex justify-between items-baseline text-[13px]">
              <div>
                <span className="font-semibold text-slate-900">{cert?.name || 'Certification'}</span>
                {cert.issuer && <span className="text-slate-500 ml-1.5">— {cert.issuer}</span>}
                {cert.credentialId && <span className="text-[11px] text-slate-400 ml-1.5">(ID: {cert.credentialId})</span>}
              </div>
              <span className="text-[12px] text-slate-500 whitespace-nowrap">{formatDate(cert.issueDate)}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderAwardsSection = () => {
    if (!awards?.length || enabledSections.awards === false) return null;
    return (
      <section className={getSectionSpacingClass()}>
        {renderSectionHeader('Honors & Awards')}
        <div className="space-y-1.5 text-[13px]">
          {awards.map(aw => (
            <div key={aw.id} className="flex justify-between items-baseline">
              <div>
                <span className="font-semibold text-slate-900">{aw.title}</span>
                <span className="text-slate-500 ml-1.5">— {aw.issuer}</span>
                {aw.description && <p className="text-[12px] text-slate-600">{aw.description}</p>}
              </div>
              <span className="text-[12px] text-slate-500">{formatDate(aw.date)}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderLanguagesSection = () => {
    if (!languages?.length || enabledSections.languages === false) return null;
    return (
      <section className={getSectionSpacingClass()}>
        {renderSectionHeader('Languages')}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px]">
          {languages.map(lang => (
            <div key={lang.id} className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900">{lang?.name || 'Language'}:</span>
              <span className="text-slate-600">{lang.proficiency}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Dynamic dispatch by section order
  const renderSectionByKey = (key: SectionKey) => {
    switch (key) {
      case 'summary':
        return renderSummarySection();
      case 'experience':
        return renderExperienceSection();
      case 'education':
        return renderEducationSection();
      case 'skills':
        return renderSkillsSection();
      case 'projects':
        return renderProjectsSection();
      case 'certifications':
        return renderCertificationsSection();
      case 'awards':
        return renderAwardsSection();
      case 'languages':
        return renderLanguagesSection();
      default:
        return null;
    }
  };

  // Header Banner Component for Executive layout
  const renderExecutiveHeader = () => (
    <div className="bg-slate-900 text-white p-8 rounded-t-sm -mx-8 -mt-8 sm:-mx-10 sm:-mt-10 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold tracking-wide">{personalInfo?.fullName}</h1>
          <p className="text-slate-300 text-sm sm:text-base font-medium mt-1 tracking-wider uppercase">
            {personalInfo?.jobTitle}
          </p>
        </div>
        {personalInfo?.showAvatar && personalInfo?.avatarUrl && (
          <img
            src={personalInfo.avatarUrl}
            alt={personalInfo.fullName}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shadow-sm"
          />
        )}
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-300 mt-4 pt-3 border-t border-slate-800">
        {personalInfo?.email && (
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            {personalInfo.email}
          </span>
        )}
        {personalInfo?.phone && (
          <span className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            {personalInfo.phone}
          </span>
        )}
        {personalInfo?.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {personalInfo.location}
          </span>
        )}
        {personalInfo?.linkedin && (
          <span className="flex items-center gap-1">
            <Linkedin className="w-3.5 h-3.5 text-slate-400" />
            {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'in/')}
          </span>
        )}
      </div>
    </div>
  );

  // Photo Resume Header
  const renderPhotoResumeHeader = () => (
    <header className="mb-6 pb-5 border-b-2 border-slate-200">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {personalInfo?.avatarUrl ? (
          <img
            src={personalInfo.avatarUrl}
            alt={personalInfo.fullName}
            referrerPolicy="no-referrer"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border-2 shadow-md shrink-0"
            style={{ borderColor: accentColor }}
          />
        ) : (
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl flex items-center justify-center font-bold text-2xl text-white shadow-md shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            {personalInfo?.fullName ? personalInfo.fullName.charAt(0) : 'U'}
          </div>
        )}
        <div className="flex-1 text-center sm:text-left">
          <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-1" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
            Featured Professional
          </div>
          <h1 className={`${getFontFamily()} text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900`}>
            {personalInfo?.fullName || 'Your Full Name'}
          </h1>
          <p className="text-slate-600 font-semibold text-base mt-0.5">{personalInfo?.jobTitle}</p>

          <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1.5 text-[12px] text-slate-600 mt-3 pt-2.5 border-t border-slate-100">
            {personalInfo?.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo?.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo?.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo?.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'in/')}
              </span>
            )}
            {personalInfo?.github && (
              <span className="flex items-center gap-1">
                <Github className="w-3.5 h-3.5 text-slate-400" />
                {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, 'gh/')}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  // Standard Header for Modern / Classic / Minimal / ATS
  const renderStandardHeader = () => {
    const isClassic = templateId === 'classic';
    const isATS = templateId === 'ats-pro';
    const isCenter = customization?.headerStyle === 'center' || isClassic;

    return (
      <header className={`mb-6 pb-4 border-b border-slate-200 ${isCenter ? 'text-center' : ''}`}>
        <div className={`flex items-center justify-between ${isCenter ? 'justify-center' : ''} gap-4`}>
          <div>
            <h1
              className={`${getFontFamily()} text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900`}
              style={templateId === 'modern' ? { color: accentColor } : {}}
            >
              {personalInfo?.fullName || 'Your Full Name'}
            </h1>
            <p className="text-slate-600 font-semibold text-sm sm:text-base mt-0.5">{personalInfo?.jobTitle}</p>
          </div>

          {/* ATS templates intentionally hide avatar for parser compliance */}
          {!isATS && personalInfo?.showAvatar && personalInfo?.avatarUrl && (
            <img
              src={personalInfo.avatarUrl}
              alt={personalInfo.fullName}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border border-slate-200 shadow-xs"
            />
          )}
        </div>

        <div className={`flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate-600 mt-2.5 ${isCenter ? 'justify-center' : 'items-center'}`}>
          {personalInfo?.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo?.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo?.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo?.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              {personalInfo.website.replace(/^https?:\/\//, '')}
            </span>
          )}
          {personalInfo?.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3.5 h-3.5 text-slate-400" />
              {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'in/')}
            </span>
          )}
          {personalInfo?.github && (
            <span className="flex items-center gap-1">
              <Github className="w-3.5 h-3.5 text-slate-400" />
              {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, 'gh/')}
            </span>
          )}
        </div>
      </header>
    );
  };

  // Two Column Creative / Sidebar Layout
  if (templateId === 'creative') {
    return (
      <div
        id="resume-document-root"
        className={`resume-page-print bg-white text-slate-900 shadow-xl border border-slate-200/80 rounded-sm mx-auto overflow-hidden ${getFontFamily()} ${getFontSizeClass()} ${className}`}
        style={{
          width: '100%',
          maxWidth: '210mm',
          minHeight: '297mm',
          transform: isPreview ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
        }}
      >
        <div className="grid grid-cols-12 min-h-[297mm]">
          {/* Left Sidebar */}
          <div className="col-span-4 bg-slate-900 text-white p-6 sm:p-7 flex flex-col justify-between">
            <div>
              {personalInfo?.showAvatar && personalInfo?.avatarUrl && (
                <div className="mb-4 text-center">
                  <img
                    src={personalInfo.avatarUrl}
                    alt={personalInfo.fullName}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-violet-400 shadow-sm"
                  />
                </div>
              )}

              <h1 className="text-xl font-bold text-white tracking-tight">{personalInfo?.fullName}</h1>
              <p className="text-xs text-violet-300 font-medium uppercase tracking-wider mt-1">{personalInfo?.jobTitle}</p>

              {/* Contact Info */}
              <div className="mt-6 space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4">
                {personalInfo?.email && (
                  <div className="flex items-center gap-1.5 break-all">
                    <Mail className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span>{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo?.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo?.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo?.linkedin && (
                  <div className="flex items-center gap-1.5 break-all">
                    <Linkedin className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
                  </div>
                )}
              </div>

              {/* Skills in Sidebar */}
              {skills && skills.length > 0 && enabledSections.skills !== false && (
                <div className="mt-6 border-t border-slate-800 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-violet-300 mb-3">Skills</h3>
                  <div className="space-y-2">
                    {skills.slice(0, 10).map(sk => (
                      <div key={sk.id}>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-slate-200">{sk?.name || ''}</span>
                          <span className="text-slate-400">{sk.level || 'Expert'}</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-500 rounded-full"
                            style={{
                              width: sk.level === 'Beginner' ? '40%' : sk.level === 'Intermediate' ? '65%' : sk.level === 'Advanced' ? '85%' : '100%',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education in Sidebar */}
              {education && education.length > 0 && enabledSections.education !== false && (
                <div className="mt-6 border-t border-slate-800 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-violet-300 mb-2">Education</h3>
                  <div className="space-y-2 text-xs">
                    {education.map(edu => (
                      <div key={edu.id}>
                        <p className="font-semibold text-white">{edu.degree}</p>
                        <p className="text-slate-300">{edu.institution}</p>
                        <p className="text-[11px] text-slate-400">{edu.startDate} - {edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-500 mt-6 pt-4 border-t border-slate-800">
              ResumeForge AI Generated
            </div>
          </div>

          {/* Right Main Column */}
          <div className="col-span-8 p-6 sm:p-8 bg-white">
            {renderSummarySection()}
            {renderExperienceSection()}
            {renderProjectsSection()}
            {renderCertificationsSection()}
            {renderAwardsSection()}
            {renderLanguagesSection()}
          </div>
        </div>
      </div>
    );
  }

  // Standard Single Column or Banner Layout (Modern, Executive, Minimal, Classic, ATS-Pro, Tech, Academic, Graduate)
  return (
    <div
      id="resume-document-root"
      className={`resume-page-print bg-white text-slate-900 shadow-xl border border-slate-200/80 rounded-sm mx-auto ${getFontFamily()} ${getFontSizeClass()} ${getMarginsClass()} ${className}`}
      style={{
        width: '100%',
        maxWidth: '210mm',
        minHeight: '297mm',
        transform: isPreview ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
    >
      {templateId === 'photo-resume'
        ? renderPhotoResumeHeader()
        : templateId === 'executive'
        ? renderExecutiveHeader()
        : renderStandardHeader()}

      <main>
        {sectionOrder.map(key => (
          <React.Fragment key={key}>{renderSectionByKey(key)}</React.Fragment>
        ))}
      </main>
    </div>
  );
};

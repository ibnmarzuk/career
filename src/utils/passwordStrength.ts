export interface PasswordValidationResult {
  score: number; // 0 to 4
  label: 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  color: string;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (hasUppercase && hasLowercase) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecialChar) score += 1;

  // Normalized score 0-4
  let normalizedScore = 0;
  if (password.length === 0) {
    normalizedScore = 0;
  } else if (score <= 2) {
    normalizedScore = 1; // Weak
  } else if (score === 3) {
    normalizedScore = 2; // Fair
  } else if (score === 4) {
    normalizedScore = 3; // Strong
  } else {
    normalizedScore = 4; // Very Strong
  }

  const labels: Record<number, 'Weak' | 'Fair' | 'Strong' | 'Very Strong'> = {
    0: 'Weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Strong',
    4: 'Very Strong',
  };

  const colors: Record<number, string> = {
    0: 'bg-slate-200',
    1: 'bg-rose-500',
    2: 'bg-amber-500',
    3: 'bg-blue-500',
    4: 'bg-emerald-500',
  };

  // Stated requirements: >=8 chars, 1 uppercase, 1 lowercase, 1 number
  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber;

  return {
    score: normalizedScore,
    label: labels[normalizedScore],
    color: colors[normalizedScore],
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    isValid,
  };
}

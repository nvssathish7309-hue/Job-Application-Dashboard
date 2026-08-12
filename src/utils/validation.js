/**
 * Client-side validation helper functions for Add Candidate form.
 */

export function validateCandidateForm(formData) {
  const errors = {};

  // Full Name validation (Minimum 2 characters)
  if (!formData.name || !formData.name.trim()) {
    errors.name = "Full Name is required.";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Full Name must be at least 2 characters.";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !formData.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!emailRegex.test(formData.email.trim())) {
    errors.email = "Please enter a valid email address (e.g. name@example.com).";
  }

  // Phone validation (MUST be exactly 10 digits)
  const rawPhone = (formData.phone || '').trim();
  const phoneDigits = rawPhone.replace(/\D/g, '');
  let mobileDigits = phoneDigits;
  if (phoneDigits.length === 12 && phoneDigits.startsWith('91')) {
    mobileDigits = phoneDigits.slice(2);
  }

  if (!rawPhone) {
    errors.phone = "Phone number is required.";
  } else if (mobileDigits.length !== 10) {
    errors.phone = "Phone number must be exactly 10 digits (11 digits is not allowed).";
  }

  // Role validation
  if (!formData.role) {
    errors.role = "Please select a target role.";
  }

  // Experience validation
  if (!formData.experience) {
    errors.experience = "Please select experience level.";
  }

  // Skills validation (at least 1 skill)
  if (!formData.skills || formData.skills.length === 0) {
    errors.skills = "At least one skill tag is required.";
  }

  // Education validation
  if (!formData.education || !formData.education.trim()) {
    errors.education = "Education details are required.";
  }

  // Resume validation
  if (!formData.resume && !formData.resumeFileName) {
    errors.resume = "Please upload a resume (PDF, DOC, or DOCX).";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

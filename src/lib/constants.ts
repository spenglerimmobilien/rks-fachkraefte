export const PROFESSIONS = [
  "nursing",
  "craft",
  "it",
  "gastronomy",
  "logistics",
  "construction",
] as const;

export const GERMAN_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2", "none"] as const;

export const APPLICATION_STATUSES = [
  "RECEIVED",
  "IN_REVIEW",
  "QUALIFIED",
  "MATCHING",
  "PLACED",
  "VISA",
  "ARRIVED",
] as const;

export const SALARY_ESTIMATES: Record<string, { min: number; max: number }> = {
  nursing: { min: 2800, max: 3800 },
  craft: { min: 2500, max: 4000 },
  it: { min: 4000, max: 6500 },
  gastronomy: { min: 2200, max: 3200 },
  logistics: { min: 2600, max: 3600 },
  construction: { min: 2800, max: 4200 },
};

export const WHATSAPP_NUMBER = "+49 1590 6836396";
export const CONTACT_EMAIL = "info@rks-fachkraefte.de";
export const CONTACT_PHONE = "+49 1590 6836396";

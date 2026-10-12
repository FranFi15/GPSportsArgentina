export const nationalityPath = {
  type: [String],
  required: true,
  validate: {
    validator(value) {
      return Array.isArray(value) && value.some(Boolean);
    },
    message: 'Indicá al menos una nacionalidad.',
  },
};

export function coerceStoredNationality(raw) {
  if (!raw || raw.nacionalidad == null || raw.nacionalidad === '') return;
  if (!Array.isArray(raw.nacionalidad)) {
    raw.nacionalidad = [String(raw.nacionalidad)];
  }
}

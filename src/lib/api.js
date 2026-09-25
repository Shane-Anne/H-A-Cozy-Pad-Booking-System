const defaultApiHost =
  typeof window !== 'undefined' ? window.location.hostname : 'localhost';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  `http://${defaultApiHost}/H-A-Cozy-Pad-Booking-System/api`;

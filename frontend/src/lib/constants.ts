export const JWT_TEMPLATE_NAME = 'supabase';

// Routes

export const CLIENT_ROUTES = {
  CHALLENGES: '/challenges',
  CHALLENGES_CREATE: '/challenges/create',
  CHALLENGES_DETAIL: (id: string) => `/challenges/${id}`,
  SETTINGS: '/settings',
};

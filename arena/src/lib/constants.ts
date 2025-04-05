export const JWT_TEMPLATE_NAME = 'supabase';

// Routes

export const CLIENT_ROUTES = {
  CHALLENGES: '/challenges',
  QUESTIONS: (id: string) => `/challenges/${id}/questions`,
  CHALLENGES_DETAIL: (id: string) => `/challenges/${id}`,
  SETTINGS: '/settings',
};


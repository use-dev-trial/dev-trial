export const JWT_TEMPLATE_NAME = 'supabase';

export const ROUTES = {
  CHECK_ORG: '/sign-up/post',
  CHALLENGES: '/challenges',
  QUESTIONS: (id: string) => `/challenges/${id}/questions`,
  CHALLENGES_DETAIL: (id: string) => `/challenges/${id}`,
  SETTINGS: '/settings',
};

export const CHALLENGE_CARD_GRADIENTS = [
  'from-blue-400 to-blue-600',
  'from-green-400 to-green-600',
  'from-purple-400 to-purple-600',
  'from-orange-400 to-orange-600',
  'from-red-400 to-red-600',
  'from-indigo-400 to-indigo-600',
  'from-pink-400 to-pink-600',
  'from-yellow-400 to-yellow-600',
];

export const MAX_NUM_QUESTIONS = 3;

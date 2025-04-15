export const JWT_TEMPLATE_NAME = 'supabase';

export const ROUTES = {
  CREATE_ORGANIZATION: '/organizations/create',
  SELECT_ORGANIZATION: '/organizations/select',
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

export const TEMPLATE_METRICS = [
  "Code solves the problem correctly in the most straightforward way possible. There isn't over-engineering",
  'Minimal code duplication by abstracting and reusing code sensibly',
  'Maintains consistent naming conventions that are clear and descriptive',
  'Follows the single responsibility principle for functions as much as possible',
  'Avoids deeply nested loops or conditionals. Guard clauses are used appropriately to improve readability',
  'Comments are used appropriately to explain important parts of the logic',
  'Defensive programming is used appropriately to avoid errors in critical sections of the code',
  'Constants are used in place of magic numbers where appropriate',
];

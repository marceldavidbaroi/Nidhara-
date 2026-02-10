export const SWAGGER = {
  DOCS_PATH: 'api',

  TAGS: {
    AUTH: 'Auth',
    USERS: 'Users',
  },

  AUTH_SCHEMES: {
    ACCESS_TOKEN: 'access-token',
  },
} as const;

export const COMMON_ERRORS = {
  BAD_REQUEST: 'Bad request / validation failed',
  UNAUTHORIZED: 'Unauthorized (invalid or missing access token)',
  FORBIDDEN: 'Forbidden (not allowed / invalid session)',
  NOT_FOUND: 'Not found',
  CONFLICT: 'Conflict',
  INTERNAL: 'Internal server error',
} as const;

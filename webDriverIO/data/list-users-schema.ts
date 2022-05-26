const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    email: {
      type: 'string',
      format: 'email',
    },
    first_name: {
      type: 'string',
      minLength: 1,
    },
    last_name: {
      type: 'string',
      minLength: 1,
    },
    avatar: {
      type: 'string',
      format: 'URI',
    },
  },
  required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
};

const supportSchema = {
  type: 'object',
  properties: {
    url: {
      type: 'string',
      format: 'URI',
    },
    text: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['url', 'text'],
};

export const multipleUsersSchema = {
  type: 'object',
  properties: {
    page: { type: 'number' },
    per_page: { type: 'number' },
    total: { type: 'number' },
    total_pages: { type: 'number' },
    data: {
      type: 'array',
      items: userSchema,
    },
    support: supportSchema,
  },
  required: ['page', 'per_page', 'total', 'total_pages', 'data', 'support'],
};

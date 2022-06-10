const userSchema = {
  properties: {
    avatar: {
      format: 'URI',
      type: 'string',
    },
    email: {
      format: 'email',
      type: 'string',
    },
    first_name: {
      minLength: 1,
      type: 'string',
    },
    id: { type: 'number' },
    last_name: {
      minLength: 1,
      type: 'string',
    },
  },
  required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
  type: 'object',
};

const supportSchema = {
  properties: {
    text: {
      minLength: 1,
      type: 'string',
    },
    url: {
      format: 'URI',
      type: 'string',
    },
  },
  required: ['url', 'text'],
  type: 'object',
};

export const multipleUsersSchema = {
  properties: {
    data: {
      items: userSchema,
      type: 'array',
    },
    page: { type: 'number' },
    per_page: { type: 'number' },
    support: supportSchema,
    total: { type: 'number' },
    total_pages: { type: 'number' },
  },
  required: ['page', 'per_page', 'total', 'total_pages', 'data', 'support'],
  type: 'object',
};

const { versionSchemas, combineSchemas } = require('@cypress/schema-tools');
const { expectedUsersBody } = require('./response-bodies.json');

const responseUsersBody = {
  version: {
    major: 1,
    minor: 0,
    patch: 0,
  },
  schema: {
    type: 'object',
    title: 'Response Body',
    description: 'The expected response body of clicking LIST USERS',
    properties: {
      type: 'object',
      properties: {
        page: {
          type: 'integer',
        },
        per_page: {
          type: 'integer',
        },
        total: {
          type: 'integer',
        },
        total_pages: {
          type: 'integer',
        },
        data: {
          type: 'array',
          items: [
            {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                },
                email: {
                  type: 'string',
                },
                first_name: {
                  type: 'string',
                },
                last_name: {
                  type: 'string',
                },
                avatar: {
                  type: 'string',
                },
              },
              required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
            },
            {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                },
                email: {
                  type: 'string',
                },
                first_name: {
                  type: 'string',
                },
                last_name: {
                  type: 'string',
                },
                avatar: {
                  type: 'string',
                },
              },
              required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
            },
            {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                },
                email: {
                  type: 'string',
                },
                first_name: {
                  type: 'string',
                },
                last_name: {
                  type: 'string',
                },
                avatar: {
                  type: 'string',
                },
              },
              required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
            },
            {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                },
                email: {
                  type: 'string',
                },
                first_name: {
                  type: 'string',
                },
                last_name: {
                  type: 'string',
                },
                avatar: {
                  type: 'string',
                },
              },
              required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
            },
            {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                },
                email: {
                  type: 'string',
                },
                first_name: {
                  type: 'string',
                },
                last_name: {
                  type: 'string',
                },
                avatar: {
                  type: 'string',
                },
              },
              required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
            },
            {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                },
                email: {
                  type: 'string',
                },
                first_name: {
                  type: 'string',
                },
                last_name: {
                  type: 'string',
                },
                avatar: {
                  type: 'string',
                },
              },
              required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
            },
          ],
        },
        support: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
            },
            text: {
              type: 'string',
            },
          },
          required: ['url', 'text'],
        },
      },
      required: ['page', 'per_page', 'total', 'total_pages', 'data', 'support'],
    },
  },
  example: expectedUsersBody,
};

const bodyVersions = versionSchemas(responseUsersBody);
export const schemas = combineSchemas(bodyVersions);

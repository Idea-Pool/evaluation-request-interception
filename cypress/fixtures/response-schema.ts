import { combineSchemas, ObjectSchema, SchemaCollection, versionSchemas } from '@cypress/schema-tools';
import { expectedUsersBody } from './response-bodies.json';

const responseUsersBody: ObjectSchema = {
  version: { major: 1, minor: 0, patch: 0 },
  schema: {
    title: 'Response Body',
    type: 'object',
    required: ['page', 'per_page', 'total', 'total_pages', 'data', 'support'],
    additionalProperties: false,
    properties: {
      page: {
        title: 'Page',
        type: 'integer',
      },
      per_page: {
        title: 'Per_page',
        type: 'integer',
      },
      total: {
        title: 'Total',
        type: 'integer',
      },
      total_pages: {
        title: 'Total_pages',
        type: 'integer',
      },
      data: {
        title: 'Data',
        type: 'array',
        items: {
          title: 'Items',
          type: 'object',
          required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
          properties: {
            id: {
              title: 'Id',
              type: 'integer',
            },
            email: {
              title: 'Email',
              type: 'string',
            },
            first_name: {
              title: 'First_name',
              type: 'string',
            },
            last_name: {
              title: 'Last_name',
              type: 'string',
            },
            avatar: {
              title: 'Avatar',
              type: 'string',
            },
          },
        },
      },
      support: {
        title: 'Support',
        type: 'object',
        required: ['url', 'text'],
        properties: {
          url: {
            title: 'Url',
            type: 'string',
          },
          text: {
            title: 'Text',
            type: 'string',
          },
        },
      },
    },
  },
  example: expectedUsersBody,
};

const bodyVersions = versionSchemas(responseUsersBody);
export const schemas: SchemaCollection = combineSchemas(bodyVersions);

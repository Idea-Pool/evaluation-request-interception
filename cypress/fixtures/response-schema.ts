import { combineSchemas, ObjectSchema, SchemaCollection, versionSchemas } from '@cypress/schema-tools';
import { expectedUsersBody } from './response-bodies.json';

const responseUsersBody: ObjectSchema = {
  example: expectedUsersBody,
  schema: {
    additionalProperties: false,
    properties: {
      data: {
        items: {
          properties: {
            avatar: {
              title: 'Avatar',
              type: 'string',
            },
            email: {
              title: 'Email',
              type: 'string',
            },
            first_name: {
              title: 'First_name',
              type: 'string',
            },
            id: {
              title: 'Id',
              type: 'integer',
            },
            last_name: {
              title: 'Last_name',
              type: 'string',
            },
          },
          required: ['id', 'email', 'first_name', 'last_name', 'avatar'],
          title: 'Items',
          type: 'object',
        },
        title: 'Data',
        type: 'array',
      },
      page: {
        title: 'Page',
        type: 'integer',
      },
      per_page: {
        title: 'Per_page',
        type: 'integer',
      },
      support: {
        properties: {
          text: {
            title: 'Text',
            type: 'string',
          },
          url: {
            title: 'Url',
            type: 'string',
          },
        },
        required: ['url', 'text'],
        title: 'Support',
        type: 'object',
      },
      total: {
        title: 'Total',
        type: 'integer',
      },
      total_pages: {
        title: 'Total_pages',
        type: 'integer',
      },
    },
    required: ['page', 'per_page', 'total', 'total_pages', 'data', 'support'],
    title: 'Response Body',
    type: 'object',
  },
  version: { major: 1, minor: 0, patch: 0 },
};

const bodyVersions = versionSchemas(responseUsersBody);
export const schemas: SchemaCollection = combineSchemas(bodyVersions);

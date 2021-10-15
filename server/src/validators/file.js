import config from "../config";

export const fileUploadHeadersSchema = {
  type: 'object',
  required: [ 'Content-parts', 'Content-filesize' ],
  properties: {
    'Content-parts': {
      type: 'number'
    },
    'Content-filesize': {
      type: 'number',
      max: config.MAX_FILE_SIZE
    }
  },
  errorMessage: {
    properties: {
      'Content-parts': '',
      'Content-filesize': 'Files larger than 1GB are not allowed.'
    }
  }
};
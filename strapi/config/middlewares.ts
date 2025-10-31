export default ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'frame-src': ["'self'", env('CLIENT_URL', 'http://localhost:4321')],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '1gb',
      jsonLimit: '1gb',
      textLimit: '1gb',
      formidable: {
        maxFileSize: 1024 * 1024 * 1024, // 1gb in bytes
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  // Preview configuration
  preview: {
    enabled: true,
    config: {
      allowedOrigins: env('CLIENT_URL'),
      async handler(uid, { documentId, locale, status }) {
        // Only handle post previews
        if (uid !== 'api::post.post') {
          return null;
        }

        const document = await strapi.documents(uid).findOne({
          documentId,
          locale,
          status
        });

        if (!document || !document.slug) {
          return null;
        }

        const clientUrl = env('CLIENT_URL', 'http://localhost:4321');
        const previewUrl = `${clientUrl}/posts/${document.slug}?preview=true&status=${status}`;

        return previewUrl;
      },
    },
  },
});

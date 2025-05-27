export default ({ env }) => ({
  email: {
    config: {
      provider: '@strapi/provider-email-nodemailer',
      providerOptions: {
        host: env('STRAPI_SMTP_ADDRESS', 'smtp-relay.brevo.com'),
        port: 587,
        auth: {
          user: env('STRAPI_SMTP_USER_NAME', '8bb6c8001@smtp-brevo.com'),
          pass: env('STRAPI_SMTP_PASSWORD', '7jPR9vYHxgqa42ND'),
        },
      },
      settings: {
        defaultFrom: env('STRAPI_SMTP_FROM_ADDRESS', 'support@lust66.com'),
        defaultReplyTo: env('STRAPI_SMTP_FROM_ADDRESS', 'support@lust66.com'),
      },
    },
  },
});

// import type { Core } from '@strapi/strapi';
import userLifecycles from './extensions/users-permissions/content-types/user/lifecycles';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    // Manually attach the user lifecycle hooks
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
      afterCreate: userLifecycles.afterCreate
    });
    
    console.log('✅ User registration lifecycle hooks registered successfully');
  },
};

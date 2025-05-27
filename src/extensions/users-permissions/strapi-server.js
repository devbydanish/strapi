'use strict';

/**
 * Users-permissions extension to add email notifications
 */

module.exports = (plugin) => {
  // Extend the users-permissions plugin to add email notification after registration
  const sanitizeUser = (user) => {
    const { password, resetPasswordToken, confirmationToken, ...sanitizedUser } = user;
    return sanitizedUser;
  };

  // Add lifecycle hook after user creation
  plugin.controllers.user.afterCreate = async (ctx) => {
    const { result } = ctx.state;
    const sanitizedUser = sanitizeUser(result);
    
    try {
      // Send registration confirmation email
      await strapi.service('api::email.email').sendRegistrationEmail(sanitizedUser);
    } catch (error) {
      console.error('Error sending registration email:', error);
    }
  };

  // Get the original register action
  const originalRegister = plugin.controllers.auth.register;

  // Override the register action
  plugin.controllers.auth.register = async (ctx) => {
    // Call the original register action
    await originalRegister(ctx);
    
    // If the registration was successful, send the email
    if (ctx.response.status === 200) {
      try {
        const userData = ctx.response.body.user;
        // Send registration confirmation email
        await strapi.service('api::email.email').sendRegistrationEmail(userData);
      } catch (error) {
        console.error('Error sending registration email:', error);
      }
    }
  };

  return plugin;
}; 
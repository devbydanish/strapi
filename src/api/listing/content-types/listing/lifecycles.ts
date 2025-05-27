export default {
  async afterCreate(event) {
    const { result, params } = event;
    
    // Skip sending email if running in a seed script
    if (params.data.importSeeding) {
      return;
    }

    try {
      // Get the advertiser (user) who created the listing
      const { advertiserId } = result;
      
      if (!advertiserId) {
        console.warn('No advertiser ID found for listing', result.id);
        return;
      }
      
      // Fetch the user with their email
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', advertiserId);
      
      if (!user) {
        console.warn('User not found for listing', result.id);
        return;
      }
      
      // Send confirmation email to the advertiser
      await strapi.service('api::email.email').sendListingSubmittedEmail(result, user);
      
      // Send notification to admin
      await strapi.service('api::email.email').notifyAdminOfNewListing(result, user);
    } catch (error) {
      console.error('Error sending listing notification emails:', error);
    }
  }
}; 
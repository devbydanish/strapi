interface User {
  id: number;
  email: string;
  username?: string;
}

interface Listing {
  id: number;
  title: string;
  documentId: string;
  description?: string;
  phone?: string;
  approvalStatus: string;
}

interface PopulatedListing extends Listing {
  advertiserId: User;
}

interface LifecycleEvent {
  result: Listing;
  params: {
    data: Record<string, unknown>;
  };
}

export default {
  async afterCreate(event: LifecycleEvent): Promise<void> {
    const { result } = event;
    
    try {
      if (!result?.title) {
        console.error('Missing required listing data');
        return;
      }

      // Fetch the full listing with populated relations
      const fullListing = await strapi.entityService.findOne('api::listing.listing', result.id, {
        populate: ['advertiserId']
      }) as PopulatedListing;

      if (!fullListing?.advertiserId?.email) {
        console.error('Could not find advertiser data for listing:', result.id);
        return;
      }

      const user = {
        id: fullListing.advertiserId.id,
        email: fullListing.advertiserId.email,
        username: fullListing.advertiserId.username || fullListing.advertiserId.email
      };

      const listing = {
        id: result.id,
        title: result.title,
        description: result.description
      };

      console.log('Sending notification emails for listing:', listing.id);

      // Send email to the advertiser
      const advertiserEmailResult = await strapi
        .service('api::email.email')
        .sendListingSubmittedEmail(listing, user);

      if (advertiserEmailResult.success) {
        console.log('Listing submission email sent to advertiser:', user.email);
      } else {
        console.error('Failed to send listing submission email to advertiser:', advertiserEmailResult.error);
      }

      // Notify admin
      const adminEmailResult = await strapi
        .service('api::email.email')
        .notifyAdminOfNewListing(listing, user);

      if (adminEmailResult.success) {
        console.log('Admin notification email sent for listing:', listing.id);
      } else {
        console.error('Failed to send admin notification:', adminEmailResult.error);
      }
    } catch (error) {
      console.error('Error sending listing notification emails:', error);
    }
  }
}; 
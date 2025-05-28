interface User {
  email: string;
  username: string;
}

interface Listing {
  id: number;
  title: string;
  category?: {
    name: string;
  };
  city?: {
    name: string;
  };
}

interface EmailResponse {
  success: boolean;
  error?: any;
}

export default {
  async sendRegistrationEmail(user: User): Promise<EmailResponse> {
    console.log('📧 Attempting to send registration email to:', user.email);
    
    const strapiHost = process.env.STRAPI_HOSTNAME || 'bbs.lust66.com';
    const loginUrl = `https://${strapiHost}/login`;
    
    const emailOptions = {
      to: user.email,
      subject: 'Welcome to Lust66 - Account Confirmation',
      html: `
        <p>Hello ${user.username},</p>
        <p>Thank you for registering as an advertiser on Lust66.</p>
        <p>Your account has been created successfully.</p>
        <p>You can now log in to your account and start creating listings:</p>
        <p><a href="${loginUrl}">Click here to log in</a></p>
        <p>Best regards,</p>
        <p>The Lust66 Team</p>
      `,
    };

    try {
      console.log('Email options:', JSON.stringify(emailOptions, null, 2));
      await strapi.plugins['email'].services.email.send(emailOptions);
      console.log('📧 Registration email sent successfully to:', user.email);
      return { success: true };
    } catch (error) {
      console.error('❌ Error sending registration email:', error);
      return { success: false, error };
    }
  },

  async sendListingSubmittedEmail(listing: Listing, user: User): Promise<EmailResponse> {
    const strapiHost = process.env.STRAPI_HOSTNAME || 'bbs.lust66.com';
    const editUrl = `https://${strapiHost}/listings/${listing.id}/edit`;
    
    const emailOptions = {
      to: user.email,
      subject: 'Your Ad Has Been Submitted - Lust66',
      html: `
        <p>Hello ${user.username},</p>
        <p>Your ad "${listing.title}" has been submitted and is pending approval.</p>
        <p>Our team will review your listing as soon as possible.</p>
        <p>If you need to make changes to your listing, you can edit it here:</p>
        <p><a href="${editUrl}">Edit your listing</a></p>
        <p>Best regards,</p>
        <p>The Lust66 Team</p>
      `,
    };

    try {
      await strapi.plugins['email'].services.email.send(emailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error sending listing submission email:', error);
      return { success: false, error };
    }
  },

  async notifyAdminOfNewListing(listing: Listing, user: User): Promise<EmailResponse> {
    const adminEmail = process.env.STRAPI_NOTIFICATION_EMAIL || 'support@lust66.com';
    const strapiHost = process.env.STRAPI_HOSTNAME || 'bbs.lust66.com';
    const listingUrl = `https://${strapiHost}/admin/content-manager/collectionType/api::listing.listing/${listing.id}`;
    
    const emailOptions = {
      to: adminEmail,
      subject: `New listing submitted by ${user.email}`,
      html: `
        <p>A new listing has been submitted:</p>
        <p><strong>Title:</strong> ${listing.title}</p>
        <p><strong>Advertiser:</strong> ${user.username} (${user.email})</p>
        <p><strong>Category:</strong> ${listing.category?.name || 'N/A'}</p>
        <p><strong>City:</strong> ${listing.city?.name || 'N/A'}</p>
        <p><a href="${listingUrl}">View in admin panel</a></p>
      `,
    };

    try {
      await strapi.plugins['email'].services.email.send(emailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error sending admin notification email:', error);
      return { success: false, error };
    }
  }
}; 
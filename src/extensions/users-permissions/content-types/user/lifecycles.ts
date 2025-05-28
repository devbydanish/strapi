interface StrapiUser {
  id: number;
  email: string;
  username: string;
  password?: string;
  resetPasswordToken?: string;
  confirmationToken?: string;
  confirmed?: boolean;
  blocked?: boolean;
  role?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface LifecycleEvent {
  result: StrapiUser;
  params: {
    data: Record<string, unknown>;
  };
}

export default {
  async afterCreate(event: LifecycleEvent): Promise<void> {
    const { result } = event;
    console.log('User lifecycle afterCreate event triggered:', result);
    
    try {
      if (!result?.email || !result?.username) {
        console.error('Missing required user data for email notification');
        return;
      }

      // Sanitize user data before sending
      const sanitizedUser = {
        id: result.id,
        email: result.email,
        username: result.username
      };

      console.log('User created, sending welcome email to:', sanitizedUser.email);
      
      // Send registration confirmation email
      const emailResult = await strapi
        .service('api::email.email')
        .sendRegistrationEmail(sanitizedUser);
      
      if (emailResult.success) {
        console.log('Registration email sent successfully to:', sanitizedUser.email);
      } else {
        console.error('Failed to send registration email:', emailResult.error);
      }
    } catch (error) {
      console.error('Error sending registration email:', error);
    }
  }
}; 
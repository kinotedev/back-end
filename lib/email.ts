import nodemailer from 'nodemailer';

// Email configuration
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

/**
 * Get email transporter configuration
 */
function getEmailConfig(): EmailConfig {
  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  };
}

/**
 * Create email transporter
 */
function createTransporter() {
  const config = getEmailConfig();
  return nodemailer.createTransport(config);
}

/**
 * Email template interfaces
 */
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  email: string,
  verificationToken: string,
  userName?: string
): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    const verificationLink = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px; }
            .content { padding: 20px; background-color: #f9f9f9; margin: 20px 0; border-radius: 5px; }
            .button { background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Kinote!</h1>
            </div>
            <div class="content">
              <p>Hello ${userName || 'User'},</p>
              <p>Thank you for registering with Kinote. Please verify your email address to activate your account.</p>
              <p>Click the button below to verify your email:</p>
              <a href="${verificationLink}" class="button">Verify Email</a>
              <p>Or copy this link in your browser:</p>
              <p><small>${verificationLink}</small></p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Kinote. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions: EmailOptions = {
      to: email,
      subject: 'Verify Your Email - Kinote',
      html,
      text: `Welcome to Kinote! Please verify your email by visiting: ${verificationLink}`,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  userName?: string
): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 5px; }
            .content { padding: 20px; background-color: #f9f9f9; margin: 20px 0; border-radius: 5px; }
            .button { background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
            .warning { color: #dc3545; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello ${userName || 'User'},</p>
              <p>We received a request to reset the password for your Kinote account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetLink}" class="button">Reset Password</a>
              <p>Or copy this link in your browser:</p>
              <p><small>${resetLink}</small></p>
              <p class="warning">This link will expire in 1 hour.</p>
              <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Kinote. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions: EmailOptions = {
      to: email,
      subject: 'Password Reset Request - Kinote',
      html,
      text: `Click this link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}

/**
 * Send welcome email after successful registration
 */
export async function sendWelcomeEmail(email: string, userName?: string): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 5px; }
            .content { padding: 20px; background-color: #f9f9f9; margin: 20px 0; border-radius: 5px; }
            .button { background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .features { list-style: none; padding: 0; }
            .features li { padding: 10px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Kinote! 🎉</h1>
            </div>
            <div class="content">
              <p>Hello ${userName || 'User'},</p>
              <p>Your account has been successfully verified. You can now log in and start using Kinote!</p>
              
              <h3>What you can do with Kinote:</h3>
              <ul class="features">
                <li>✅ Manage your to-do list and tasks</li>
                <li>📅 Plan your activities with calendar</li>
                <li>🔥 Track your daily activity streaks</li>
                <li>🤖 Get AI-powered career path recommendations</li>
                <li>📊 Analyze your productivity and life balance</li>
              </ul>
              
              <a href="${process.env.FRONTEND_URL}/login" class="button">Go to Dashboard</a>
              <p>If you have any questions, feel free to contact our support team.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Kinote. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions: EmailOptions = {
      to: email,
      subject: 'Welcome to Kinote - Get Started Today!',
      html,
      text: 'Welcome to Kinote! You can now log in and start using our app.',
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

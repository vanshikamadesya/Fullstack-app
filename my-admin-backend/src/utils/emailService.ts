import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  export const sendRegistrationEmail = async (email: string, name: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to our platform!",
        html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for registering on our platform.</p>
        <p>We're excited to have you with us.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Registration email send error:", error);
        return false;
    }
};

export const sendResetPasswordEmail = async (validateEmail: string, resetToken: string) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: validateEmail,
      subject: "Password Reset Request",
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>${resetToken}</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Email send error:", error);
      return false;
    }
  };

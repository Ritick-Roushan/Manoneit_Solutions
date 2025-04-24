import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text }) => {
  try {
    // Check if environment variables are set correctly
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Missing required environment variables.');
    }

    // Create a transporter for sending emails using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,  // your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD,  // your Gmail app password
      },
    });

    // Set up the email options
    const mailOptions = {
      from: `"Support" <${process.env.GMAIL_USER}>`,  // Sender info (use GMAIL_USER for sender)
      to,  // Recipient email
      subject,  // Email subject
      text,  // Email body (text)
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log(`Email sent to ${to} successfully!`);

  } catch (error) {
    // Log any error during the email sending process
    console.error('Error sending email:', error.message);
    throw new Error('Failed to send email.');
  }
};

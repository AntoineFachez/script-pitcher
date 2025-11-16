// file path: ~/DEVFOLD/SCRIPT-PITCHER/FUNCTIONS/SERVICES/EMAILSERVICE.JS

const nodemailer = require("nodemailer");
const { logger } = require("firebase-functions/v2");

// --- 1. CONFIGURE TRANSPORTER WITH OAUTH2 ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

/**
 * Sends a project invitation email using Nodemailer.
 * The email is physically sent from process.env.MAIL_USER, but uses
 * the inviter's name/email in the display name and Reply-To header.
 * * @param {string} toEmail - The recipient's email address.
 * @param {string} projectName - The name of the project.
 * @param {string} role - The assigned role.
 * @param {string} inviterName - The name of the person who invited the user.
 * @param {string} inviterEmail - 🚨 NEW: The email of the person who invited the user.
 */
exports.sendInviteEmail = async (
  toEmail,
  projectName,
  role,
  inviterName,
  inviterEmail
) => {
  // 🚨 CHANGE HERE: Construct the 'from' field to use the inviter's name
  // but keep the authenticated email address as the sender address.
  const fromDisplay = `"${inviterName} (${projectName} Team Lead)" <${process.env.MAIL_USER}>`;

  const mailOptions = {
    from: fromDisplay,
    to: toEmail,
    // 🚨 NEW: Set Reply-To so responses go back to the inviter
    replyTo: inviterEmail,
    subject: `You've been invited to ${projectName} on Script Pitcher!`,
    html: `
        <p>Hello,</p>
        <p>${inviterName} has invited you to join the project <strong>${projectName}</strong> 
           as a <strong>${role}</strong>.</p>
        <p>
          To accept your role, please log in with the email address: 
          <strong>${toEmail}</strong>. If you do not have an account, please sign up.
        </p>
        <p>Invitation URL: <a href="YOUR_INVITE_ACCEPTANCE_URL">Click here to start.</a></p>
        <p>The system will automatically process your role when you sign up/log in.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Invitation email sent successfully to ${toEmail}.`);
  } catch (error) {
    logger.error(`Failed to send invitation email to ${toEmail}:`, error);
    throw new Error(`Email failed: ${error.message}`);
  }
};

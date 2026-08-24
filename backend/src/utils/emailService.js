const nodemailer = require('nodemailer');

// Initialize Transporter based on Environment Variables or Fallback Logger
const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Graceful fallback logger transporter for dev/demo mode
  return nodemailer.createTransport({
    jsonTransport: true
  });
};

const transporter = createTransporter();

/**
 * Send Email Notification to Candidate
 * @param {Object} params
 * @param {string} params.toEmail - Candidate email address
 * @param {string} [params.candidateName] - Candidate full name
 * @param {string} params.title - Notification title
 * @param {string} params.message - Notification message body
 * @param {string} [params.stage] - Stage info if available
 * @param {string} [params.link] - Action link if available
 */
const sendNotificationEmail = async ({ toEmail, candidateName = 'Candidate', title, message, stage, link }) => {
  if (!toEmail || !toEmail.includes('@')) {
    console.warn(`[EmailService] Invalid recipient email provided: "${toEmail}". Skipping email send.`);
    return { success: false, reason: 'Invalid email' };
  }

  const fromAddress = process.env.SMTP_FROM || '"MindMatrix Careers" <no-reply@mindmatrix.com>';
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const actionLink = link || `${clientUrl}/candidate-portal`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f6f9; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#333333;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f6f9; padding:20px 0;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e1e8ed;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 24px 30px; text-align: left;">
                  <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:700; letter-spacing:0.5px;">MindMatrix</h1>
                  <p style="color:#e0e7ff; margin:4px 0 0 0; font-size:13px; font-weight:400;">Job Application & Candidate Portal</p>
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 30px;">
                  <p style="font-size:15px; margin:0 0 16px 0; color:#4b5563;">Dear <strong>${candidateName}</strong>,</p>
                  
                  <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 16px 20px; border-radius: 6px; margin-bottom: 24px;">
                    <h2 style="margin:0 0 8px 0; color:#1e293b; font-size:17px;">${title}</h2>
                    <p style="margin:0; color:#475569; font-size:14px; line-height:1.6;">${message}</p>
                  </div>

                  ${stage ? `
                  <div style="margin-bottom: 24px; padding: 12px 16px; background-color: #eef2ff; border-radius: 6px; display: inline-block;">
                    <span style="color: #4338ca; font-weight: 600; font-size: 13px;">Current Stage: </span>
                    <span style="color: #3730a3; font-weight: 700; font-size: 14px;">${stage}</span>
                  </div>
                  ` : ''}

                  <p style="font-size:14px; color:#6b7280; line-height:1.5; margin:0 0 24px 0;">
                    You can view full details, updates, and track your application status anytime on your candidate dashboard.
                  </p>

                  <!-- Action Button -->
                  <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="border-radius: 8px; background-color: #4f46e5;">
                        <a href="${actionLink}" target="_blank" style="font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; display: inline-block; background-color: #4f46e5;">
                          View Application Status →
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 20px 30px; border-top: 1px solid #f1f5f9; text-align: center;">
                  <p style="margin:0; font-size:12px; color:#9ca3af; line-height:1.5;">
                    This is an automated notification from MindMatrix Recruitment Portal.<br>
                    Please do not reply directly to this email.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: `[MindMatrix] ${title}`,
      text: `${title}\n\n${message}\n\nView details: ${actionLink}`,
      html: htmlContent
    });

    console.log(`[EmailService] Email notification successfully dispatched to ${toEmail}. Message ID/Info:`, info.messageId || info);
    return { success: true, info };
  } catch (error) {
    console.error(`[EmailService] Error sending email to ${toEmail}:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendNotificationEmail
};

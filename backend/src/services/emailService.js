// Email-Ready Architecture
const sendEmail = async ({ to, subject, templateName, data }) => {
  console.log(`[Email Service] Mock Send to: ${to} | Subject: ${subject} | Template: ${templateName}`);
  return { success: true, messageId: `msg_${Date.now()}` };
};

module.exports = { sendEmail };

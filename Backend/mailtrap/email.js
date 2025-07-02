const { VERIFICATION_EMAIL_TEMPLATE } = require("./emailTemplate");

const { mailtrapclient, sender } = require("./mailtrap.config");

const sendVerificationEmail = async (email, verficationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapclient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verficationToken
      ),
      category: "Email Verification",
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending verification`, error);

    throw new Error(`Error sending verification email : ${error}`);
  }
};

module.exports = {
  sendVerificationEmail,
};

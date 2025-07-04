const { VERIFICATION_EMAIL_TEMPLATE ,PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE } = require("./emailTemplate");

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


const sendWelcomeEmail = async(email , name)=>
{

 const recipient = [{ email }];

  try {
    const response = await mailtrapclient.send({
      from: sender,
      to: recipient,
      template_uuid:"98d526c9-02b0-4174-918c-bffd7031d38d",
      template_variables: {
      "name": name
    }
      
    });

    console.log("  welcome Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending welcome mail`, error);

    throw new Error(`Error sending Welcome email : ${error}`);
  }



};

const sendPasswordResetEmail = async(email ,resetURL)=>
{

const recipient = [{ email }];

  try {
    const response = await mailtrapclient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
        "{resetURL}",
        resetURL
      ),
      category: "Password Reset",
    });

    console.log(" Reset Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending Reset Email`, error);

    throw new Error(`Error sending Reset email : ${error}`);
  }

}


const sendResetSuccessEmail = async(email)=>{

     const recipient = [{ email }];

  try {
    const response = await mailtrapclient.send({
      from: sender,
      to: recipient,
      subject: "Password reset Successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset successful",
    });

    console.log(" Password reset successfully done!", response);
  } catch (error) {
    console.error(`Error sending Reset Email`, error);

    throw new Error(`Error sending Reset email : ${error}`);
  }
}
module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail
};

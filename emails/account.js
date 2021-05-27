const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SG_API_KEY);

const sendConfirmationEmail = ({ email, username, activationToken }) => {

  if (!activationToken) {
    console.error('no activation token found');
    return;
  }

  sgMail.send({
    to: process.env.ACC_EMAIL,
    from: process.env.ACC_EMAIL,
    subject: 'Thanks for joining',
    text: `Thank you for trying out Bytes and Pipes, ${username || email}! Please confirm your email address by using the following link:

    ${process.env.DOMAIN}/confirm/${activationToken}

    Do not hesitate to contact us if you have any questions. Enjoy sharing files in privacy!
    `
  });
};

module.exports = {
  sendConfirmationEmail
};

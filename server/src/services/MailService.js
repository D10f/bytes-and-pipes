import { send } from "@sendgrid/mail";
import config from '../config';

export const sendWelcomeEmail = ({ email, username, activationToken }) => {
  if (!activationToken) {
    console.error("no activation token found");
    return;
  }

  send({
    to: config.ACC_EMAIL,
    from: config.ACC_EMAIL,
    subject: "Thanks for joining",
    text: `Thank you for trying out Bytes and Pipes, ${
      username || email
    }! Please confirm your email address by using the following link:
    
        ${config.DOMAIN}/confirm/${activationToken}
    
        Do not hesitate to contact us if you have any questions. Enjoy sharing files in privacy!
        `,
  });
};
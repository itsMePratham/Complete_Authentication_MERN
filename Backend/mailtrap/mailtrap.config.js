const { MailtrapClient } = require("mailtrap");


const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const TOKEN = process.env.MAIL_TRAP;

const mailtrapclient = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: "hello@demomailtrap.co",
  name: "PrathamDev",
};

const recipients = [
  {
    email: "prathamsahu3226@gmail.com",
  },
];

// // ❌ WRONG: client.send()
// // ✅ RIGHT: mailtrapclient.send()
// mailtrapclient.send({
//   from: sender,
//   to: recipients,
//   subject: "You are awesome!",
//   html: "Congrats for sending test email with Mailtrap!",
//   category: "Integration Test",
// })
// .then(console.log)
// .catch(console.error);

module.exports = {
  sender,
  mailtrapclient,
};

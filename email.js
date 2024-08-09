require('dotenv').config();
const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

const sendEmail = (to, subject, text, html) => {
    const data = {
        from: 'Educativ <info@educativ.com>',
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    mailgun.messages().send(data, (error, body) => {
        if (error) {
            console.error(error);
        } else {
            console.log(body);
        }
    });
};

module.exports = sendEmail;

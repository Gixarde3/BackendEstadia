require('dotenv').config();

const nodemailer = require('nodemailer');

class MailController {

    static async sendMail(to, subject, html, attachments) {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PWD 
            }
        });
        const mail = {
            from: process.env.SMTP_USER,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments
        }
        transporter.sendMail(mail, (err, info) => {
            console.log('message: ', mail)
            if (err) {
                throw new Error(err)
            } else {
                return true
            }
        })
    }
}

module.exports = MailController;
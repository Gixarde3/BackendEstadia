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
            if (err) {
                throw new Error(err)
            } else {
                return true
            }
        })
    }

    static async sendMails(tos, subject, htmls, attachments) {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PWD 
            }
        });
        const fallos = []
        for(const to of tos){
            
            const mail = {
                from: process.env.SMTP_USER,
                to: to,
                subject: subject,
                html: htmls[tos.indexOf(to)],
                attachments: attachments
            }
            await transporter.sendMail(mail, (err, info) => {
                if (err) {
                    fallos.push({to: to, html: htmls[tos.indexOf(to)]})
                } else {
                    const mailFallo = {
                        from: process.env.SMTP_USER,
                        to: fallos[0].to,
                        subject: subject,
                        html: fallos[0].html,
                        attachments: attachments
                    }
                    transporter.sendMail(mailFallo, (err, info) => {
                        if (err) {
                            
                        } else {
                            
                            fallos.shift()
                        }
                    });
                    return true
                }
            })
        }
    }
}

module.exports = MailController;
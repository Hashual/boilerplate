'use strict';

const { Service } = require('@hapipal/schmervice');
const Nodemailer = require('nodemailer');

module.exports = class MailService extends Service {

    createTransporter() {

        return Nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.ethereal.email',
            port: process.env.MAIL_PORT || 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER || '',
                pass: process.env.MAIL_PASSWORD || ''
            }
        });
    }

    async sendWelcomeMail(user) {

        const transporter = this.createTransporter();

        const mailOptions = {
            from: process.env.MAIL_FROM || 'noreply@iut-project.com',
            to: user.mail,
            subject: 'Bienvenue sur notre plateforme !',
            html: `
                <h1>Bienvenue ${user.firstName} ${user.lastName} !</h1>
                <p>Votre compte a été créé avec succès.</p>
                <p>Votre nom d'utilisateur est : <strong>${user.username}</strong></p>
                <p>Merci de nous avoir rejoint !</p>
            `
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            this.server.log(['mail', 'info'], `Mail de bienvenue envoyé à ${user.mail} : ${info.messageId}`);
            return info;
        }
        catch (err) {
            this.server.log(['mail', 'error'], `Erreur lors de l'envoi du mail à ${user.mail} : ${err.message}`);
            throw err;
        }
    }
};

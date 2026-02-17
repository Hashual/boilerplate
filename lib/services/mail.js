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

    async sendNewFilmMail(user, film) {

        const transporter = this.createTransporter();

        const mailOptions = {
            from: process.env.MAIL_FROM || 'noreply@iut-project.com',
            to: user.mail,
            subject: `Nouveau film ajouté : ${film.title}`,
            html: `
                <h1>Un nouveau film a été ajouté !</h1>
                <p>Bonjour ${user.firstName} ${user.lastName},</p>
                <p>Le film <strong>${film.title}</strong> réalisé par <strong>${film.director}</strong> vient d'être ajouté à notre catalogue.</p>
                <p><strong>Description :</strong> ${film.description}</p>
                <p><strong>Date de sortie :</strong> ${new Date(film.releaseDate).toLocaleDateString('fr-FR')}</p>
                <p>N'hésitez pas à l'ajouter à vos favoris !</p>
            `
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            this.server.log(['mail', 'info'], `Mail nouveau film envoyé à ${user.mail} : ${info.messageId}`);
            return info;
        }
        catch (err) {
            this.server.log(['mail', 'error'], `Erreur lors de l'envoi du mail à ${user.mail} : ${err.message}`);
            throw err;
        }
    }

    async sendFilmUpdatedMail(user, film) {

        const transporter = this.createTransporter();

        const mailOptions = {
            from: process.env.MAIL_FROM || 'noreply@iut-project.com',
            to: user.mail,
            subject: `Un de vos films favoris a été modifié : ${film.title}`,
            html: `
                <h1>Un film de vos favoris a été modifié !</h1>
                <p>Bonjour ${user.firstName} ${user.lastName},</p>
                <p>Le film <strong>${film.title}</strong> que vous avez dans vos favoris a été mis à jour.</p>
                <p><strong>Réalisateur :</strong> ${film.director}</p>
                <p><strong>Description :</strong> ${film.description}</p>
                <p><strong>Date de sortie :</strong> ${new Date(film.releaseDate).toLocaleDateString('fr-FR')}</p>
            `
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            this.server.log(['mail', 'info'], `Mail film modifié envoyé à ${user.mail} : ${info.messageId}`);
            return info;
        }
        catch (err) {
            this.server.log(['mail', 'error'], `Erreur lors de l'envoi du mail à ${user.mail} : ${err.message}`);
            throw err;
        }
    }

    async sendCsvExportMail(toMail, userName, csvContent) {

        const transporter = this.createTransporter();

        const mailOptions = {
            from: process.env.MAIL_FROM || 'noreply@iut-project.com',
            to: toMail,
            subject: 'Export CSV des films',
            html: `
                <h1>Export CSV des films</h1>
                <p>Bonjour ${userName},</p>
                <p>Veuillez trouver en pièce jointe l'export CSV de l'ensemble des films.</p>
                <p>Cordialement,</p>
                <p>FF - FilmFlix</p>
            `,
            attachments: [
                {
                    filename: 'films-export.csv',
                    content: csvContent,
                    contentType: 'text/csv'
                }
            ]
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            this.server.log(['mail', 'info'], `Mail export CSV envoyé à ${toMail} : ${info.messageId}`);
            return info;
        }
        catch (err) {
            this.server.log(['mail', 'error'], `Erreur lors de l'envoi du mail export CSV à ${toMail} : ${err.message}`);
            throw err;
        }
    }
};

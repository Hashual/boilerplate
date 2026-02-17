'use strict';

const { Service } = require('@hapipal/schmervice');
const Amqplib = require('amqplib');

module.exports = class BrokerService extends Service {

    async initialize() {

        const url = process.env.AMQP_URL || 'amqp://localhost';

        try {
            this.connection = await Amqplib.connect(url);
            this.channel = await this.connection.createChannel();
            this.server.log(['broker', 'info'], `Connecté au message broker : ${url}`);

            await this.channel.assertQueue('csv-export', { durable: true });

            this.consumeCsvExport();
        }
        catch (err) {
            this.server.log(['broker', 'error'], `Erreur de connexion au message broker : ${err.message}`);
        }
    }

    async publish(queue, message) {

        if (!this.channel) {
            throw new Error('Le channel du message broker n\'est pas initialisé');
        }

        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
        this.server.log(['broker', 'info'], `Message publié dans la queue "${queue}"`);
    }

    consumeCsvExport() {

        this.channel.consume('csv-export', async (msg) => {

            if (!msg) {
                return;
            }

            try {
                const { userMail, userName } = JSON.parse(msg.content.toString());
                this.server.log(['broker', 'info'], `Traitement de l'export CSV pour ${userMail}`);

                const { filmService } = this.server.services();
                const { mailService } = this.server.services();

                const csvContent = await filmService.generateCsv();

                await mailService.sendCsvExportMail(userMail, userName, csvContent);

                this.channel.ack(msg);
                this.server.log(['broker', 'info'], `Export CSV envoyé à ${userMail}`);
            }
            catch (err) {
                this.server.log(['broker', 'error'], `Erreur lors du traitement de l'export CSV : ${err.message}`);
                this.channel.nack(msg, false, false);
            }
        });

        this.server.log(['broker', 'info'], 'Consumer csv-export démarré');
    }

    async teardown() {

        try {
            if (this.channel) {
                await this.channel.close();
            }

            if (this.connection) {
                await this.connection.close();
            }

            this.server.log(['broker', 'info'], 'Connexion au message broker fermée');
        }
        catch (err) {
            this.server.log(['broker', 'error'], `Erreur lors de la fermeture du broker : ${err.message}`);
        }
    }
};

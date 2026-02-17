'use strict';

module.exports = {
    method: 'post',
    path: '/films/csv-export',
    options: {
        tags: ['api'],
        auth: { scope: ['admin'] }
    },
    handler: async (request, h) => {

        const { filmService } = request.services();

        const credentials = request.auth.credentials;
        const user = {
            mail: credentials.email,
            firstName: credentials.firstName,
            lastName: credentials.lastName
        };

        await filmService.requestCsvExport(user);

        return h.response({ message: 'L\'export CSV a été demandé. Vous recevrez le fichier par mail.' }).code(200);
    }
};

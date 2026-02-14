'use strict';

module.exports = {
    method: 'get',
    path: '/films',
    options: {
        auth: false,
        tags: ['api']
    },
    handler: async (request, h) => {

        const { filmService } = request.services();

        return await filmService.list();
    }
};

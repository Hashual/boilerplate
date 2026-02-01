'use strict';

module.exports = {
    method: 'get',
    path: '/users',
    options: {
        tags: ['api']
    },
    handler: async (request, h) => {

        const { usersService } = request.services();

        return await usersService.create();
    }
};
'use strict';


module.exports = {
    method: 'get',
    path: '/users',
    options: {
        auth: { scope: ['admin','user'] },
        tags: ['api']
    },
    handler: async (request, h) => {

        const { usersService } = request.services();

        return await usersService.create();
    }
};
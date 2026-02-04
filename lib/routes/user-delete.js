'use strict';

const Joi = require('joi');

module.exports = {
    method: 'DELETE',
    path: '/user/{id}',
    options: {
        description: 'Delete an existing user',
        notes: 'Deletes a user based on the provided ID',
        tags: ['api'],
        auth: { scope: ['admin'] },
        validate: {
            params: Joi.object({
                id: Joi.number().integer().required().description('ID of the user to delete')
            })
        }
    },
    handler: async (request, h) => {

        const { userService } = request.services();
        const { id } = request.params;

        await userService.delete(id);
        return h.response().code(204);
    }
};

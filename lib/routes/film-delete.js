'use strict';

const Joi = require('joi');

module.exports = {
    method: 'DELETE',
    path: '/film/{id}',
    options: {
        description: 'Delete an existing film',
        notes: 'Deletes a film based on the provided ID',
        tags: ['api'],
        auth: { scope: ['admin'] },
        validate: {
            params: Joi.object({
                id: Joi.number().integer().required().description('ID of the film to delete')
            })
        }
    },
    handler: async (request, h) => {

        const { filmService } = request.services();
        const { id } = request.params;

        await filmService.delete(id);
        return h.response().code(204);
    }
};

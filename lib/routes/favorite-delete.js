'use strict';

const Joi = require('joi');

module.exports = {
    method: 'DELETE',
    path: '/film/{id}/favorites',
    options: {
        description: 'Remove a film from favorites',
        notes: 'Removes a film from the authenticated user favorites list',
        tags: ['api'],
        auth: { scope: ['user', 'admin'] },
        validate: {
            params: Joi.object({
                id: Joi.number().integer().required().description('ID of the film to remove from favorites')
            })
        }
    },
    handler: async (request, h) => {

        const { filmService } = request.services();
        const userId = request.auth.credentials.id;
        const { id } = request.params;

        await filmService.removeFavorite(userId, id);
        return h.response().code(204);
    }
};

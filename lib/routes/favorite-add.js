'use strict';

const Joi = require('joi');

module.exports = {
    method: 'post',
    path: '/film/{id}/favorites',
    options: {
        description: 'Add a film to favorites',
        notes: 'Adds a film to the authenticated user favorites list',
        tags: ['api'],
        auth: { scope: ['user', 'admin'] },
        validate: {
            params: Joi.object({
                id: Joi.number().integer().required().description('ID of the film to add to favorites')
            })
        }
    },
    handler: async (request, h) => {

        const { filmService } = request.services();
        const userId = request.auth.credentials.id;
        const { id } = request.params;

        const favorite = await filmService.addFavorite(userId, id);
        return h.response(favorite).code(201);
    }
};

'use strict';

const Joi = require('joi');

module.exports = {
    method: 'PATCH',
    path: '/film/{id}',
    options: {
        description: 'Update an existing film',
        notes: 'Updates film information based on the provided ID and payload',
        tags: ['api'],
        auth: { scope: ['admin'] },
        validate: {
            params: Joi.object({
                id: Joi.number().integer().required().description('ID of the film to update')
            }),
            payload: Joi.object({
                title: Joi.string().min(1).example('Inception').description('Title of the film'),
                description: Joi.string().min(1).example('A mind-bending thriller').description('Description of the film'),
                releaseDate: Joi.date().example('2010-07-16').description('Release date of the film'),
                director: Joi.string().min(1).example('Christopher Nolan').description('Director of the film')
            })
        }
    },
    handler: async (request, h) => {

        const { filmService } = request.services();
        const { id } = request.params;
        const filmData = request.payload;

        const updatedFilm = await filmService.update(id, filmData);
        return h.response(updatedFilm).code(200);
    }
};

'use strict';

const Joi = require('joi');

module.exports = {
    method: 'post',
    path: '/film',
    options: {
        tags: ['api'],
        auth: { scope: ['admin'] },
        validate: {
            payload: Joi.object({
                title: Joi.string().required().min(1).example('Inception').description('Title of the film'),
                description: Joi.string().required().min(1).example('A mind-bending thriller').description('Description of the film'),
                releaseDate: Joi.date().required().example('2010-07-16').description('Release date of the film'),
                director: Joi.string().required().min(1).example('Christopher Nolan').description('Director of the film')
            })
        }
    },
    handler: async (request, h) => {

        const { filmService } = request.services();

        return await filmService.create(request.payload);
    }
};

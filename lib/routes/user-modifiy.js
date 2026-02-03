'use strict';

const Joi = require('joi');

module.exports = {
    method: 'patch',
    path: '/user/{id}',
    options: {
        description: 'Update an existing user',
        notes: 'Updates user information based on the provided ID and payload',
        tags: ['api', 'user'],
        validate: {
            params: Joi.object({
                id: Joi.number().integer().required().description('ID of the user to update')
            }),
            payload: Joi.object({
                firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
                lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
                username: Joi.string().min(3).example('john_doe').description('Username of the user'),
                password: Joi.string().min(8).example('P@ssw0rd!').description('Password of the user'),
                mail: Joi.string().email().example('john.doe@example.com').description('Email of the user')
            })
        }
    },
    handler: async (request, h) => {

        const { userService } = request.services();
        const { id } = request.params;
        const userData = request.payload;

        const updatedUser = await userService.update(id, userData);
        return h.response(updatedUser).code(200);
    }
};

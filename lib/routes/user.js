'use strict';

const Joi = require('joi');

module.exports = {
    method: 'post',
    path: '/user',
    options: {
        tags: ['api'],
        auth: false,
        validate: {
            payload: Joi.object({
                firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                username: Joi.string().required().min(3).example('john_doe').description('Username of the user'),
                password: Joi.string().required().min(8).example('P@ssw0rd!').description('Password of the user'),
                mail: Joi.string().required().email().example('john.doe@example.com').description('Email of the user'),
                role: Joi.string().valid('user', 'admin').default('user').description('Role of the user')
            })
        }
    },
    handler: async (request, h) => {

        const { userService } = request.services();

        return await userService.create(request.payload);
    }
};


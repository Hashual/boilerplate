'use strict';

const Joi = require('joi');

module.exports = {
    method: 'post',
    path: '/user/login',
    options: {
        tags: ['api'],
        validate: {
            payload: Joi.object({
                username: Joi.string().required().example('john.doe@example.com').description('Mail of the user'),
                password: Joi.string().required().min(8).example('P@ssw0rd!').description('Password of the user')

            })
        }
    },
    handler: async (request, h) => {

        const { userService } = request.services();
        const { username, password } = request.payload;

        const loggedUser = await userService.login(username, password);
        return h.response(loggedUser).code(200);
    }
};

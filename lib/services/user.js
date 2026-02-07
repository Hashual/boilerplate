'use strict';

const { Service } = require('@hapipal/schmervice');
const Jwt = require('@hapi/jwt');
const Encrypt = require('@hashual/iut-encrypt');


module.exports = class UserService extends Service {

    async create(user) {

        const { User } = this.server.models();
        const { mailService } = this.server.services();

        user.password = Encrypt.sha1(user.password);
        const createdUser = await User.query().insertAndFetch(user);

        try {
            await mailService.sendWelcomeMail(createdUser);
        }
        catch (err) {
            this.server.log(['user', 'error'], `Impossible d'envoyer le mail de bienvenue : ${err.message}`);
        }

        return createdUser;
    }

    update(userId, userData) {

        const { User } = this.server.models();
        if (userData.password) {
            userData.password = Encrypt.sha1(userData.password);
        }

        return User.query().patchAndFetchById(userId, userData);
    }

    delete(userId) {

        const { User } = this.server.models();

        return User.query().deleteById(userId);
    }

    async login(mail, password) {

        const { User } = this.server.models();
        const user = await User.query().where('mail', mail).first();


        if (!user) {
            throw new Error('User not found');
        }


        const isPasswordValid = Encrypt.compareSha1(password, user.password);

        if (!isPasswordValid) {
            throw new Error('401 Unauthorized');
        }

        const token = Jwt.token.generate(
            {
                aud: 'urn:audience:iut',
                iss: 'urn:issuer:iut',
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.mail,
                scope: user.scopes
            },
            {
                key: 'random_string',
                algorithm: 'HS512'
            },
            {
                ttlSec: 14400 // 4 hours
            }

        );

        return token;
    }
};

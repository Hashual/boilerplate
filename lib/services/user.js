'use strict';

const { Service } = require('@hapipal/schmervice');
const Encrypt = require('@hashual/iut-encrypt');


module.exports = class UserService extends Service {

    create(user) {

        const { User } = this.server.models();
        user.password = Encrypt.sha1(user.password);
        return User.query().insertAndFetch(user);
    }

    update(userId, userData) {

        const { User } = this.server.models();
        if (userData.password) {
            userData.password = Encrypt.sha1(userData.password);
        }

        return User.query().patchAndFetchById(userId, userData);
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

        return '{ login successful }';
    }
};

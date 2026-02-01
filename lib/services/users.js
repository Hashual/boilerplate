'use strict';

const { Service } = require('@hapipal/schmervice');

module.exports = class UsersService extends Service {

    create() {

        const { User } = this.server.models();

        return User.query().select('*');
    }
};
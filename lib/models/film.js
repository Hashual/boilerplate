'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Film extends Model {

    static get tableName() {

        return 'film';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(1).example('Inception').description('Title of the film'),
            description: Joi.string().min(1).example('A mind-bending thriller').description('Description of the film'),
            releaseDate: Joi.date().example('2010-07-16').description('Release date of the film'),
            director: Joi.string().min(1).example('Christopher Nolan').description('Director of the film'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {

        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }
};

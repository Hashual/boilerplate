'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.alterTable('user', (table) => {

            table.string('scopes').notNull().defaultTo('user');
        });
    },

    async down(knex) {

        await knex.schema.alterTable('user', (table) => {


            table.dropColumn('scopes');

        });
    }
};

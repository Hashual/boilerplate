'use strict';

module.exports = {

    async up(knex) {

        await knex.schema.alterTable('user', (table) => {

            table.string('username').notNull();
            table.string('password').notNull();
            table.string('mail').notNull().unique();
        });
    },

    async down(knex) {

        await knex.schema.alterTable('user', (table) => {


            table.dropColumn('password');
            table.dropColumn('username');
            table.dropColumn('mail');

        });
    }
};

exports.up = function (knex) {
    return knex.schema.createTable('USERS', (table) => {
        table.string('id',36).primary();
        table.string('username', 255).unique().notNullable();
        table.string('fullname', 255).notNullable();
        table.string('password', 255).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('USERS');
};

const TABLE_NAME = 'AUTHENTICATIONS';

exports.up = function (knex) {
    return knex.schema.createTable(TABLE_NAME, (table) => {
        table.string('token');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable(TABLE_NAME);
};

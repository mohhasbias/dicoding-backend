const TABLE_NAME = 'COMMENTS';

exports.up = function (knex) {
    return knex.schema.createTable(TABLE_NAME, (table) => {
        table.string('id', 36).primary();
        table.string('owner', 36);
        table.string('content');
        table.string('thread', 36);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.foreign('owner').references('id').inTable('USERS').onDelete('CASCADE');
        table.foreign('thread').references('id').inTable('THREADS').onDelete('CASCADE');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable(TABLE_NAME);
};

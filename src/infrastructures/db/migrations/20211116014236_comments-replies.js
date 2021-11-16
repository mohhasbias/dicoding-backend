const TABLE_NAME = 'COMMENTS';

exports.up = function (knex) {
    return knex.schema.table(TABLE_NAME, (table) => {
        table.string('reply_to', 36).defaultTo(null);

        table
            .foreign('reply_to')
            .references('id')
            .inTable('COMMENTS')
            .onDelete('CASCADE');
    });
};

exports.down = function (knex) {
    return knex.schema.table(TABLE_NAME, (table) => {
        table.dropColumn('reply_to');
    });
};

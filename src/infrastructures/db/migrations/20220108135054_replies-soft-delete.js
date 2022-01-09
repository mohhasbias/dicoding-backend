const TABLE_NAME = 'REPLIES'

exports.up = function(knex) {
    return knex.schema.table(TABLE_NAME, (table) => {
        table.boolean('is_delete').defaultTo(false);
    });
};

exports.down = function(knex) {
    return knex.schema.table(TABLE_NAME, (table) => {
        table.dropColumn('is_delete');
    })
};
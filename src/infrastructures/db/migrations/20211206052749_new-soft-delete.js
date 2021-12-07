const TABLE_NAME = 'COMMENTS';

exports.up = function (knex) {
    return knex.schema.table(TABLE_NAME, (table) => {
        table.string('delete_content');
    });
};

exports.down = function (knex) {
    return knex.schema.table(TABLE_NAME, (table) => {
        table.dropColumn('delete_content');
    });
};

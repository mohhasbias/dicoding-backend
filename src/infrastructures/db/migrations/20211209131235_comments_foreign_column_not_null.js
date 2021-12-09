const TABLE_NAME = 'COMMENTS';

exports.up = function (knex) {
    return knex.schema.alterTable(TABLE_NAME, (table) => {
        table.string('owner', 36).notNullable().alter();
        table.string('thread', 36).notNullable().alter();
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable(TABLE_NAME, (table) => {
        table.string('owner', 36).alter();
        table.string('thread', 36).alter();
    });
};

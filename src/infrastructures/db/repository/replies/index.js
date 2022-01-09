const insertReply = require('./insert-reply');
const selectReplies = require('./select-replies');
const softDeleteReply = require('./soft-delete-reply');
const isReplyExist = require('./is-reply-exist');
const isReplyOwner = require('./is-reply-owner');

module.exports = {
    insertReply,
    selectReplies,
    softDeleteReply,
    isReplyExist,
    isReplyOwner,
};

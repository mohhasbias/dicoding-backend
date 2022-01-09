const insertComment = require('./insert-comment');
const isCommentExist = require('./is-comment-exist');
const isCommentOwner = require('./is-comment-owner');
const selectComments = require('./select-comments');
const softDeleteComment = require('./soft-delete-comment');

module.exports = {
    insertComment,
    isCommentExist,
    isCommentOwner,
    selectComments,
    softDeleteComment,
};

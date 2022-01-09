const deletedComment = '**komentar telah dihapus**';

const extractComment = ({ id, username, date, content, isDelete }) => ({
    id,
    username,
    date,
    content: isDelete ? deletedComment : content,
});

module.exports = {
    extractComment,
};

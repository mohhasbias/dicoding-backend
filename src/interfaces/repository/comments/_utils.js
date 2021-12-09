const extractComment = ({
    id,
    username,
    date,
    content,
    isDelete,
    deleteContent,
}) => ({
    id,
    username,
    date,
    content: isDelete ? deleteContent : content,
});

module.exports = {
    extractComment,
};

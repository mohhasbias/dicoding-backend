const deletedReply = '**balasan telah dihapus**';

const extractReply = ({ content, isDelete, ...rest}) => ({
    ...rest,
    content: isDelete ? deletedReply : content,
});

module.exports = {
    extractReply,
};

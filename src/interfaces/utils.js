const sha256 = require('crypto-js/sha256');
const { nanoid } = require('nanoid');

const hash = (msg) => sha256(msg).toString();

const generateID = async (len) => nanoid(len);

module.exports = {
    hash,
    generateID,
};

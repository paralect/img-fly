const config = require('config');

const getFileUrl = (fileId, fileName) => `${config.apiUrl}/${fileId}/${fileName}`;

module.exports.getFileUrl = getFileUrl;

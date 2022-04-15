const expressLoader = require('./express');
const sqlserverLoader = require('./sqlserver');

module.exports = async expressApp => {
    expressLoader(expressApp);
    await sqlserverLoader();
};
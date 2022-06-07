const escape = require('../utils/escaper');
const statusCodeMapper = require('../utils/statusCodeMap');
const hideSecrets = require('../utils/hideSecrets');

module.exports = (err, req, res, options) => {
    err.statusCode = err.statusCode || 500;
    console.log(err)
    const notificationTitle = err.statusCode < 500 ? '⚠️ SERVER WARNING 📡' : '⛔️ SERVER ERROR 📡';
    const endpoint = `\`${req.method}\` ${`${req.protocol}://${req.get('host')}${req.originalUrl}`}`;

    let requestBody = req.body && Object.assign({}, req.body);
    requestBody = options.hideSecrets && requestBody ? hideSecrets(requestBody, {
        secretWords: options.secretWords,
        mask: options.mask,
    }) : requestBody;

    const responseBody = {
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    };

    return `
  *${notificationTitle}*
    
*🔧 ENDPOINT:* ${endpoint}

*🔧 STATUS_CODE:* ${statusCodeMapper(err.statusCode)}
    
*🔧 IP_ADDRESS:* ${escape(req.ip)}

*🔧 HEADER:* 
\`\`\`
${JSON.stringify(req.headers || {}, null, 2)}
\`\`\`
    
*🔧 REQUEST_BODY:* 
\`\`\`
${JSON.stringify(requestBody || {}, null, 2)}
\`\`\`

*🔧 RESPONSE_BODY:* 
\`\`\`
${JSON.stringify(responseBody || {}, null, 2)}
\`\`\`

  `;
};

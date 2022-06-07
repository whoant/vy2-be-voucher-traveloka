const querify = require('querystring').stringify;
const template = require('./src/templates/default');
const sendMessage = require('./src/sendMessage');
const { printWarning } = require('./src/utils/print');
const validateOptions = require('./src/utils/options');
const { is4xx, is5xx } = require('./src/utils/statusCode');

const telegramNotify = (config, opts) => (err, req, res, next) => {

    if (!config) config = {};
    const { botToken, chatId } = config;

    if (!botToken) printWarning('botToken not provided, errors get ignored');
    if (!chatId) printWarning('chatId not provided, errors get ignored');

    const options = validateOptions(opts);

    if (!botToken || !chatId) return;

    const text = template(err, req, res, Object.assign(config, options));

    let query = {
        text,
        chat_id: chatId,
        parse_mode: 'Markdown',
    };

    // Set sound notification according to the options
    if ((is4xx(res) && !options.sound4xx) || (is5xx(res) && !options.sound5xx)) {
        query.disable_notification = true;
    }

    query = querify(query);

    try {
        sendMessage(botToken, query);
    } catch (e) {
        console.log(e);
    }

    next(err);
};

module.exports = telegramNotify;
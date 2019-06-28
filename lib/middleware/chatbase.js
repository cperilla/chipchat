'use strict';

const chatbase = require('@google/chatbase'); // eslint-disable-line
const uuidv1 = require('uuid/v1');
const uuidv4= require('uuid/v4');

chatbase.setApiKey(process.env.CHATBASE_KEY)
    .setPlatform('chipchat-middleware');

const outgoingId = uuidv4();

module.exports = (logger, sync) => {
    return {
        send: (bot, message, next) => {
            console.log(JSON.stringify(message));
            chatbase.newMessage()
                .setMessage(message.text)
                .setMessageId(uuidv4())
                .setAsTypeAgent()
                .setUserId(outgoingId)
                .send()
                .then((msg) => {
                    logger.info(msg.getCreateResponse());
                    if (sync) {
                        next();
                    }
                })
                .catch(err => logger.error(err));
            if (!sync) next();
        },
        receive: (bot, payload, next) => {
            const { message } = payload.data;
            chatbase.newMessage()
                .setMessage(message.text)
                .setMessageId(message.id)
                .setAsTypeAgent()
                .setUserId(message.user)
                .send()
                .then((msg) => {
                    logger.info(msg.getCreateResponse());
                    if (sync) {
                        next();
                    }
                })
                .catch(err => logger.error(err));
            if (!sync) next();
        }
    };
};

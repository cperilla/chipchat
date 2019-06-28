'use strict';

const logger = {
    warn: console.log,
    error: console.log,
    info: console.log,
    critical: console.log
};

const Bot = require('../lib/chipchat');
const chatbase = require('../lib/middleware/chatbase')(logger);

const bot = new Bot({
    token: process.env.TOKEN,
    middleware: {
        send: [chatbase.send],
        receive: [chatbase.receive]
    }
});

bot.on('message.create.*.chat', (payload, actions) => {
    console.log('on.message', payload.text);
    if (payload.text === 'Ping') {
        actions.say('Pong', (err) => {
            if (err) throw err;
            console.log('Ponged back');
        });
    }
});

bot.onAny((event, msg, ctx) => {
    console.log('any', event, ctx ? ctx.name : 'no context');
});

bot.on('error', (err) => {
    console.log('err', err);
});

bot.start();

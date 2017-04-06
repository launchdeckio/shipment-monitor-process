'use strict';

const _ = require('lodash');

const events = require('./events');
const scoped = require('./Process').scoped;

/**
 * Report all process output within a dedicated SubContext
 * @param {Context} context
 * @param {Process} process
 */
module.exports = (context, process) => scoped(context, process, context => {

    // Listen to both the stdout and the stderr streams
    _.forEach(['stdout', 'stderr'], stream => process[stream]
        .on('data', line => {

            context.emit[stream](line.toString());
        }));

    // Report the completion of the process
    return process.await().then(({code, signal}) => {

        context.emit[events.EXIT]({code, signal});

        if (code !== 0) {
            const error = new Error(`Process '${process.command}' exited with ${code}`);
            error.code  = code;
            throw error;
        }

        if (signal !== null) {
            const error  = new Error(`Process was terminated (${signal})`);
            error.signal = signal;
            throw error;
        }
    });
});

module.exports.events         = events;
module.exports.eventReducers  = require('./eventReducers');
module.exports.eventFactories = require('./eventFactories');

module.exports.Process = require('./Process');
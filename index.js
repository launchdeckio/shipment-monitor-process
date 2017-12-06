'use strict';

const {forEach, isUndefined} = require('lodash');

const events  = require('./events');
const Process = require('./Process');

/**
 * Report all process output within a dedicated SubContext
 * @param {Context} context
 * @param {Process} process
 * @param {Boolean} [throws = true] Throw an error if the process exits with a non-zero exitcode?
 */
module.exports = (context, process, throws = true) => {

    return context.withScope({process: Process.getScope(process)}, async context => {

        // Listen to both the stdout and the stderr streams
        forEach(['stdout', 'stderr'], stream => process[stream]
            .on('data', line => {
                context.emit[stream](line.toString());
            }));

        // Report the completion of the process
        const {code, signal} = await process.await();

        context.emit[events.EXIT]({code, signal});

        if (code !== 0 && throws) {
            const error = new Error(`Process '${process.command}' exited with ${code}`);
            error.code  = code;
            throw error;
        }

        if (!isUndefined(signal) && signal !== null && throws) {
            const error  = new Error(`Process was terminated (${signal})`);
            error.signal = signal;
            throw error;
        }
    })
};

module.exports.events         = events;
module.exports.eventReducers  = require('./eventReducers');
module.exports.eventFactories = require('./eventFactories');

module.exports.Process = require('./Process');
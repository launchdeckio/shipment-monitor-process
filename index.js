'use strict';

const split     = require('split');
const {trimEnd} = require('lodash');

const events       = require('./events');
const Process      = require('./Process');
const cliFormatter = require('./cliFormatter');

/**
 * Report all process output within a dedicated SubContext
 * @param {Context} context
 * @param {Process} process
 * @param {Boolean} [throws = true] Throw an error if the process exits with a non-zero exitcode?
 */
module.exports = (context, process, throws = true) => {

    return context.branch({process: Process.getScope(process)}).scoped(async context => {

        // Listen to both the stdout and the stderr streams
        ['stdout', 'stderr'].forEach(stream => {
            process[stream]
                .pipe(split())
                .on('data', line => {
                    context.emit(events[stream](trimEnd(line.toString(), '\n')));
                });
        });

        // Report the completion of the process
        const {code, signal} = await process.await();

        context.emit(events.exit({code, signal}));

        if (code !== 0 && throws) {
            const error = new Error(`Process '${process.command}' exited with ${code}`);
            error.code  = code;
            throw error;
        }

        if (signal && throws) {
            const error  = new Error(`Process was terminated (${signal})`);
            error.signal = signal;
            throw error;
        }
    });
};

module.exports.events       = events;
module.exports.cliFormatter = cliFormatter;
module.exports.Process      = Process;
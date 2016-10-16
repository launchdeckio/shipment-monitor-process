'use strict';

const _      = require('lodash');
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

            context.emit[stream](line);
        }));

    // Report the completion of the process
    return process.await().then(exitCode => {
        context.emit[events.EXIT](exitCode);
        if (exitCode !== 0) throw new Error(`Process exited with ${exitCode}`);
    });
});

module.exports.events         = events;
module.exports.eventReducers  = require('./eventReducers');
module.exports.eventFactories = require('./eventFactories');

module.exports.Process = require('./Process');
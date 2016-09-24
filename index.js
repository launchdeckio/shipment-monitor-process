'use strict';

const _ = require('lodash');

/**
 * Report all process output within a dedicated SubContext
 * @param {Context} context
 * @param {Process} process
 */
module.exports = (context, process) => context.withScope({
    process: {command: process.command, cwd: process.cwd, host: process.host}
}, context => {

    // Listen to both the stdout and the stderr streams
    _.forEach(['stdout', 'stderr'], stream => process[stream].on('data', line => {

        context.reporter.report({[stream]: line});
    }));

    // Report the completion of the process
    return process.await().then(exitCode => context.reporter.report({exit: exitCode}));
});

module.exports.Process = require('./Process');
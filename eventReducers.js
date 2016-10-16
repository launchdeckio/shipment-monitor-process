'use strict';

const chalk = require('chalk');

const events = require('./events');

module.exports = (parser, options = {}) => {

    if (options.format) {

        parser.on('begin', context => {
            if (context.scope.process) {
                let process    = context.scope.process;
                let hostSuffix = (process.host && process.host != 'localhost') ?
                    ` ${chalk.grey('@')} ${process.host}` : '';
                console.log(`\n${process.cwd}${hostSuffix} ${chalk.grey('$')} ${chalk.bold(process.command)}`);
            }
        });

        let stderrPrefix = options.prepend ? '[stderr] ' : '';
        let stdoutPrefix = options.prepend ? '[stdout] ' : '';

        parser.useCombine({

            [events.STDERR]: stderr => process.stderr.write(stderrPrefix + stderr),
            [events.STDOUT]: stdout => process.stdout.write(stdoutPrefix + stdout),
        });
    }
};
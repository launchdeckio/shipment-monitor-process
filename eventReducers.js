'use strict';

const chalk = require('chalk');

const events = require('./events');

module.exports = (parser, options = {}) => {

    if (options.cli && !options.silent) {

        parser.on('begin', context => {
            if (context.scope.process) {
                let process = context.scope.process;
                console.log(`\n${process.cwd}${chalk.grey('@')}${process.host} ${chalk.grey('$')} ${chalk.bold(process.command)}`);
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
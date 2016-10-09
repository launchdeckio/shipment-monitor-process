'use strict';

const chalk = require('chalk');
const _     = require('lodash');

const events = require('./events');

const log = fn => (data, info) => console.log(fn(data, info));

module.exports = (parser, options = {}) => {

    if (!options.silent) {

        parser.on('begin', context => {
            if (context.scope.process) {
                let process = context.scope.process;
                console.log(`${process.cwd}${chalk.grey('@')}${process.host} ${chalk.grey('$')} ${chalk.bold(process.command)}`);
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
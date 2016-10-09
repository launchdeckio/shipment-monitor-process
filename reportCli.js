'use strict';

const events = require('./events');
const chalk  = require('chalk');

const log = fn => (data, info) => console.log(fn(data, info));

module.exports = (parser, options = {}) => {

    if (!options.silent) {

        parser.on('begin', context => {
            if (context.scope.process) {
                let process = context.scope.process;
                console.log(`${process.cwd}${chalk.grey('@')}${process.host} ${chalk.grey('$')} ${chalk.bold(process.command)}`);
            }
        });

        parser.useCombine({

            [events.STDERR]: log(stderr => `[stderr] ${stderr}`),
            [events.STDOUT]: log(stdout => `[stdout] ${stdout}`)
        });
    }
};
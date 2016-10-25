'use strict';

const chalk = require('chalk');

const events = require('./events');

module.exports = (parser, options = {}) => {

    if (options.format) {

        parser.on('begin', context => {
            if (context.scope.process) {
                let process  = context.scope.process;
                let cwd      = (process.cwd) ? `${chalk.blue(process.cwd)} ` : '';
                let hostName = (process.host ? (process.host.name ? process.host.name : process.host) : null);
                let host     = (hostName && hostName != 'localhost') ? `${chalk.green(hostName)} ` : '';
                console.log(`\n${host}${cwd}${chalk.grey('$')} ${chalk.bold(process.command)}`);
            }
        });

        let stderrPrefix = options.prepend ? '[stderr] ' : '';
        let stdoutPrefix = options.prepend ? '[stdout] ' : '';

        parser.useCombine({

            [events.STDERR]: stderr => process.stderr.write(stderrPrefix + stderr),
            [events.STDOUT]: stdout => process.stdout.write(stdoutPrefix + stdout),
            [events.EXIT]:   (exitCode, info) => {
                let code = exitCode === 0 ? chalk.green(exitCode) : chalk.red(exitCode);
                console.log(`${code} ${chalk.grey(`(${info.context.scope.process.command})`)}`);
            }
        });
    }
};
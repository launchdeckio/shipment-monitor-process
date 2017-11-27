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
                let host     = (hostName && hostName !== 'localhost') ? `${chalk.green(hostName)} ` : '';
                console.log(`\n${host}${cwd}${chalk.grey('$')} ${chalk.bold(process.command)}`);
            }
        });

        let stderrPrefix = options.prepend ? '[stderr] ' : '';
        let stdoutPrefix = options.prepend ? '[stdout] ' : '';

        parser.useCombine({

            [events.STDERR]: stderr => process.stderr.write(stderrPrefix + stderr),
            [events.STDOUT]: stdout => process.stdout.write(stdoutPrefix + stdout),
            [events.EXIT]:   (exit, info) => {

                const code   = exit.get('code');
                const signal = exit.get('signal');

                const notation = code !== null ?
                    (code === 0 ? chalk.green('✓') : chalk.red(code)) :
                    chalk.red(signal);

                console.log(`${notation} ${chalk.grey(`(${info.context.scope.process.command})`)}`);
            }
        });
    }
};
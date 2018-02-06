const chalk = require('chalk');

module.exports = ({verbose, silent}) => {

    const prefixes = {
        stdout: verbose ? '[stdout] ' : '',
        stderr: verbose ? '[stderr] ' : '',
    };

    return (evt, {context}) => {

        if (evt.begin && context.scope.process) {

            let process  = context.scope.process;
            let cwd      = (process.cwd) ? `${chalk.blue(process.cwd)} ` : '';
            let hostName = (process.host ? (process.host.name ? process.host.name : process.host) : null);
            let host     = (hostName && hostName !== 'localhost') ? `${chalk.green(hostName)} ` : '';

            return `\n${host}${cwd}${chalk.grey('$')} ${chalk.bold(process.command)}`;
        }

        if (evt.exit) {

            const code   = evt.exit.code;
            const signal = evt.exit.signal;

            const notation = code !== null ?
                (code === 0 ? chalk.green('✓') : chalk.red(code)) :
                chalk.yellow(signal);

            return `${notation} ${chalk.grey(`(${context.scope.process.command})`)}`;
        }

        if (evt.stdout && !silent) {
            return `${prefixes.stdout}${evt.stdout}`;
        }

        if (evt.stderr && !silent) {
            return `${prefixes.stderr}${evt.stderr}`;
        }
    };
};
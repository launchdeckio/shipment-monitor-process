'use strict';

const defaults     = require('defa');
const ChildProcess = require('child_process').ChildProcess;
const EventEmitter = require('events').EventEmitter;
const Promise      = require('bluebird');

/**
 * Generic structure to describe a process, hold standard output streams and track its completion / exitcode
 */
class Process extends EventEmitter {

    /**
     * @param {String} command
     * @param {Object|ChildProcess} options
     */
    constructor(command, options = {}) {

        super();

        this.command = command;

        if (!(options instanceof ChildProcess)) {
            options   = defaults({}, options, {
                cwd:    null,
                host:   'localhost',
                stdout: null,
                stderr: null
            });
            this.host = options.host;
            this.cwd  = options.cwd;
        }

        this.stdout = options.stdout;
        this.stderr = options.stderr;

        if (options instanceof ChildProcess) {
            this.childProcess = options;
            this.host         = 'localhost';
            this.listen(options);
        }

        this.running = true;

        this.code   = null; // exit code
        this.signal = null; // exit signal
    }

    /**
     * Listen to the "close" event on the given child process.
     * Note this method is automatically invoked if you supply a ChildProcess instance
     * to the constructor as the second parameter.
     * @param childProcess
     */
    listen(childProcess) {
        childProcess.on('exit', (code, signal) => this.done(code, signal));
        return this;
    }

    /**
     * Indicate that the process has exited.
     * @param {int|null} code
     * @param {string|null} signal
     */
    done(code, signal) {
        this.running = false;

        this.code   = code;
        this.signal = signal;

        this.emit('done', {code, signal});
    }

    /**
     * Returns a promise for the completion of the process
     * The promise will be resolved with {code, signal} when the process closes.
     * @returns {Promise}
     */
    await() {
        return new Promise(resolve => this.on('done', resolve));
    }
}

module.exports = Process;

module.exports.scoped = (context, process, fn) => context.withScope({
    process: {command: process.command, cwd: process.cwd, host: process.host}
}, fn);
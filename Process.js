'use strict';

const defaults     = require('defa');
const EventEmitter = require('events').EventEmitter;
const Promise      = require('bluebird');

/**
 * Generic structure to describe a process, hold standard output streams and track its completion / exitcode
 */
class Process extends EventEmitter {

    constructor(command, options = {}) {

        super();

        options = defaults({}, options, {
            cwd:    null,
            host:   'localhost',
            stdout: null,
            stderr: null
        });

        this.command = command;
        this.cwd     = options.cwd;
        this.host    = options.host;
        this.stdout  = options.stdout;
        this.stderr  = options.stderr;

        this.running = true;

        this.code   = null; // exit code
        this.signal = null; // exit signal
    }

    done(code, signal) {
        this.running = false;

        this.code   = code;
        this.signal = signal;

        this.emit('done', {code, signal});
    }

    await() {
        return new Promise(resolve => this.on('done', resolve));
    }
}

module.exports = Process;

module.exports.scoped = (context, process, fn) => context.withScope({
    process: {command: process.command, cwd: process.cwd, host: process.host}
}, fn);
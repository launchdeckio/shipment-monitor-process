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

        this.command  = command;
        this.cwd      = options.cwd;
        this.host     = options.host;
        this.stdout   = options.stdout;
        this.stderr   = options.stderr;
        this.running  = true;
        this.exitCode = null;
    }

    done(exitCode) {
        this.running  = false;
        this.exitCode = exitCode;
        this.emit('done', exitCode);
    }

    await() {
        return new Promise(resolve => this.on('done', exitCode => resolve(exitCode)));
    }
}

module.exports = Process;
import test from 'ava';
import exec from 'execa';
import {some} from 'lodash';

import {Context} from 'shipment';

import monitor, {Process} from './';

import {stdout} from 'test-console';

let context;

test.beforeEach(t => {
    context = new Context();
});

test(async t => {

    // Hijack stdout
    let inspect = stdout.inspect();

    // Spawn child process (shell)
    let childProcess = exec.shell('echo "hoi"');

    // Instantiate Process handle
    let p = new Process('pwd', {
        cwd:    process.cwd(),
        stdout: childProcess.stdout,
        stderr: childProcess.stderr
    });

    // Listen to child process completion
    childProcess.then(() => p.done(0), err => p.done(err.code));

    // Await process completion
    await(monitor(context, p));

    // Restore stdout
    inspect.restore();

    // Log output for debugging
    console.log(inspect.output.join(''));

    // Assert that the output contains a formatted object with stdout: hoi
    t.true(some(inspect.output, line => {
        let obj = JSON.parse(line);
        return obj.stdout && obj.stdout.match(/hoi/);
    }));
});
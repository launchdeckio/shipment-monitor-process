import test from 'ava';
import exec from 'execa';
import {some} from 'lodash';

import {Context} from 'shipment';
import monitor, {Process, reportCli} from './';

import {stdout} from 'test-console';

let context, reporter;

const contains = (stdout, line) => some(stdout, l => l.match(line));

const doEcho = () => {

    // Spawn child process (shell)
    let childProcess = exec.shell('echo "hoi"');

    // Instantiate Process handle
    let p = new Process('echo "hoi"', {
        cwd:    process.cwd(),
        stdout: childProcess.stdout,
        stderr: childProcess.stderr
    });

    // Listen to child process completion
    childProcess.then(() => p.done(0), err => p.done(err.code));

    return p;
};

const capture = async(fn, {silent = false} = {}) => {

    // Hijack stdout
    let inspect = stdout.inspect();

    await fn();

    // Restore stdout
    inspect.restore();

    // Log output for debugging
    if (!silent) console.log(inspect.output.join(''));

    // Return output;
    return inspect.output;
};

test.serial('monitor', async t => {

    context = new Context();

    const output = await capture(async() => {

        await(monitor(context, doEcho()));
    });

    // Assert that the output contains a formatted object with stdout: hoi
    t.true(some(output, line => {
        let obj = JSON.parse(line);
        return obj.stdout && obj.stdout.match(/hoi/);
    }));
});

test.serial('CLI reporter', async t => {

    context = new Context({
        cli: true
    });

    reportCli(context.reporter.parser, {});

    const output = await capture(async() => {

        await(monitor(context, doEcho()));
    });

    t.true(contains(output, /\[stdout] hoi/));

    t.true(contains(output, /echo "hoi"/));
});
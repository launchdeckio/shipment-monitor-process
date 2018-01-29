import test from 'ava';
import {some} from 'lodash';
import {exec} from 'child_process';

import monitor, {Process} from './';

import {Context} from 'shipment';

const contains = (stdout, line) => some(stdout, l => l.match(line));

const spawn = (cmd = 'echo "hoi" "hallo"') => {

    // Spawn child process (shell)
    let childProcess = exec(cmd);

    // Instantiate Process handle
    return new Process(cmd, childProcess);
};

const captureReceiver = () => {
    const output  = [];
    const receive = evt => output.push(evt);
    return {receive, output};
};

test.serial('monitor', async t => {
    const {receive, output} = captureReceiver();
    const context = new Context({receive});
    await monitor(context, spawn());
    t.true(some(output, obj => {
        return obj.stdout && obj.stdout.match(/hoi hallo/);
    }));
});

test.serial('Non-zero exitcode', async t => {
    const process = spawn('exit 1');
    await t.throws(monitor(new Context(), process));
});

test.serial('SIGKILL', async t => {
    const process = spawn('sleep 10');
    const child = process.childProcess;
    setTimeout(() => child.kill(), 100);
    await t.throws(monitor(new Context(), process));
});
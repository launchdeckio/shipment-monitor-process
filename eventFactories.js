'use strict';

const events = require('./events');

module.exports = {

    [events.STDOUT]: (context, stdout) => ({stdout}),
    [events.STDERR]: (context, stderr) => ({stderr}),
    [events.EXIT]:   (context, exit) => ({exit}),
};
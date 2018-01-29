'use strict';

module.exports = {

    stdout(stdout) {
        return {stdout};
    },

    stderr(stderr) {
        return {stderr};
    },

    exit({code, signal}) {
        return {exit: {code, signal}};
    },
};
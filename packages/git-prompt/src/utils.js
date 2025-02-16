"use strict";;
const { exec } = require('child_process');


const execFn = command => new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
        if (error) {
            reject(error);
            return;
        }

        resolve(stdout.trim());
    });
});

module.exports = {
    exec: execFn,
};

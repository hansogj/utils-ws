import { exec } from 'node:child_process';

const execFn = (command: string): Promise<string> =>
    new Promise((resolve, reject) => {
        exec(command, (error, stdout) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        });
    });

export { execFn as exec };

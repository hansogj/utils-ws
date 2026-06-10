#!/usr/bin/env node

import * as fs from 'node:fs';
import { retry } from './git-prompts';
import { exec } from './utils';

(async () => {
    try {
        const msgFile = (await exec('git rev-parse --show-toplevel')) + '/.git/COMMIT_EDITMSG';
        const commitMessage = fs.readFileSync(msgFile, 'utf-8');
        const shouldRetry = await retry(commitMessage);
        if (shouldRetry !== true) {
            console.log('exiting');
            process.exit(1);
        }
    } catch (error) {
        console.log((error as Error).message);
    }
})();

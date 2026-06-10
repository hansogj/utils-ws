#!/usr/bin/env node

import { checkout } from './git-prompts';
import { exec } from './utils';

(async () => {
    try {
        const currentBranch = await exec('git rev-parse --abbrev-ref HEAD');
        const nextBranch = await checkout(currentBranch);
        console.log(`Checking out ${currentBranch.replace(/\n/g, '')} => "${nextBranch}"`);
        exec(`git checkout -b ${nextBranch}`);
    } catch (error) {
        console.log((error as Error).message);
        process.exit(1);
    }
})();

#!/usr/bin/env node

import * as fs from 'node:fs';
import { commit } from './git-prompts';
import { exec } from './utils';

(async () => {
    const msgFileAsOption = process.argv[2];
    try {
        const msgFileDefault = (await exec('git rev-parse --show-toplevel')) + '/.git/COMMIT_EDITMSG';
        const currentBranch = await exec('git rev-parse --abbrev-ref HEAD');
        const commitMessage = await commit(currentBranch);
        console.log(`Committing with message "${commitMessage}"`);
        fs.writeFileSync(msgFileAsOption || msgFileDefault, commitMessage);
    } catch (error) {
        console.log((error as Error).message);
        process.exit(1);
    }
})();

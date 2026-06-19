import prompts from 'prompts';
import { getQuestions } from './conventions';

interface BranchParts {
    type?: string;
    ticker?: string;
    scope: string;
}

const splitBranchName = (currentBranch: string): BranchParts => {
    const splits = currentBranch.trim().split('/');

    let type: string | undefined;
    let ticker: string | undefined;
    let scope = '';

    if (splits.length === 1) [type] = splits;
    else if (splits.length === 2) [type, scope] = splits;
    else {
        [type, ticker] = splits;
        scope = splits.slice(2).join('/');
    }
    return { type, ticker, scope };
};

const trimValues = (obj: Record<string, unknown>): Record<string, unknown> =>
    Object.entries(obj).reduce<Record<string, unknown>>(
        (self, [key, val]) => ({
            ...self,
            [key]: typeof val === 'string' ? val.trim().replace(/\s+/g, ' ') : val,
        }),
        {},
    );

interface Answers {
    type?: string;
    ticker?: string;
    scope?: string;
    topic?: string;
    extended?: string;
    breaking?: boolean;
}

const checkout = async (currentBranch: string): Promise<string> => {
    const { type, ticker, scope } = (await prompts(
        getQuestions({ ...splitBranchName(currentBranch), scope: '', action: 'branch' })
            .filter((e) => e.name !== 'topic' && e.name !== 'breaking') as prompts.PromptObject[],
    ).then(trimValues)) as Answers;

    if (!type) {
        throw Error('Cannot create branch with empty type');
    }

    if (!scope && !ticker) {
        throw Error('Cannot create branch with both scope and ticker being empty');
    }

    return [type, ticker, scope?.split(/\s/).filter(Boolean).join('-')].filter(Boolean).join('/');
};

const commit = async (currentBranch: string): Promise<string> => {
    const { type, ticker, scope, breaking, topic, extended } = (await prompts(
        getQuestions({ ...splitBranchName(currentBranch), action: 'commit' }) as prompts.PromptObject[],
    ).then(trimValues)) as Answers;

    if (!type) {
        throw Error('Cannot commit with empty type');
    }

    if (!scope && !topic && !ticker) {
        throw Error('Cannot commit with both ticker, scope and topic being empty');
    }

    const message = [topic, extended].filter(Boolean).join('\n\n');

    return [
        type,
        scope ? `(${scope})` : '',
        breaking ? '!' : '',
        ticker || topic ? ': ' : '',
        ticker ? `[${ticker}]`.replace(/\s/g, '-') + ' ' : '',
        message,
    ].join('').trim();
};

const retry = async (commitMessage: string): Promise<boolean> =>
    (
        await prompts([
            {
                type: 'confirm',
                name: 'retry',
                message: `Do you want to commit changes with message:\n\n\t${commitMessage}\n\n`,
                initial: false,
            },
        ])
    ).retry;

export { checkout, commit, retry };

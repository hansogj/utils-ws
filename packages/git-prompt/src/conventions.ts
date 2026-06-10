type Action = 'branch' | 'commit';

interface QuestionArgs {
    type?: string;
    ticker?: string;
    scope?: string;
    action: Action;
}

const list = ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'style', 'test'];

const defaultConvention = list.indexOf('feat');

const getQuestions = ({ type, ticker, scope, action }: QuestionArgs) => {
    const initial = type !== undefined && list.indexOf(type) > -1 ? list.indexOf(type) : defaultConvention;
    return [
        {
            type: 'select',
            name: 'type',
            message: `Type of ${action}?`,
            initial,
            choices: list.map((value) => ({ value, title: value })),
        },
        {
            type: 'text',
            name: 'ticker',
            initial: ticker,
            message: `Ticker number? (ie JIRA-123). Leave blank if none`,
        },
        {
            type: 'text',
            name: 'scope',
            initial: scope,
            message: `Scope of ${action}`,
            validate: (value: string | undefined) =>
                (value?.trim().length ?? 0) < 2 ? `Scope should have at least 2 characters` : true,
        },
        {
            type: 'text',
            name: 'topic',
            message: `What ${action === 'branch' ? 'will change' : 'has changed'} in ${action}`,
        },
        {
            type: 'text',
            name: 'extended',
            message: `Is there more to say? (optional)`,
            optional: true,
        },
        {
            type: 'confirm',
            name: 'breaking',
            message: `Is ${action} breaking?`,
        },
    ].filter(({ name }) => (name === 'extended' ? action === 'commit' : true));
};

export { getQuestions, list };

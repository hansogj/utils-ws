const list = ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'style', 'test'];

const defaultConvention = list.indexOf('feat');

const getQuestions = ({ type, ticker, scope, action }) => {
    const initial = list.indexOf(type) > -1 ? list.indexOf(type) : defaultConvention;
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
            validate: (value) => (value?.trim().length < 2 ? `Scope should have at least 2 characters` : true),
        },
        {
            type: 'text',
            name: 'topic',
            message: `What ${action === 'branch' ? 'will change' : 'has changed'} in ${action}`,
        },

        {
            type: 'confirm',
            name: 'breaking',
            message: `Is ${action} breaking?`,
        },
    ];
};

module.exports = {
    getQuestions,
    list,
};

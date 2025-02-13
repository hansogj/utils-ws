const list = ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'style', 'test'];

const defaultConvention = list.indexOf('feat');

const getQuestions = ({ type, ticker, scope, action }) => {
    const initial = list.indexOf(type) > 0 ? list.indexOf(type) : defaultConvention;
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
            name: 'scope',
            initial: scope,
            message: `Scope of ${action}`,
        },
        {
            type: 'text',
            name: 'ticker',
            initial: ticker,
            message: `Ticker number? (ie JIRA-123) - leave blank if none`,
        },
        {
            type: 'text',
            name: 'topic',
            message: `What ${action === "branch" ? "will change" : "has changed"} in ${action}`,
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
};

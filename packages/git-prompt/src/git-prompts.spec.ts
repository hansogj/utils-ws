import prompts from 'prompts';
import * as gitPrompts from './git-prompts';
import { list } from './conventions';

jest.mock('prompts');

const mockedPrompts = prompts as unknown as jest.Mock;

describe('git-prompts', () => {
    describe('questions', () => {
        const commonCases: Array<[string, { initialType?: number; ticker?: string; scope?: string }]> = [
            ['', { initialType: 4 }],
            ['main', { initialType: 4 }],
            ['master', { initialType: 4 }],
            ['feature', { initialType: 4 }],
            ['build', { initialType: 0 }],
            ['chore', { initialType: 1 }],
            ['ci', { initialType: 2 }],
            ['docs', { initialType: 3 }],
            ['feat', { initialType: 4 }],
            ['fix', { initialType: 5 }],
            ['perf', { initialType: 6 }],
            ['refactor', { initialType: 7 }],
            ['style', { initialType: 8 }],
            ['test', { initialType: 9 }],
        ];

        describe('checkout', () => {
            describe.each([
                ...commonCases,
                ['main/AI', { initialType: 4 }],
                ['feat/AI', { initialType: 4 }],
                ['fix/AI', { initialType: 5 }],
                ['fix/AI/got-it-all-wrong', { ticker: 'AI', initialType: 5, scope: '' }],
                ['fix/-/got-it-all-wrong', { ticker: '-', initialType: 5, scope: '' }],
            ] as Array<[string, { initialType?: number; ticker?: string; scope?: string }]>)(
                'when current branch is %j',
                (currentBranch, expected) => {
                    const questions = ({ initialType = 4, ticker, scope = '' }: { initialType?: number; ticker?: string; scope?: string } = {}) => [
                        {
                            choices: list.map((value) => ({ value, title: value })),
                            initial: initialType,
                            message: 'Type of branch?',
                            name: 'type',
                            type: 'select',
                        },
                        {
                            initial: ticker,
                            message: 'Ticker number? (ie JIRA-123). Leave blank if none',
                            name: 'ticker',
                            type: 'text',
                        },
                        {
                            initial: scope,
                            message: 'Scope of branch',
                            name: 'scope',
                            type: 'text',
                            validate: expect.any(Function),
                        },
                    ];

                    beforeEach(async () => {
                        mockedPrompts.mockResolvedValue({ type: 'feat', scope: 'AI' });
                        gitPrompts.checkout(currentBranch);
                    });

                    afterEach(() => mockedPrompts.mockRestore());

                    it(`call prompt function with ${JSON.stringify(questions(expected))}`, () => {
                        expect(mockedPrompts).toHaveBeenCalledTimes(1);
                        expect(mockedPrompts).toHaveBeenCalledWith(questions(expected));
                    });
                },
            );
        });

        describe('commit', () => {
            describe.each([
                ...commonCases,
                ['main/AI', { initialType: 4, scope: 'AI' }],
                ['feat/AI', { initialType: 4, scope: 'AI' }],
                ['fix/AI', { initialType: 5, scope: 'AI' }],
                ['fix/AI/got-it-all-wrong', { ticker: 'AI', initialType: 5, scope: 'got-it-all-wrong' }],
                ['fix/-/got-it-all-wrong', { ticker: '-', initialType: 5, scope: 'got-it-all-wrong' }],
            ] as Array<[string, { initialType?: number; ticker?: string; scope?: string }]>)(
                'when current branch is %j',
                (currentBranch, expected) => {
                    const questions = ({ initialType = 4, ticker, scope = '' }: { initialType?: number; ticker?: string; scope?: string } = {}) => [
                        {
                            choices: list.map((value) => ({ value, title: value })),
                            initial: initialType,
                            message: 'Type of commit?',
                            name: 'type',
                            type: 'select',
                        },
                        {
                            initial: ticker,
                            message: 'Ticker number? (ie JIRA-123). Leave blank if none',
                            name: 'ticker',
                            type: 'text',
                        },
                        {
                            initial: scope,
                            message: 'Scope of commit',
                            name: 'scope',
                            type: 'text',
                            validate: expect.any(Function),
                        },
                        {
                            message: 'What has changed in commit',
                            name: 'topic',
                            type: 'text',
                        },
                        {
                            message: 'Is there more to say? (optional)',
                            name: 'extended',
                            type: 'text',
                            optional: true,
                        },
                        {
                            message: 'Is commit breaking?',
                            name: 'breaking',
                            type: 'confirm',
                        },
                    ];

                    beforeEach(async () => {
                        mockedPrompts.mockResolvedValue({ type: 'feat', scope: 'some' });
                        gitPrompts.commit(currentBranch);
                    });

                    afterEach(() => mockedPrompts.mockRestore());

                    it(`call prompt function with ${JSON.stringify(questions(expected))}`, () => {
                        expect(mockedPrompts).toHaveBeenCalledTimes(1);
                        expect(mockedPrompts).toHaveBeenCalledWith(questions(expected));
                    });
                },
            );
        });

        describe('retry', () => {
            describe.each([['no comment'], ['feat(AI)!: [ABC-123] loads of changes']])(
                'when current branch is %j',
                (msg) => {
                    const questions = (commitMessage = '') => [
                        {
                            type: 'confirm',
                            name: 'retry',
                            message: `Do you want to commit changes with message:\n\n\t${commitMessage}\n\n`,
                            initial: false,
                        },
                    ];

                    beforeEach(async () => {
                        mockedPrompts.mockResolvedValue({ retry: true });
                        gitPrompts.retry(msg);
                    });

                    afterEach(() => mockedPrompts.mockRestore());

                    it(`call prompt function with ${JSON.stringify(questions(msg))}`, () => {
                        expect(mockedPrompts).toHaveBeenCalledTimes(1);
                        expect(mockedPrompts).toHaveBeenCalledWith(questions(msg));
                    });
                },
            );
        });
    });

    describe('output', () => {
        describe('checkout', () => {
            describe.each([
                [{}, 'Cannot create branch with empty type', { type: 'fix' }, 'Cannot create branch with both scope and topic being empty'],
            ])('when given answers is %j', (answers, expected) => {
                beforeEach(async () => mockedPrompts.mockResolvedValue(answers));
                afterEach(() => mockedPrompts.mockRestore());

                it(`commit throw Error`, async () =>
                    expect(async () => {
                        await gitPrompts.checkout('main');
                    }).rejects.toThrow(expected as string));
            });

            describe.each([
                [{ type: 'feat', scope: 'shope' }, 'feat/shope'],
                [{ type: 'feat', ticker: 'ABC-123' }, 'feat/ABC-123'],
                [{ type: 'feat', scope: 'AI' }, 'feat/AI'],
                [{ type: 'feat', ticker: 'ABC-123', scope: 'AI' }, 'feat/ABC-123/AI'],
                [{ type: 'feat', ticker: 'ABC-123', scope: 'AI' }, 'feat/ABC-123/AI'],
            ])('when given answers is %j', (answers, expected) => {
                let result = '';
                beforeEach(async () => {
                    mockedPrompts.mockResolvedValue(answers);
                    result = await gitPrompts.checkout('main');
                });

                afterEach(() => mockedPrompts.mockRestore());

                it(`new branch name should be ${JSON.stringify(expected)}`, () => {
                    expect(result).toEqual(expected);
                });
            });
        });

        describe('commit', () => {
            describe.each([
                [{}, 'Cannot commit with empty type', { type: 'fix' }, 'Cannot commit with both ticker, scope and topic being empty'],
            ])('when given answers is %j', (answers, expected) => {
                beforeEach(async () => mockedPrompts.mockResolvedValue(answers));
                afterEach(() => mockedPrompts.mockRestore());

                it(`commit throw Error`, async () =>
                    expect(async () => {
                        await gitPrompts.commit('main');
                    }).rejects.toThrow(expected as string));
            });

            describe.each([
                [{ type: 'feat', scope: 'AI' }, 'feat(AI)'],
                [{ type: 'feat', scope: ' AI  ' }, 'feat(AI)'],
                [{ type: 'feat', ticker: 'ABC-123' }, 'feat: [ABC-123]'],
                [{ type: 'feat', ticker: ' ABC  123   ' }, 'feat: [ABC-123]'],
                [{ type: 'feat', ticker: 'ABC-123', scope: 'AI' }, 'feat(AI): [ABC-123]'],
                [{ type: 'feat', ticker: 'ABC-123', scope: 'AI', breaking: true }, 'feat(AI)!: [ABC-123]'],
                [
                    { type: 'feat', ticker: 'ABC-123', scope: 'AI', topic: 'done lots of things' },
                    'feat(AI): [ABC-123] done lots of things',
                ],
            ])('when given answers is %j', (answers, expected) => {
                let result = '';
                beforeEach(async () => {
                    mockedPrompts.mockResolvedValue(answers);
                    result = await gitPrompts.commit('main');
                });

                afterEach(() => mockedPrompts.mockRestore());

                it(`commit message should be ${JSON.stringify(expected)}`, () => {
                    expect(result).toEqual(expected);
                });
            });
        });
    });
});

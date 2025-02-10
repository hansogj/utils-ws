# GIT-PROMPT

Simple generator of branch names and commit messages. 

### Checkout
If the checkout prompter recognizes the current branch as a conventional branch name, it suggest new branch name derived from the original. Otherwise it just
guides the user to create a branch on the format 

`feat/JIRA-123/current-issue-to-solve` 


### Commit 

If the commit prompter recognizes the current branch as conventional i.e `feat/JIRA-123/current-issue-to-solve` , it will suggest to create a commit
message of the format  

`feat(*scope*): [JIRA-123] current issue to solve` 

where user provides a scope value. The other parts of the message can also be overridden.

## Installation

Install into your npm project

`npm i @hansogj/git-prompt `

or globally on your computer 

`npm i -g @hansogj/git-prompt `

## Usage

In your git config file (global or local), add aliases i.e

```
p-co = "!f() { \
    npx git-prompt-co; \
}; f"

p-commit = "!f() { \
    local MSG_FILE=$(git rev-parse --show-toplevel)/.git/COMMIT_EDITMSG; \
    npx git-prompt-commit $MSG_FILE ; \
    git commit -F $MSG_FILE $@ ;\
}; f"

p-add-commit = "!f() { \
    git add -A ; \
    git p-commit $@ ; \
}; f"

```
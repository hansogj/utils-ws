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

## Usage

In your git config file, add aliases i.e

```
p-co = "!f() { \
        node /[PATH-TO]/git-prompt/dist/co.js ;\
}; f"

p-commit = "!f() { \
        node /[PATH-TO]/git-prompt/dist/commit.js ;\
}; f"

p-add-commit = "!f() { \
      git add -A && node /[PATH-TO]/git-prompt/dist/commit.js ;\
}; f"

```
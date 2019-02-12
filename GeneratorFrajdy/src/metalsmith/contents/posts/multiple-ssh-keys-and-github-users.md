---
id: 1503347737421
title: Multiple SSH keys and Github users
description: Guide how to use mutliple github accounts in everyday work
collection: posts
author: kernelpanic
date: 2017-07-24
layout: post.html
---
Git is a great tool. I've been using SVN and Mercurial but for me Git hit the
spot. There are times I'm sitting comfortable in chair git pulling or git
pushing feeling the flow and everything is working as expected. But sometimes
I want to change git account to another - private one and there is the hitch.

## Option 1

I can set global config for my private account

```bash
git config --global user.name "Your Name Here"
git config --global user.email your@email.com
```

And I can specify individual user.name and user.email to use in specific repo.

```bash
git config user.name "Your Name Here"
git config user.email your@email.com
```

It works over https but what about ssh? I want to use my keys for the auth
process.

## Option 2

In this option I assume that we have two ssh keys created and ready to use. If
not, follow this step-by-step guide at 
[help.github.com](https://help.github.com/articles/connecting-to-github-with-ssh/)

Back to the topic. I can make ssh config to handle it for me. First of all
I need to create or edit ~/.ssh/config and configure two or more hosts in there.

```
# Personal Github
Host github-cringedcoder
HostName github.com
User cringedcoder
IdentityFile ~/.ssh/id_rsa_cringedcoder

# Work
Host github.com
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa
```
Later if I want to write code as cringedcoder I have to provide address with
changed hostname.

```bash
git clone git@github-cringedcoder:cringedcoder/cringedcoder.github.io.git
```
Also if I already have cloned repo and I want to change account without cloning
it again, I change url in [remote "origin"] section in .git/config file of the
repo, or simply 
```bash
git remote set-url origin git@github-cringedcoder:cringedcoder/cringedcoder.github.io.git
```
And then I have to change user for this specific repo in case of commit user
mismatch.
```bash
git config user.name "Cringed Coder"
git config user.email "[ommited]"
```

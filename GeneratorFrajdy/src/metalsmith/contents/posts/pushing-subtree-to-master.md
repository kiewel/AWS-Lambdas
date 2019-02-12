---
id: 1503347719113
title: Pushing subtree to master
description: Brief instructions on how to push directory to separate branch
collection: posts
author: kernelpanic
date: 2017-07-22
layout: post.html
---
I'm using Metalsmith to build this static blog at the moment. Well
I've just started and already came across some obstacles. How Metalsmith works
is it takes contents of source directory, processes through pipeline and outputs
results to destination directory. It's ok. That’s what expected to happen.
But it's troublesome when it comes to use the results as GitHub personal page 
(just like this one).

GitHub pages are making user to use master branch as main branch for publishing
page content. User cannot use .htaccess or .config because GitHub does not allow
that - security reasons. I don't want to use Jekyll _config.yml file to redirect
from because it uses HTTP-REFRESH meta tag. And I don't want to build to current
directory because of a mess that's going to happen. The only idea I've come up
is to create separate branch for all the files required to build the site,
and make master branch to store only built static files. But copying files
manually is not worth considering.

The best solution I've come across is to use the git subtree command. The case
with GitHub personal page is the opposite to GitHub project page. In GitHub
project page we would create custom_source_branch and subtree to gh-pages or
different custom_page_branch which would be indicated in settings as GitHub page
branch. In this case we can't change the GitHub personal page branch. It always
is master. So I've created gh-pages branch and pushed all the files in there.
```bash
git checkout -b gh-pages
git add --all
git commit -m 'Initial page'
git push --set-upstream origin gh-pages
```
Then tried to subtree my build directory to master.
```bash
git subtree push --prefix build origin master
```
Usually when setting up project GitHub creates README.md. Sometimes we already
have some changes on master. In any case if master becomes a subtree, there
almost always will be a conflict. Differences between subtree and a target
branch makes creating a subtree impossible.
```
git subtree push --prefix build origin master
git push using:  origin master
To git@git-cringedcoder:cringedcoder/cringedcoder.github.io.git
 ! [rejected]        ba888d9a95c939f6c0146487189f0b7e282d208a -> master (non-fast-forward)
 error: failed to push some refs to 'git@git-cringedcoder:cringedcoder/cringedcoder.github.io.git'
 hint: Updates were rejected because a pushed branch tip is behind its remote
hint: counterpart. Check out this branch and integrate the remote changes
hint: (e.g. 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```
The solution is to force push subtree to master branch. Note that all changes on
master will be overwritten so use the following command with care.
```$
git push origin `git subtree split --prefix build gh-pages`:master --force
```
What this command do is this that it chains creating a subtree with force push
to master branch. Creating a subtree separated build directory
of gh-pages branch into a new "on the fly branch". Then the new branch was
passed as one of the parameters to the force push command. The contents of
master branch were overwritten by subtree.
After forcing first subtree push there is no need to force it later on.
Simply use following command and it will subtree without a conflict.
```bash
git subtree push --prefix build origin master
```

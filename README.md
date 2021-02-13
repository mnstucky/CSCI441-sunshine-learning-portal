# Sunshine Learning Portal
CSCI 441: Software Engineering - Repository for Sunshine Learning Portal

## Quick Start Guide
To get started:
1. Install git. The below instructions are tailored for git's command-line implementation. On Windows, you'll want to install and use [Git Bash](https://gitforwindows.org/).

2. Install Node.js (version 14.15.4 LTS or newer) and NPM. Node + Windows may not be fast friends, but Microsoft has a comprehensive [guide](https://docs.microsoft.com/en-us/windows/nodejs/setup-on-windows).

3. Clone the repository. Navigate to the desired directory in a terminal (on MacOS/Linux) or in Git Bash (Windows) and clone the repository with the command,

``` git clone https://github.com/mnstucky/CSCI441-sunshine-learning-portal.git ``` 

4. Git will download a copy of the GitHub repository to your machine into a  new folder, CSCI441-sunshine-learning-portal, which git will create wherever you run the git clone command. In the repository's local directory, run the command, 

``` npm install ```

5. Again in the repository's local directory, run the command, 

```npm run dev``` 

6. The development server should be live. Navigate to localhost:3000 in a browser to confirm. The server will restart every time you make changes to the project's code (you'll still need to refresh your browser to see any changes).

## Development Workflow

GitHub and git are different. GitHub is a place online to store and collaborate on git-based projects. Git is a version-control system stored on your local machine. You will do all coding on your local machine, and we will share code on the "main" branch on Github using the following process:

1. Before you start editing your local copy of our project, you'll want to be sure you have the latest version of the project (e.g., a team member may have made changes and uploaded them to GitHub since you last worked on the project; to avoid headaches, you'll want to incorporate those changes locally before you start coding). **Always** run the following command **before** you do any new coding:

```git pull origin main```

2. The pull command will try to sync your local copy of the project with the uploaded GitHub verison. If you haven't made any local changes that conflict with what's on GitHub, you won't get an error message, and you're ready to start editing. If git finds a problem, it will tell you something like "Please commit your changes or stash them before you merge." To keep your local changes, make a commit (see instruction #4 and following).

**If the conflict involves changes to package.json, package_lock.json, or anything in the node_modules folder (or just generally stuff you don't recognize), please flag the issue in the Discord. Tag @stupub.**

3. Code away on your local copy of the project using your favorite text editor. When you reach a good stopping point (i.e., you've implemented a logical chunk of a new feature, fixed a bug, etc.), it's time to commit your changes and then upload them to GitHub. Two recommendations:

    a. Don't commit a broken version of the project. Go to localhost:3000 *before* you commit anything to make sure the website still works.

    b. Commit often. Rather than waiting until you've implemented a massive feature, commit as you make incremental progress.

4. Check to see what you want/need to commit with

```git status```

5. Git will display a list of files. The "untracked files" (in red) aren't ready to be committed. Add the files you want to commit with:

```git add [filename]```

6. Check to make sure you've successfully added the files you want (the files to be committed will now be in green; if they're still in red, you missed something in the last step):

```git status```

7. If you're happy with the files you've added, create a commit. The "commit message" is just a description of what you've changed. Be as descriptive as possible:

```git commit -m [commit message]```

9. Upload your committed changes to GitHub:

```git push origin main```

10. If your changes conflict with what's on GitHub, you'll get an error like "Updates were rejected..." Do this:

    a. Run the command:

    ```git pull origin main```

    b. Time to fire up your favorite text editor (VS Code works!). VS Code: you'll see file(s) in your project explorer with a "c" for conflict. VS Code will show you your edits (marked "Current Change") and changes from GitHub (marked "Incoming Change"). For each conflict, you'll need to pick the appropriate option: Accept Current Change, Accept Incoming Change, or Accept Both Changes. If you're not sure what to do, send out a Discord message to the group. You can see who last changed what in the GitHub version by clicking the rewinding clock icon next to "X commits" from our main repository page.

    c. Time to add the files in which you resolved conflicts:

    ```git add [filenames]```

    d. Check to make sure you've added the right files:

    ```git status```

    e. Make a commit:

    ```git commit -m [commit message]```

    f. Push the resolved conflicts to GitHub:

    ```git push origin main```

11. (Optional) Want to see what our team's "commit history" looks like? Try:

```git log --all --graph --decorate```
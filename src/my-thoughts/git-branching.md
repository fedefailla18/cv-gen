---
title: "Git Branching in Trunk-Based Development"
category: "Version Control"
tags: ["git", "branching", "trunk-based", "CI/CD", "rebase"]
interviewRelevance: "high"
difficulty: "intermediate"
date: "2025-01-01"
summary: "Sprint integration branches, rebase strategy at sprint close, and hotfix cherry-pick process in a trunk-based model"
---

interviewer: "How do you manage long-lived feature branches in a trunk-based model when the integration target moves? What's your process at sprint close?"

me: "We use a trunk-based model with a short-lived integration branch per sprint — integration/Rxx.x — that acts as the sprint's accumulation target. Feature branches are cut from integration and PR'd back into it during the sprint. At sprint close, integration is merged into master via a single merge commit, making master the new source of truth.

At that point, any open feature branches become diverged from master — they have a merge base that predates the sprint merge. The fix is a rebase onto master: you replay your feature commits on top of master's HEAD, rewriting their SHAs so the branch has a clean, linear history off the current master. Then you retarget the open MR in GitLab from the integration branch to master.

You can diagnose the divergence with git log origin/master..HEAD (your commits not in master) and git log HEAD..origin/master (master commits you're missing). If the second list is empty, you can retarget without rebasing. If it has commits, rebase first.

For hotfixes during the release stabilization period, we use a two-branch process: the fix lands on master via fix/PL-xxx, then a separate cherry/PL-xxx branch off the release branch applies the same commit via git cherry-pick. Two MRs, same ticket — master stays authoritative and the release branch only ever receives cherry-picks."
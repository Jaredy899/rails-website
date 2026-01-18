---
title: "My Mac Setup"
description: "A detailed look at my macOS development environment and tools."
pubDate: 2025-07-20
draft: false
---

# My Mac Setup

As a developer, having a well-configured development environment is crucial. Here's a look at my current Mac setup.

## Hardware

* **MacBook Pro** - M3 Pro chip
* **32GB RAM** - For running multiple VMs and containers
* **1TB SSD** - Fast storage for projects

## Terminal Setup

I use **iTerm2** with the following configuration:

```bash
# Oh My Zsh with custom theme
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="powerlevel10k/powerlevel10k"

# Useful aliases
alias ll="ls -la"
alias gs="git status"
alias gc="git commit"
alias gp="git push"
```

## Development Tools

### Code Editors

* **VS Code** - Primary editor
* **Cursor** - AI-powered coding
* **Vim** - Quick edits in terminal

### Languages & Frameworks

```ruby
# Ruby/Rails development
ruby "3.3.0"
gem "rails", "~> 8.0"
```

```javascript
// Node.js for frontend
const node = "v20.x";
const packageManager = "bun";
```

## Apps I Use Daily

1. **Arc** - Modern browser
2. **Raycast** - Spotlight replacement
3. **1Password** - Password management
4. **Notion** - Notes and documentation
5. **Slack** - Team communication

## Conclusion

A good setup makes development enjoyable. Take time to customize your environment to fit your workflow!

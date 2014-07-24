# Completion for Assemble

> Thanks to gulp team, grunt team and Tyler Kellen

To enable tasks auto-completion in shell you should add `eval "$(assemble --completion=shell)"` in your `.shellrc` file.

## Bash

Add `eval "$(assemble --completion=bash)"` to `~/.bashrc`.

## Zsh

Add `eval "$(assemble --completion=zsh)"` to `~/.zshrc`.

## Powershell

Add `Invoke-Expression ((assemble --completion=powershell) -join [System.Environment]::NewLine)` to `$PROFILE`.

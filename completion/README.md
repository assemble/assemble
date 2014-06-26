# Completion for Assemble

> Thanks to gulp team, grunt team and Tyler Kellen

To enable tasks auto-completion in shell you should add `eval "$(Assemble --completion=shell)"` in your `.shellrc` file.

## Bash

Add `eval "$(Assemble --completion=bash)"` to `~/.bashrc`.

## Zsh

Add `eval "$(Assemble --completion=zsh)"` to `~/.zshrc`.

## Powershell

Add `Invoke-Expression ((Assemble --completion=powershell) -join [System.Environment]::NewLine)` to `$PROFILE`.

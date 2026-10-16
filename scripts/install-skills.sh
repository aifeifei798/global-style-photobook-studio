#!/usr/bin/env bash
# install-skills.sh — 把 photobook skill 套装安装到本机所有 agent 的 skills 目录
# 目标：~/.hermes/skills (Hermes)、~/.claude/skills (Claude Code)、~/.config/opencode/skills (opencode)
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

SKILLS=(photobook-studio photobook-prompt-guard photobook-style-recipes)

for target in "$HOME/.hermes/skills" "$HOME/.claude/skills" "$HOME/.config/opencode/skills"; do
  # 只有对应 agent 的父目录存在时才安装（例如没装 opencode 就跳过）
  if [[ ! -d "$(dirname "$target")" ]]; then
    echo "跳过：$(dirname "$target") 不存在"
    continue
  fi
  mkdir -p "$target"
  for s in "${SKILLS[@]}"; do
    mkdir -p "$target/$s"
    cp -r "$ROOT/skills/$s/." "$target/$s/"
    echo "已安装 $s -> $target/$s"
  done
done

echo "完成。三个 skill：photobook-studio / photobook-prompt-guard / photobook-style-recipes"

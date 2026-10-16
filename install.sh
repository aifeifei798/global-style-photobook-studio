#!/usr/bin/env bash
# install.sh — 一键安装：环境检查 → 依赖 → .env → 类型检查 → 测试 → 生产构建
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

echo "== 1/5 环境检查 =="
if ! command -v node >/dev/null 2>&1; then
  echo "错误：未找到 Node.js，请安装 Node 18 或更高版本"; exit 1
fi
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if (( NODE_MAJOR < 18 )); then
  echo "错误：Node $NODE_MAJOR 太旧，项目要求 Node 18+"; exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "错误：未找到 npm"; exit 1
fi
echo "Node $(node -v) / npm $(npm -v) — OK"

echo "== 2/5 安装依赖 =="
npm install

echo "== 3/5 配置 .env =="
if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "已从 .env.example 生成 .env — 请填入 OPENAI_API_KEY（可选：不填则自动走离线确定性生成引擎）"
else
  echo ".env 已存在，跳过"
fi

echo "== 4/5 类型检查 + 单元测试 =="
npm run lint
npm run test

echo "== 5/5 生产构建 =="
npm run build

echo ""
echo "安装完成。启动方式："
echo "  ./server.sh start   # 生产模式（后台运行 + 日志）"
echo "  ./server.sh dev     # 开发模式（前台，热重载）"

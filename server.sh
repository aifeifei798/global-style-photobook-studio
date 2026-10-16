#!/usr/bin/env bash
# server.sh — 服务管理：start/stop/restart/status/logs/build/dev/test/clean
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

PID_FILE="$ROOT/.server.pid"
LOG_FILE="$ROOT/logs/server.log"
PORT="${PORT:-3000}"

is_running() {
  if [[ -f "$PID_FILE" ]]; then
    pid="$(cat "$PID_FILE")"
    if kill -0 "$pid" 2>/dev/null; then
      return 0
    fi
    rm -f "$PID_FILE"
  fi
  return 1
}

cmd_build()  { npm run build; }
cmd_dev()    { npm run dev; }
cmd_test()   { npm run test; }
cmd_clean()  { npm run clean; }

cmd_start() {
  if is_running; then
    echo "服务已在运行 (pid $(cat "$PID_FILE"))，如需重启请用 ./server.sh restart"
    return 0
  fi
  if [[ ! -f dist/server.cjs ]]; then
    echo "dist/server.cjs 不存在，先执行生产构建..."
    npm run build
  fi
  mkdir -p logs
  NODE_ENV=production nohup node dist/server.cjs > "$LOG_FILE" 2>&1 &
  echo $! > "$PID_FILE"
  for _ in $(seq 1 30); do
    if curl -s "http://localhost:$PORT/api/health" >/dev/null 2>&1; then
      echo "服务已启动：http://localhost:$PORT  (pid $(cat "$PID_FILE"))"
      echo "日志：$LOG_FILE"
      return 0
    fi
    sleep 0.5
  done
  echo "错误：服务 15 秒内未响应，请检查日志 $LOG_FILE"
  exit 1
}

cmd_stop() {
  if ! is_running; then
    echo "服务未在运行"
    return 0
  fi
  pid="$(cat "$PID_FILE")"
  kill "$pid"
  rm -f "$PID_FILE"
  echo "服务已停止 (pid $pid)"
}

cmd_restart() {
  cmd_stop
  cmd_start
}

cmd_status() {
  if is_running; then
    echo "运行中：pid $(cat "$PID_FILE")，端口 $PORT"
    echo "健康检查：$(curl -s "http://localhost:$PORT/api/health")"
  else
    echo "未运行"
  fi
}

cmd_logs() {
  if [[ ! -f "$LOG_FILE" ]]; then
    echo "无日志文件（服务从未通过 server.sh 启动）"
    return 0
  fi
  tail -n "${2:-50}" "$LOG_FILE"
}

case "${1:-}" in
  start)   cmd_start ;;
  stop)    cmd_stop ;;
  restart) cmd_restart ;;
  status)  cmd_status ;;
  logs)    cmd_logs ;;
  build)   cmd_build ;;
  dev)     cmd_dev ;;
  test)    cmd_test ;;
  clean)   cmd_clean ;;
  *)
    echo "用法: ./server.sh {start|stop|restart|status|logs|build|dev|test|clean}"
    exit 1 ;;
esac

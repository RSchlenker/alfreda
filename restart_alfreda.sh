#!/bin/bash

if ! pgrep -f "ts-node alfreda-server.ts" > /dev/null; then
    cd /Users/robin/tools/alfreda && yarn dev > /dev/null 2>&1 &
    sleep 3 > /dev/null
fi
PROCESS_NAME="/Users/robin/tools/alfreda/node_modules/.bin/ts-node alfreda-server.ts"
PID=$(ps aux | grep "$PROCESS_NAME" | grep -v "grep" | awk '{print $2}')
kill -SIGTERM "$PID"
cd /Users/robin/tools/alfreda && yarn dev > /dev/null 2>&1 &
sleep 3 > /dev/null

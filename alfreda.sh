#!/bin/bash

if ! pgrep -f "ts-node alfreda-server.ts" > /dev/null; then
    cd /Users/robin/tools/alfreda && yarn dev > /dev/null 2>&1 &
    sleep 3 > /dev/null
fi
npx ts-node /Users/robin/tools/alfreda/request.js "$1" "$FIRST_RUN" "$TARGET_MODEL" "$RAW_MODE"
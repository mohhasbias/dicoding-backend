#!/bin/bash

echo "NGINX_PORT: $PORT"

cat /etc/nginx/nginx.conf | head

sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf

cat /etc/nginx/conf.d/default.conf

# Start the first process
nginx &
  
# Start the second process
PORT=5000 npm start &
  
# Wait for any process to exit
# wait -n
wait
  
# Exit with status of process that exited first
exit $?
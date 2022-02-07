#!/bin/bash

echo "NGINX_PORT: $PORT"

sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf

# Start the first process
nginx -g 'daemon off;' &
  
# Start the second process
PORT=5000 npm start &
  
# Wait for any process to exit
# wait -n
wait
  
# Exit with status of process that exited first
exit $?
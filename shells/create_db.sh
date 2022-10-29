#!/bin/sh

docker run \
    --name mysql \
    -e MYSQL_ROOT_PASSWORD=password \
    -e MYSQL_DATABASE=dbname \
    -p 3306:3306 \
    -d mysql:8

# mysql -u root -p -h localhost -P 3306 --protocol=tcp

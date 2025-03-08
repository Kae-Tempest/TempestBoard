#!/bin/sh

echo "host    all     all     172.21.0.0/12       md5" >> /var/lib/postgresql/data/pg_hba.conf
echo "host    all     all     0.0.0.0/0           md5" >> /var/lib/postgresql/data/pg_hba.conf
echo "host    all     all     127.0.0.1/0           md5" >> /var/lib/postgresql/data/pg_hba.conf

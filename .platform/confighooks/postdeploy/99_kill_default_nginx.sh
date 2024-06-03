#!/bin/bash -xe
rm -f /etc/nginx/conf.d/00_elastic_beanstalk_proxy.conf
if [[ -e /etc/init/nginx.conf ]] ; then
    echo Using initctl to stop and start nginx
    initctl stop nginx || true
    initctl start nginx
else
    echo Using service to stop and start nginx
    service nginx stop
    service nginx start
fi

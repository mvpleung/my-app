#!/usr/bin/env bash
export LANG="en_US.UTF-8"

DEST_HOST="101.37.24.135"
BASE_DIR=$(cd `dirname $0`; pwd)
SSH_KEY="/work/dev_server_ssh.key"
SSH_PORT=22
PRJ_DIR="/work/web/source/gzh-wap"

function setColor()
{
        tput setaf $1 2>/dev/null
}

function resetColor()
{
        tput sgr0 2>/dev/null
}

function echoColor() {
    setColor 6
    echo $1
    resetColor
}

function ssh_exec() {
    cmd=$1
    host=$2
    echoColor "==> run cmd on host:${host}: ${cmd}"
    ssh -i ${SSH_KEY} -p ${SSH_PORT} root@${host} "${cmd}"

}

function rsync_over_ssh() {
    src=$1
    dest=$2
    host=$3
    cmd="rsync -av --delete --progress -e \"ssh -i ${SSH_KEY} -p ${SSH_PORT} \" ${src}  root@${host}:${dest}"
    echoColor "${cmd}"
    rsync -av --delete --progress -e "ssh -i ${SSH_KEY} -p ${SSH_PORT}" ${src}  root@${host}:${dest}
}

function upgradeTestSite() {
    cd $PRJ_DIR
    npm run build:sit
    tar -cvf gzh_html.tar dist 

    rsync_over_ssh gzh_html.tar /data/huitong/webapps/rsync/ $DEST_HOST

    ssh_exec "mkdir -p /data/huitong/webapps/gzh_html" $DEST_HOST
    ssh_exec "rm -rf /data/huitong/webapps/gzh_html/*" $DEST_HOST
    ssh_exec "tar -vxf /data/huitong/webapps/rsync/gzh_html.tar -C /data/huitong/webapps/" $DEST_HOST
    ssh_exec "mv -vf /data/huitong/webapps/dist/* /data/huitong/webapps/gzh_html/" $DEST_HOST
    ssh_exec "rm -rvf /data/huitong/webapps/dist" $DEST_HOST

    clean
    echoColor "更新完毕"

}

function clean() {
    cd $PRJ_DIR
    rm -rvf gzh_html.tar dist
}

upgradeTestSite

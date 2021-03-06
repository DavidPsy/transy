from fabric.api import run, env, cd

env.host_string = "root@173.208.227.86"

def start():
    with cd('/var/www/transy'):
        run('forever -a start -c coffee app.coffee')

def restart():
    with cd('/var/www/transy'):
        run('forever restart app.coffee')

def deploy():
    with cd('/var/www/transy'):
        run('git pull')
        run('forever restart app.coffee')

def ldeploy():
    with cd('/var/www/transy'):
        run('git pull')

def stop():
    with cd('/var/www/transy'):
        run('forever stop app.coffee')

# back up database files
def backup():
    pass

# show apache error log
def log():
    pass

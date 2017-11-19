#!/bin/bash
read -p 'project name: ' proj
read -p 'private IP: ' ip

echo "Installing basic dependencies"
sudo apt-get update > /dev/null
sudo apt-get install -y build-essential openssl libssl-dev pkg-config > /dev/null
echo "Complete"

echo "Installing Node"
sudo apt-get install -y nodejs nodejs-legacy > /dev/null
echo "Complete"

echo "Installing npm and cleaning cache"
sudo apt-get install -y npm > /dev/null
sudo npm cache clean -f > /dev/null 
echo "Complete"

echo "Installing n"
sudo npm install -g n > /dev/null
sudo n 8.4.0
echo "complete"

echo "Installing nginx"
sudo apt-get install -y nginx > /dev/null
echo "Complete"

echo "Configuring nginx to serve MEAN app"
sudo touch /etc/nginx/sites-available/$proj
sudo chown ubuntu /etc/nginx/sites-available/$proj
nginx_text="server {
        listen 80;
        location / {
                proxy_pass http://${ip}:8000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade \$http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host \$host;
                proxy_cache_bypass \$http_upgrade;
        }
}"
sudo echo -e "$nginx_text" > /etc/nginx/sites-available/$proj
sudo rm /etc/nginx/sites-available/default
sudo ln -s /etc/nginx/sites-available/$proj /etc/nginx/sites-enabled/$proj
sudo rm /etc/nginx/sites-enabled/default
echo "Complete"

echo "Installing pm2 and configuring"
sudo npm install pm2 -g > /dev/null

pm2 start server.js > /dev/null
pm2 stop 0 > /dev/null
pm2 restart 0 > /dev/null
sudo service nginx reload && sudo service nginx restart
echo "Complete"

echo "Installing node modules"
sudo npm install 
echo "Complete"

echo "Running webpack build for production"
sudo npm run prod
echo "Complete"

echo "Installing and configuing mongo"
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list > /dev/null

sudo apt-get update > /dev/null
sudo apt-get install -y mongodb-org > /dev/null

sudo mkdir -p /data/db
sudo chown ubuntu /data/db
echo "Complete"

sudo pm2 start mongod > /dev/null
sudo pm2 start server.js > /dev/null
sudo service nginx reload && sudo service nginx restart

sudo pm2 status

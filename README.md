# UNU-SERVER

version 0.1

## Requirements


* Install NodeJS from [https://nodejs.org/](https://nodejs.org/)
* Install MongoDB from [https://www.mongodb.org/](https://www.mongodb.org/)

## Instalacion en Ubuntu 14.04

### Instalar NodeJS
```
#!batch
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
```
### Instalar MongoDB
```
#!batch
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start
```
Para mas información visitar https://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
## Iniciar MongoDB

```
Para Windows:
#!batch
"C:\Program Files\MongoDB\Server\3.2\bin\mongod.exe" --dbpath=D:\mongodb
```

## Iniciar MongoDB como servicio
crear archivo en D:\mongodb\mongod.cfg con el siguiente contenido:

```
#!batch
logpath=D:\mongodb\log\mongo.log
dbpath=D:\mongodb
```
Ejecutar el siguiente comando:
```
#!batch
"C:\Program Files\MongoDB\Server\3.2\bin\mongod.exe" --config "D:\mongodb\mongod.cfg" --install
```
## Requirements for Development

```
[sudo] npm install -g nodemon
[sudo] npm install -g node-inspector
[sudo] npm install -g gulp
[sudo] npm install -g bower
[sudo] npm install -g stylus


```

## Requirements for Production

```
[sudo] npm install forever -g

```

## Install packages in Project

```
cd /unu-server
npm install
```

## Inciar el Proyecto para desarrollo
Para levantar el servidor ejecutar:
```
npm start
```
Para visualizar la aplicación abrir la ruta http://localhost:3000

Si se desea hacer un debug del servidor
```
npm run debug
```
Para escuchar todos los cambios en el cliente:
```
npm run client
```

## Pasos a tener en cuenta antes de iniciar el Proyecto
Antes de iniciar a trabajar se recomienda ejecutar
```
git pull
``

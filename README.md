# UNU-SERVER

version 0.1

## Requirements


* Install NodeJS from [https://nodejs.org/](https://nodejs.org/)
* Install MongoDB from [https://www.mongodb.org/](https://www.mongodb.org/)


## Run MongoDB

```
#!batch
Windows:
"C:\Program Files\MongoDB 2.6 Standard\bin\mongod.exe" --dbpath=D:\mongodb
```


## Requirements for Development

```
[sudo] npm install -g nodemon
[sudo] npm install -g node-inspector
[sudo] npm install -g gulp

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

## Init Project for Development
Para levantar el servidor ejecutar:

```
npm start (levanta el servidor)
Si se desea hacer un debug del servidor
node-inspector --web-port:8080 
nodemon --debug-brk app
```
Para escuchar todos los cambios en el cliente:
```
npm run client
```
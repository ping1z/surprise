# surprise

This repository is a school project for practising database design and web programming. 
Use [Node.js](https://nodejs.org/en/)with [Express.js](https://expressjs.com/) framework.
Use [Mysql](https://www.mysql.com/) as database.

## Dependence
Install Node.js v6.9.4.
Install Mysql and Mysql workbrench.

PS: Suggest Use [Visual Studio Code](http://code.visualstudio.com/) as and IDE for this project.

## Import Schema to Mysql

User Mysql Workbrench in import the schema file <path to dir>/surprise/schema/surprise-v2.3.mwb
PS: please use the lastest version.

Please use user:root password:root123 as you mysql account, or you can go to file <path to dir>/surprise/dao/baseDao.js and change the mysql user and password.

## Install

```bash
$ cd <path to dir>/surprise
$ npm install 
```

## Start Server

```bash
$ cd <path to dir>/surprise
$ node app.js
```

## Run 
User home page:
http://127.0.0.1:3000/

User login page:
http://127.0.0.1:3000/login

Built-in user account:
user: test@test.com
password:test

Admin login page:
http://127.0.0.1:3000/admin

Admin login account:
user: super@admin.com
password: 1234

## Useful Documents
Node.js: 
https://nodejs.org/dist/latest-v6.x/docs/api/util.html

Express routing: 
https://expressjs.com/en/starter/basic-routing.html
https://expressjs.com/en/guide/routing.html 

Express middleware: 
https://expressjs.com/en/guide/writing-middleware.html
https://expressjs.com/en/guide/using-middleware.html 

[Passport-local](https://github.com/jaredhanson/passport-local) Doc and Examples:
https://github.com/passport/express-4.x-local-example/blob/master/server.js

How to write javascript in object-orientation style?
https://www.sitepoint.com/simple-inheritance-javascript/
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain


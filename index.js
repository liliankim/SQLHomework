const mysql = require('mysql2');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3000,
    user: 'root',
    passsword: 'password',
    database: 'sqlHomework'
})
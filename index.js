const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const PORT = process.env.PORT || 3001;

//db connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    passsword: 'password',
    database: 'sqlHomework_db'
},
console.log(`you are connected!`)
);


//this is for prompts

const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const { start } = require("repl");
const { urlToHttpOptions } = require("url");

const PORT = process.env.PORT || 3001;

//db connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  passsword: "password",
  database: "sqlHomework_db",
});

//connection to mySQL server-database
connection,
  connect(function (err) {
    if (err) throw err;
    console.log("SQL is now connected!");

    start();
  });

//this is for prompts
const promptUser = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "please choose from option below",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
        ],
      },
    ])
    //this is the feedback that renders based on choice
    .then((feedback) => {
      const { choices } = feedback;

      if (choices === "View all departments") {
        viewDepartments();
      }
      if (choices === "View all roles") {
        viewRoles();
      }

      if (choices === "View all employees") {
        viewEmployees();
      }

      if (choices === "add a department") {
        addDepartment();
      }

      if (choices === "add a role") {
        addRole();
      }

      if (choices === "add an employee") {
        addEmployee();
      }

      if (choices === "update an employee role") {
        updateRole();
      }
    });
};


//view all departments
function viewDepartments () {
    var SQL = 'SELECT * FROM department';
    connection.query(query, function(err,res){
        if(err)throw err;
        console.table('All Departments:',res);
        options();
    })
};

//view all roles
function viewRoles() {
    var SQL = 'SELECT * FROM role';
    connection.query(query,function(err,res){
      if(err) throw err;
      consoleTable.table('All Roles:', res);
      options();
    })   
};

//view all employees
function viewEmployees() {
    var SQL = 'SELECT * FROM employee';
    connection.query(query, function(err,res){
        if (err) throw err;
        console.log(res.length + 'employees are here!');
        console.table('All Employees:',res);
        options();
    })
};

    
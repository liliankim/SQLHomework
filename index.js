const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const PORT = process.env.PORT || 3001;

//db connection
const connection = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    passsword: "password",
    database: "sqlHomework_db"
  });

  //this is for prompts
const promptUser = () => {
    inquirer.prompt([
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
          "update an employee role"]
      }
    ])
  
    .then((feedback)=> {
        const { choices } = feedback;
    
        if (choices === "View all departments"){
            viewDepartments ();
        }
        if (choices === "View all roles"){
            viewRoles ();
        }

         if (choices === "View all employees"){
                viewEmployees ();
        }
    
        if (choices === "add a department"){
            addDepartment ();
        }

         if (choices === "add a role"){
         addRole ();
        }

        if (choices === "add an employee"){
        addEmployee();
        }

        if (choices === "update an employee role"){
        updateRole();

};

});

};



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

//adding a department
function addDepartment() {
  inquirer.prompt ([
    {
      name: 'newDepartment',
      type: 'input',
      message: 'Enter new department'
    }
  ]).then (function (respond) {
    connection.query (
      'INSERT INTO department SET ?',
      {
        name: answer.newDepartment
      });
      var SQL = 'SELECT * FROM department';
      connection.query(query, function (err, res){
        if(err)throw err;
        console.log('Department successfully addded');
        console.table('Departments', res);
        options();
      })
  })
};

//add a role to database

function addRole(){
  connection.query('SELECT * FROM department', function(err, res){
    if (err) throw err;
    inquirer.prompt([
      {
        name: 'new_role',
        type: 'input',
        message: 'Enter new role'
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter salary'
      },
      {
        name: 'department',
        type: 'list',
        chocies: function() {
          var dept = [];
          for (let i = 0; i < res.length; i++) {
            dept.push(res[i].name);
          }
          return dept;
        },

      }
    ]). then(function(answer){
      let department_id;
      for (let a = 0; a< res.length; a++){
        if (res[a].name == answer.Department){
          department_id = res[a].id;
        }
      }

      connection.query(
        'INSERT INTO role SET ?',
        {
          title: answer.new_role,
          salary: answer.salary,
          department_id: department_id
        },
        function(err, res) {
          if(err) throw err;
          console.log('New role added to system');
          console.table('All Roles:', res);
          options();
        })
    })
  })
};

//add employee
function addEmployee() {
  connection.query('SELECT * FROM role', function (err, res){
    if (err) throw err;
    inquirer.prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'Enter first name of employee',
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'Enter last name of employee'
      },
      {
        name: 'manager_id',
        type: 'input',
        message: 'Enter employee manager ID'
      },
      {
        name: 'role',
        type: 'list',
        choices: function() {
          var roleSelection = [];
          for (let i= 0; i < res.length; i++){
            roleArray.push(res[i].title);
          }
          return roleArray;
        },
        message: 'enter employee role'
      }
    ]).then(function (answer){
      let role_id;
      for(let a=0; a < res.length; a++) {
        if (res[a].title == answer.role){
          role_id = res [a].id;
        }
      }
      connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          manager_id: answer.manager_id,
          role_id: role_id,
        },
        function (err) {
          if(err) throw err;
          console.log('emplpoyee added to system');
          options();
        })
    })
  })
};

   


  
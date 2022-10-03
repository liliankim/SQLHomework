const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const PORT = process.env.PORT || 3001;

//db connection
const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "password",
  database: "sql_homework",
});

//connection to mySQL server-database
connection.connect(function (err) {
  if (err) throw err;
  console.log("SQL is now connected!");
  promptUser();
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
      const { options } = feedback;

      if (options === "View all departments") {
        viewDepartments();
      }
      if (options === "View all roles") {
        viewRoles();
      }

      if (options === "View all employees") {
        viewEmployees();
      }

      if (options === "add a department") {
        addDepartment();
      }

      if (options === "add a role") {
        addRole();
      }

      if (options === "add an employee") {
        addEmployee();
      }

      if (options === "update an employee role") {
        updateEmployee();
      }
    });
};

//view all departments
function viewDepartments() {
  var SQL = "SELECT * FROM department";
  connection.query(SQL, function (err, res) {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
}

//view all roles
function viewRoles() {
  var SQL = "SELECT * FROM role";
  connection.query(SQL, function (err, res) {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
}

//view all employees
function viewEmployees() {
  var SQL = "SELECT * FROM employee";
  connection.query(SQL, function (err, res) {
    if (err) throw err;
    console.log(res.length + "employees are here!");
    console.table(res);
    promptUser();
  });
}

//adding a department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "newDepartment",
        type: "input",
        message: "Enter new department",
      },
    ])
    .then(function (answer) {
      connection.query("INSERT INTO department SET ?", {
        name: answer.newDepartment,
      });
      var SQL = "SELECT * FROM department";
      connection.query(SQL, function (err, res) {
        if (err) throw err;
        console.log("Department successfully addded");
        console.table(res);
        promptUser();
      });
    });
}

//add a role to database

function addRole() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "new_role",
          type: "input",
          message: "Enter new role",
        },
        {
          name: "salary",
          type: "input",
          message: "Enter salary",
        },
        {
          name: "department",
          type: "list",
          choices: function () {
            var dept = [];
            for (let i = 0; i < res.length; i++) {
              dept.push(res[i].name);
            }
            return dept;
          },
        },
      ])
      .then(function (answer) {
        let department_id;
        for (let a = 0; a < res.length; a++) {
          if (res[a].name == answer.department) {
            department_id = res[a].id;
          }
        }
        console.log({
          title: answer.new_role,
          salary: answer.salary,
          department_id: department_id,
        });
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.new_role,
            salary: answer.salary,
            department_id: department_id,
          },
          function (err, res) {
            if (err) throw err;
            console.log("New role added to system");
            console.table(res);
            promptUser();
          }
        );
      });
  });
}

//update employee
function updateEmployee() {
  connection.query(
    'SELECT CONCAT(first)name," ", last_name) name, id value from employee',
    function (err, employeeData) {
      connection.query(
        "SELECT title name,id value from role",
        function (err, roleData) {
          if (err) throw err;
          inquirer.prompt([
            {
              name: "employeeId",
              type: "list",
              message: "Enter employee to update role",
              choices: employeeData
            },

            {
              name: "roleId",
              type: "list",
              message: "Enter role ID",
              choices: roleData
            }
          ]).then (function (answer){
            connection.query("update employee set role_id = ? where id = ?", [answer.roleId, answer.employeeId], function(err){
              viewEmployees()
            })
          })
        }
      );
    }
  );
}

//add employee
function addEmployee() {
  connection.query(
    'SELECT CONCAT(first_name," ", last_name) name, id value from employee',
    function (err, employeeData) {
      connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        inquirer
          .prompt([
            {
              name: "first_name",
              type: "input",
              message: "Enter first name of employee",
            },
            {
              name: "last_name",
              type: "input",
              message: "Enter last name of employee",
            },
            {
              name: "manager_id",
              type: "list",
              choices: employeeData,
              message: "Enter employee manager ID",
            },
            {
              name: "role",
              type: "list",
              choices: function () {
                var roleSelection = [];
                for (let i = 0; i < res.length; i++) {
                  roleSelection.push(res[i].title);
                }
                return roleSelection;
              },
              message: "enter employee role",
            },
          ])
          .then(function (answer) {
            let role_id;
            for (let a = 0; a < res.length; a++) {
              if (res[a].title == answer.role) {
                role_id = res[a].id;
              }
            }
            connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name: answer.first_name,
                last_name: answer.last_name,
                manager_id: answer.manager_id,
                role_id: role_id,
              },
              function (err) {
                if (err) throw err;
                console.log("employee added to system");
                viewEmployees();
                
              }
            );
          });
      });
    }
  );
}

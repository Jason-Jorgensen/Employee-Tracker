const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table')
const roles = [];
const departments = [];

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'bootcamp21',
    database: 'employee_tracker'
});

connection.connect((err) => {
    if (err) {
        console.error(`error connecting ${err.stack}`);
        return;
    }
    console.log(`connected as id ${connection.threadId}`);
});

const update = () => {
    roles.length=0;
    departments.length=0;
    connection.query('SELECT name FROM department', (err,res) =>{
        if (err) throw err;
        for(i=0; i <res.length; i++) {
            departments.push(res[i].name)
        }

    connection.query('SELECT title FROM role', (err,res) => {
        if (err) throw err;
        for(i=0; i< res.length; i++) {
            roles.push(res[i].title)
        }
    })
    })
}

const viewJoin = () => {
    connection.query(`
    select employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary
    from employee 
    inner join role 
    on employee.role_id = role.id
    inner join department
    on role.department_id = department.id`, (err, res) => {
        console.table(res);
        startTracker();
    })
};

const viewEmpByRole = (response) => {
    empRole = response.function;
    connection.query(`
    select employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary
    from employee 
    inner join role 
    on employee.role_id = role.id
    inner join department
    on role.department_id = department.id
    WHERE role.title = '${empRole}'`, (err, res) => {
        console.table(res);
        startTracker();
    })
};


// 'select employee.id, employee.first_name, employee_lastname, role.title, department.name, role.salary from employee ((inner join role on employee.role_id = role.id) inner join role on role.department_id = department.id);'

const startTracker = () => {
    update();
    inquirer.prompt([
        {
            type: 'list',
            name: 'function',
            message: 'What would you like to do?',
            choices: [
                'View All Employees', 
                'View Employees by Roles', 
                'View Employees by Department'
            ],
        },
    ]).then((response) => {
        switch (response.function) {
            case 'View All Employees':
                viewJoin();
                break;

            case 'View Employees by Roles':
                inquirer.prompt({
                    type: 'list',
                    name: 'function',
                    message: 'Which Role?',
                    choices: roles,
                        }).then((response) =>{
                            viewEmpByRole(response);
                        })
                break;

            // case 'View Employees by Department':
            //     // ();
            //     break;

            // case 'View All Employees':
            //     // ();
            //     break;
            // case 'View All Employees':
            //     // ();
            //     break;

            // case 'View All Employees':
            //     // ();
            //     break;

            // case 'View All Employees':
            //     // ();
            //     break;

            // case 'View All Employees':
            //     // ();
            //     break;
        }

    })
};

startTracker();





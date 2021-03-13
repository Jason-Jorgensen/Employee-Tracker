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
    // console.log(`connected as id ${connection.threadId}`);
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

const viewEmpByDept = (response) => {
    empDept = response.function;
    connection.query(`
    select employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary
    from employee 
    inner join role 
    on employee.role_id = role.id
    inner join department
    on role.department_id = department.id
    WHERE department.name = '${empDept}'`, (err, res) => {
        console.table(res);
        startTracker();
    })
};

const addDepartment = (response) => {
    let newDept = response.function;
    connection.query(`
    INSERT INTO department (name) VALUES ('${newDept}')
    `);

    connection.query(`
    SELECT * from department`, (err, res) => {
    console.table(res)});

    startTracker();
}

const addRole = (response) => {
    connection.query(`
    SELECT id FROM department WHERE name = '${response.department_id}'
    `
     , (err, res) => {
        if (err) throw err;
        connection.query(`
        INSERT INTO role (title, salary, department_id) VALUES ('${response.role}','${response.salary}','${res[0].id}')
        `)
        console.log(`Added ${response.role} as a new role.`)
    })
    update();

    connection.query(`
    SELECT * from role`, (err, res) => {
    console.table(res)});

    startTracker();
}

const addEmp = (response) => {
    connection.query(`
    SELECT id FROM role WHERE title = '${response.role}'
    `, (err,res) => {
        connection.query(`
        INSERT INTO employee
        (first_name, last_name, role_id) 
        VALUES ('${response.firstname}','${response.lastname}','${res[0].id}')
        `)
    })
    update();
    viewJoin();
    startTracker();

}

const updateEmp = (response) => {
    connection.query(`
    SELECT id FROM role WHERE '${response.newRole}' = title  
    `, (err,res) => {
        connection.query(`
        UPDATE employee
        SET role_id = '${res[0].id}'
        WHERE '${response.who}' = employee.id
        `)
    })

    viewJoin();
}


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
                'View Employees by Department',
                'Add a New Department',
                'Add a New Role',
                'Add Employee',
                'Update Employee Role'
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

            case 'View Employees by Department':
                inquirer.prompt({
                    type: 'list',
                    name: 'function',
                    message: 'Which Role?',
                    choices: departments,
                        }).then((response) =>{
                            viewEmpByDept(response);
                        })
                break;

            case 'Add a New Department':
                connection.query(`
                SELECT * from department`, (err, res) => {
                    console.table(res);
                    inquirer.prompt({
                        // type:'input',
                        name:'function',
                        message:'Type in the new Department name: '
                    }).then((response) => {
                        addDepartment(response);
                    })
                    })
                break;

            case 'Add a New Role':
                connection.query(`
                SELECT * from role`, (err, res) => {
                    console.table(res);
                    inquirer.prompt([
                        {
                        name:'role',
                        message:'Type in the new Role title: '
                        },
                        {
                        name:'salary',
                        message:'What is the salary? ',
                        },
                        {
                        type:"list",
                        name:"department_id",
                        message:"Which Department is the role associated with? ",
                        choices: departments
                        },]).then((response) => {
                            addRole(response);
                        })
                        })
                    break;

            case 'Add Employee':
                connection.query(`
                SELECT * from employee`, (err, res) => {
                    console.table(res);
                    inquirer.prompt([
                        {
                        name:'firstname',
                        message:"Type in Employee's First Name: "
                        },
                        {
                        name:'lastname',
                        message:"Type in Employee's Last Name: ",
                        },
                        {
                        type:"list",
                        name:"role",
                        message:"Select Employee's Role: ",
                        choices: roles
                        }]).then((response) => {
                            addEmp(response);
                        })
                        })

                    break;

            case 'Update Employee Role':
                connection.query(`
                SELECT employee.id, employee.first_name, employee.last_name, role.title
                FROM employee
                INNER JOIN role 
                ON employee.role_id = role.id
                `,(err,res)=> {
                    console.table(res);
                    inquirer.prompt([
                        {
                        name:'who',
                        message:"Type the Employers id from the list above of who's role you would like to change:"
                        },
                        {
                        type:'list',
                        name:'newRole',
                        message:"Select the new role you are assigning this person:",
                        choices: roles
                        }
                    ]).then((response) => {
                        updateEmp(response);
                    })
                })
            

                break;

            // case 'View All Employees':
            //     // ();
            //     break;
        }

    })
};

startTracker();





const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable= require('console.table')

const connection = mysql.createConnection({
    host:'localhost',
    port: 3306,
    user: 'root',
    password:'bootcamp21',
    database:'employee_tracker'
});

connection.connect((err) => {
    if (err) {
        console.error(`error connecting ${err.stack}`);
        return;
    }
    console.log(`connected as id ${connection.threadId}`);
});

const view = () => {
    connection.query('select * from department', (err,departments) => {
        console.table(departments);
        startTracker();
    })
};


startTracker();
const startTracker = () => {
    inquirer.prompt([
    {
        type:'list',
        name:'function',
        message:'What would you like to do?',
        choices: ['View All Eployees','View All Roles','View All Departments'],
    },
]).then((command) => {
    let commands = command.function;
    if (commands === 'View All Employees'){
        console.log('yes')
    }
    else if(commands === 'View All Roles'){
        console.log('no')
    }
    else if(commands === 'View All Departments'){
        view();
        
    }
})
};




INSERT INTO department (name)
VALUES ('Information Technology'),('Finance'),('Administration');

INSERT INTO role (title,salary,department_id)
VALUES ('Manager',200000,1),('Engineer',115000,1),('CFO',250000,2);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jason', 'Jorgensen',2),('Paige','Jorgensen',3);
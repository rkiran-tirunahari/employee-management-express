const mongoose = require('mongoose');
const Employee = require('./models/employee');


const employees = [
  {
    id: '1',
    name: 'Alice Smith',
    age: 30,
    class: 'A',
    subjects: ['Math', 'Science'],
    attendance: 95,
    role: 'admin',
    password: 'password123',
  },
  {
    id: '2',
    name: 'Bob Johnson',
    age: 28,
    class: 'B',
    subjects: ['English', 'History'],
    attendance: 90,
    role: 'admin',
    password: 'password123',
  },
];


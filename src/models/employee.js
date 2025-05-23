const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  subjects: {
    type: [String],
    required: true,
  },
  attendance: {
    type: Number,
    required: true,
  },
  role: {
  type: String,
  enum: ['admin', 'employee'],
  required: true,
},
password: {
  type: String,
  required: true,
}
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
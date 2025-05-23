const express = require('express');
const EmployeeController = require('../controllers/employeeController');
const { authenticateJWT, requireRole } = require('../middleware/auth');
const Employee = require('../models/employee');
const jwt = require('jsonwebtoken');


const router = express.Router();
const employeeController = new EmployeeController();

const setEmployeeRoutes = (app) => {
  // Only authenticated users (admin or employee) can view employees
  router.get('/employees', authenticateJWT, (req, res) => employeeController.getEmployees(req, res));
  router.get('/employees/:id', authenticateJWT, (req, res) => employeeController.getEmployeeById(req, res));

  // Only admin can add employees
  router.post('/employees', authenticateJWT, requireRole('admin'), (req, res) => employeeController.addEmployee(req, res));
  // Only admin can update employees (uncomment and secure if needed)
  // router.put('/employees/:id', authenticateJWT, requireRole('admin'), (req, res) => employeeController.updateEmployee(req, res));

router.post('/login', (req, res) => {
  const { name, password } = req.body;
  // Use the in-memory array from EmployeeController
  const user = employeeController.employees.find(
    (e) => e.name === name && e.password === password
  );
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const payload = { id: user.id, name: user.name, role: user.role };
  const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });
  res.json({ token, user: payload });
});

  app.use('/api', router);
};




module.exports = { setEmployeeRoutes };
import express, { Application, RequestHandler } from 'express';
import EmployeeController from '../controllers/employeeController';
import { authenticateJWT, requireRole } from '../middleware/auth';
import jwt from 'jsonwebtoken';

const router = express.Router();
const employeeController = new EmployeeController();

export const setEmployeeRoutes = (app: Application) => {
  // Dummy health check route to fix Express/TypeScript overload
  router.get('/health', (req, res) => { res.send('OK'); return; });

  router.get('/employees', authenticateJWT as RequestHandler, (req, res) => { employeeController.getEmployees(req, res); });
  router.get('/employees/:id', authenticateJWT as RequestHandler, (req, res) => { employeeController.getEmployeeById(req, res); });
  router.post('/employees', authenticateJWT as RequestHandler, requireRole('admin') as RequestHandler, (req, res) => { employeeController.addEmployee(req, res); });
  // router.put('/employees/:id', authenticateJWT as RequestHandler, requireRole('admin') as RequestHandler, (req, res) => { employeeController.updateEmployee(req, res); });

  // Login route should be registered after all other routes
  router.post('/login', ((req: any, res: any) => {
    const { name, password } = req.body;
    const user = employeeController.employees.find(
      (e) => e.name === name && e.password === password
    );
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const payload = { id: user.id, name: user.name, role: user.role };
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token, user: payload });
    return;
  }) as any);

  app.use('/api', router);
};

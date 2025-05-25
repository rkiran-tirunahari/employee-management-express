interface Employee {
  id: string;
  name: string;
  age: number;
  class: string;
  subjects: string[];
  attendance: number;
  role: 'admin' | 'employee';
  password: string;
}

class EmployeeController {
  employees: Employee[];
  constructor() {
    // Admin users
    this.employees = [
      {
        id: '1',
        name: 'Alice Smith',
        age: 30,
        class: 'A',
        subjects: ['Math', 'Science'],
        attendance: 95,
        role: 'admin',
        password: 'password123', // In a real application, use hashed passwords
      },
      {
        id: '2',
        name: 'Bob Johnson',
        age: 28,
        class: 'B',
        subjects: ['English', 'History'],
        attendance: 90,
        role: 'admin',
        password: 'password123', // In a real application, use hashed passwords
      },
    ];

    // Generate 100 random employees
    const firstNames = ['John', 'Jane', 'Mike', 'Emily', 'Chris', 'Sara', 'David', 'Laura', 'Tom', 'Anna'];
    const lastNames = ['Doe', 'Brown', 'Wilson', 'Taylor', 'Lee', 'Clark', 'Walker', 'Hall', 'Young', 'King'];
    const classes = ['A', 'B', 'C', 'D'];
    const subjectsList = [
      ['Math', 'Science'],
      ['English', 'History'],
      ['Art', 'Music'],
      ['Physics', 'Chemistry'],
      ['Biology', 'Geography'],
      ['PE', 'Health'],
    ];
    function getRandomInt(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    for (let i = 3; i <= 102; i++) {
      const firstName = firstNames[getRandomInt(0, firstNames.length - 1)];
      const lastName = lastNames[getRandomInt(0, lastNames.length - 1)];
      const empClass = classes[getRandomInt(0, classes.length - 1)];
      const subjects = subjectsList[getRandomInt(0, subjectsList.length - 1)];
      const age = getRandomInt(22, 60);
      const attendance = getRandomInt(70, 100);
      this.employees.push({
        id: i.toString(),
        name: `${firstName} ${lastName}`,
        age,
        class: empClass,
        subjects,
        attendance,
        role: 'employee',
        password: 'password123', // In a real application, use hashed passwords
      });
    }
  }

  getEmployees(req: any, res: any): void {
    const { filter, sortBy, sortOrder, page = 1, pageSize = 10 } = req.query;
    let filtered = this.employees;

    if (filter) {
      filtered = filtered.filter(e => e.name.toLowerCase().includes(filter.toLowerCase()));
    }

    if (sortBy) {
      filtered = filtered.sort((a, b) => {
        const key = sortBy as keyof Employee;
        if (sortOrder === 'desc') {
          return a[key] < b[key] ? 1 : -1;
        }
        return a[key] > b[key] ? 1 : -1;
      });
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    res.json({
      employees: filtered.slice(start, end),
      total,
    });
  }

  getEmployeeById(req: any, res: any): void {
    const employee = this.employees.find(e => e.id === req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  }

  addEmployee(req: any, res: any): void {
    const newEmp = {
      id: (this.employees.length + 1).toString(),
      ...req.body,
    };
    this.employees.push(newEmp);
    res.status(201).json(newEmp);
  }

  updateEmployee(req: any, res: any): void {
    const emp = this.employees.find(e => e.id === req.params.id);
    if (!emp) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    Object.assign(emp, req.body);
    res.json(emp);
  }
}

export default EmployeeController;

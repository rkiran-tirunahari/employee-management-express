const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLSchema, GraphQLNonNull } = require('graphql');
const EmployeeController = require('../controllers/employeeController');
const employeeController = new EmployeeController();

const EmployeeType = new GraphQLObjectType({
  name: 'Employee',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    class: { type: GraphQLString },
    subjects: { type: new GraphQLList(GraphQLString) },
    attendance: { type: GraphQLInt },
  }),
});

// New: EmployeeListType for pagination and total
const EmployeeListType = new GraphQLObjectType({
  name: 'EmployeeList',
  fields: () => ({
    employees: { type: new GraphQLList(EmployeeType) },
    total: { type: GraphQLInt },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    employees: {
      type: EmployeeListType, // <-- Return the new type
      args: {
        filter: { type: GraphQLString },
        sortBy: { type: GraphQLString },
        sortOrder: { type: GraphQLString },
        page: { type: GraphQLInt },
        pageSize: { type: GraphQLInt },
      },
      resolve(parent, args) {
        // Mimic req.query for controller
        const req = { query: args };
        const res = {
          json(data) { this.data = data; },
        };
        employeeController.getEmployees(req, res);
        return res.data;
      },
    },
    employee: {
      type: EmployeeType,
      args: { id: { type: GraphQLNonNull(GraphQLString) } },
      resolve(parent, args) {
        const req = { params: { id: args.id } };
        const res = {
          status() { return this; },
          json(data) { this.data = data; },
        };
        employeeController.getEmployeeById(req, res);
        return res.data;
      },
    },
  },
});


// ...existing code...

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addEmployee: {
      type: EmployeeType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
        class: { type: GraphQLString },
        subjects: { type: new GraphQLList(GraphQLString) },
        attendance: { type: GraphQLInt },
      },
      resolve(parent, args, context) {
        if (!context.user || context.user.role !== 'admin') {
          throw new Error('Forbidden: Admins only');
        }
        const req = { body: args };
        const res = {
          status() { return this; },
          json(data) { this.data = data; },
        };
        employeeController.addEmployee(req, res);
        return res.data;
      },
    },
    updateEmployee: {
      type: EmployeeType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        class: { type: GraphQLString },
        subjects: { type: new GraphQLList(GraphQLString) },
        attendance: { type: GraphQLInt },
      },
      resolve(parent, args, context) {
        if (!context.user || context.user.role !== 'admin') {
          throw new Error('Forbidden: Admins only');
        }
        const req = { params: { id: args.id }, body: args };
        const res = {
          status() { return this; },
          json(data) { this.data = data; },
        };
        employeeController.updateEmployee(req, res);
        return res.data;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
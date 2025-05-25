import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLSchema, GraphQLNonNull } from 'graphql';
import EmployeeController from '../controllers/employeeController';
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
      type: EmployeeListType,
      args: {
        filter: { type: GraphQLString },
        sortBy: { type: GraphQLString },
        sortOrder: { type: GraphQLString },
        page: { type: GraphQLInt },
        pageSize: { type: GraphQLInt },
      },
      resolve(parent, args) {
        const req = { query: args } as any;
        const res = { json(data: any) { (this as any).data = data; } } as any;
        employeeController.getEmployees(req, res);
        return res.data;
      },
    },
    employee: {
      type: EmployeeType,
      args: { id: { type: GraphQLNonNull(GraphQLString) } },
      resolve(parent, args) {
        const req = { params: { id: args.id } } as any;
        const res = {
          status() { return this; },
          json(data: any) { (this as any).data = data; },
        } as any;
        employeeController.getEmployeeById(req, res);
        return res.data;
      },
    },
  },
});

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
        const req = { body: args } as any;
        const res = {
          status() { return this; },
          json(data: any) { (this as any).data = data; },
        } as any;
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
        const req = { params: { id: args.id }, body: args } as any;
        const res = {
          status() { return this; },
          json(data: any) { (this as any).data = data; },
        } as any;
        employeeController.updateEmployee(req, res);
        return res.data;
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export default schema;

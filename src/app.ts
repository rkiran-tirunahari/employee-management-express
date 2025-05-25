import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { setEmployeeRoutes } from './routes/employeeRoutes';
import { graphqlHTTP } from 'express-graphql';
import employeeSchema from './graphql/employeeSchema';
import { authenticateJWT } from './middleware/auth';

const app: Application = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

setEmployeeRoutes(app);

app.use(
  '/graphql',
  (req: Request, res: Response, next) => authenticateJWT(req, res, next),
  graphqlHTTP((req, res) => ({
    schema: employeeSchema,
    graphiql: true,
    context: { user: (req as any).user }
  }))
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
});

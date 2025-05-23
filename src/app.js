const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // <-- Add this line
const { setEmployeeRoutes } = require('./routes/employeeRoutes');
const { graphqlHTTP } = require('express-graphql');
const employeeSchema = require('./graphql/employeeSchema');
const { authenticateJWT } = require('./middleware/auth');


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); // <-- Add this line
app.use(bodyParser.json());

app.use(bodyParser.json());

setEmployeeRoutes(app);



app.use('/graphql', authenticateJWT, graphqlHTTP((req) => ({
  schema: employeeSchema,
  graphiql: true,
  context: { user: req.user }
})));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
});


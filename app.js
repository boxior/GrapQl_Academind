const express = require(`express`);
const bodyParser = require(`body-parser`);
const graphqlHttp = require(`express-graphql`);
const mongoose = require("mongoose");

const app = express();

const graphQlSchema = require(`./graphql/schema/index`);
const graphQlResolvers = require(`./graphql/resolvers/index`);

app.get(`/`, (req, res, next) => {
    res.send(`Hello world`);
});

app.use(bodyParser.json());

app.use(`/graphql`, graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true

}));

mongoose.connect(`mongodb+srv://boxior:wJ8xSxytsJPIXfqb@cluster0-4ziv6.mongodb.net/test?retryWrites=true`, {useNewUrlParser: true})
    .then(() => {
        app.listen(3000);
    })
    .catch((err) => {
        console.error("err", err);
    });


const express = require(`express`);
const bodyParser = require(`body-parser`);
const graphqlHttp = require(`express-graphql`)
const {buildSchema} = require(`graphql`)

const app = express();

app.get(`/`, (req, res, next) => {
    res.send(`Hello world`);
});

app.use(bodyParser.json());

app.use(`/graphql`, graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }
    
        type RootMutation {
            createEvent(name: String): String
        }
    
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return ["Some event 1", "Some event 2", "Some event 3"]
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        },
        
    },
    graphiql: true
    
}));

app.listen(3000);
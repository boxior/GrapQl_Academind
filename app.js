const express = require(`express`);
const bodyParser = require(`body-parser`);
const graphqlHttp = require(`express-graphql`);
const {buildSchema} = require(`graphql`);
const mongoose = require("mongoose");
const Event = require("./models/event");

const app = express();

app.get(`/`, (req, res, next) => {
    res.send(`Hello world`);
});

app.use(bodyParser.json());

app.use(`/graphql`, graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
    
        type RootQuery {
            events: [Event!]!
        }
    
        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }
    
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: (args) => {
           return Event.find()
                .then((events) => {
                    return events.map(event => {
                        return {
                            ...event._doc,
                            _id: event.id
                        }
                    })
                })
                .catch(err => {
                    throw err;
                })

        },
        createEvent: (args) => {
            const {title, description, price, date} = args.eventInput;
            console.error("args.eventInput", args.eventInput);
            const event = new Event({
                title,
                description,
                price: +price,
                date: new Date(date)
            });
            return event.save()
                .then(result => {
                    console.log("result", result);
                    return {...result._doc, _id: result.id}
                })
                .catch(err => {
                    console.error("err", err);
                    throw err;
                });
        },

    },
    graphiql: true

}));

mongoose.connect(`mongodb+srv://boxior:wJ8xSxytsJPIXfqb@cluster0-4ziv6.mongodb.net/test?retryWrites=true`, {useNewUrlParser: true})
    .then(() => {
        app.listen(3000);
    })
    .catch((err) => {
        console.error("err", err);
    });


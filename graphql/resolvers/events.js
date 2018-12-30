const Event = require("../../models/event");
const User = require("../../models/user");
const {transformEvent} = require("./merge");

module.exports = {
    events: async () => {
        try {
            const events = await Event.find().populate(`creator`);
            return events.map(event => {
                return transformEvent(event)
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async args => {
        const {title, description, price, date} = args.eventInput;

        const event = new Event({
            title,
            description,
            price: +price,
            date: new Date(date),
            creator: `5c27a64dde958d20c40ec1eb`
        });
        let createdEvent;

        try {
            const result = await event.save();

            createdEvent = transformEvent(result);
            const creator = await User.findById(`5c27a64dde958d20c40ec1eb`);
            if (!creator) {
                return new Error(`User not found`)
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch (err) {
            throw err;
        }
    },

};
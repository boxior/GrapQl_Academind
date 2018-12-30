const Event = require("../../models/event");
const Booking = require(`../../models/booking`);

const {transformBooking, transformEvent} = require("./merge");

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        } catch (err) {

        }
    },
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({_id: args.eventId});
        const booking = new Booking({
            user: `5c27a64dde958d20c40ec1eb`,
            event: fetchedEvent
        });
        const result = await booking.save();
        return transformBooking(result);
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate(`event`);
            const event = transformEvent(booking.event);
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } catch (err) {
            throw err;
        }
    }
};
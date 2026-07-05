import Event from "../models/Event.js";
export const createEvent = async (req, res) => {

    try {

        const event = await Event.create({

            ...req.body,

            organizer: req.user._id

        });

        res.status(201).json(event);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};
export const getEvents = async (req, res) => {

    try {

        const events = await Event.find()

            .populate("organizer", "name email");

        res.json(events);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};
export const getEvent = async (req, res) => {

    try {

        const event = await Event.findById(req.params.id)

            .populate("organizer", "name email");

        if (!event) {

            return res.status(404).json({

                message: "Event not found"

            });

        }

        res.json(event);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

export const updateEvent = async (req, res) => {

    try {

        const event = await Event.findById(req.params.id);

        if (!event) {

            return res.status(404).json({

                message: "Event not found"

            });

        }

        if (
            event.organizer.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {

            return res.status(403).json({

                message: "Access Denied"

            });

        }

        const updated = await Event.findByIdAndUpdate(

            req.params.id,

            req.body,

            { new: true }

        );

        res.json(updated);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

export const deleteEvent = async (req, res) => {

    try {

        const event = await Event.findById(req.params.id);

        if (!event) {

            return res.status(404).json({

                message: "Event not found"

            });

        }

        if (
            event.organizer.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {

            return res.status(403).json({

                message: "Access Denied"

            });

        }

        await event.deleteOne();

        res.json({

            message: "Event deleted successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};
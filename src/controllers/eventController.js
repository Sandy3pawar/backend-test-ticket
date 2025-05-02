import Event from "../models/Event.js";

// 📌 Create an Event (Admin Only)
export const createEvent = async (req, res) => {
  try {
    const { title, description, location, date, price, availableSeats, image } = req.body;

    const event = new Event({
      title,
      description,
      location,
      date,
      price,
      availableSeats,
      image,
      createdBy: req.user.id,
    });

    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 📌 Get All Events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 📌 Get Event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 📌 Update an Event (Admin Only)
export const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 📌 Delete an Event (Admin Only)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

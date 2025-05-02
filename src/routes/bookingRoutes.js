// import express from "express";
// import {
//   bookTicket,
//   getMyBookings,
//   getAllBookings,
// } from "../controllers/bookingController.js";
// import authMiddleware from "../middlewares/authMiddleware.js";

// const router = express.Router();

// // 🔹 User Routes
// router.post("/", authMiddleware, bookTicket);
// router.get("/my", authMiddleware, getMyBookings);

// // 🔹 Admin Route (View all bookings)
// router.get("/", authMiddleware, getAllBookings);

// export default router;



import express from "express";
import {
  bookTicket,
  getMyBookings,
  getAllBookings,
  sendConfirmationEmail
} from "../controllers/bookingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import stripe from "../config/stripe.js";
import Event from "../models/Event.js";

const router = express.Router();

// 🔹 User Routes
router.post("/", authMiddleware, bookTicket);
router.get("/my", authMiddleware, getMyBookings);

// 🔹 Admin Route
router.get("/", authMiddleware, getAllBookings);

// 🔹 Stripe Payment - Create Payment Intent
router.post("/create-payment-intent", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
console.log('event found :  ' ,event)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: event.price * 100, // Stripe uses cents
      currency: "usd",
      metadata: { integration_check: "accept_a_payment" },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ message: "Payment intent creation failed" });
  }
});

router.post("/sendEmail",sendConfirmationEmail)
//      async (req, res) => {

// })
export default router;
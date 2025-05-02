import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
// import stripe from "../config/stripe.js";
import nodemailer from "nodemailer";
// import nodemailer from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport';

// const nodemailer = require('nodemailer');
// const sendgridTransport = require('nodemailer-sendgrid-transport');
// import sendgridTransport from "nodemailer-sendgrid-transport"

// 📌 Book Event Ticket
// export const bookTicket = async (req, res) => {
//   try {
//     const { eventId, seatsBooked, paymentMethodId } = req.body;
//     const event = await Event.findById(eventId);

//     if (!event) return res.status(404).json({ message: "Event not found" });

//     if (event.availableSeats < seatsBooked) {
//       return res.status(400).json({ message: "Not enough seats available" });
//     }

//     const totalPrice = event.price * seatsBooked;

//     // 🔹 Create Stripe Payment Intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: totalPrice * 100, // Convert to cents
//       currency: "usd",
//       payment_method: paymentMethodId,
//       confirm: true,
//     });

//     if (!paymentIntent) {
//       return res.status(400).json({ message: "Payment failed" });
//     }

//     // 🔹 Save Booking to Database
//     const booking = new Booking({
//       user: req.user.id,
//       event: eventId,
//       seatsBooked,
//       totalPrice,
//       paymentStatus: "paid",
//       paymentIntentId: paymentIntent.id,
//     });

//     await booking.save();

//     // 🔹 Update Event Seat Count
//     event.availableSeats -= seatsBooked;
//     await event.save();

//     // 🔹 Send Confirmation Email
//     await sendConfirmationEmail(req.user.email, event.title, seatsBooked);

//     res.status(201).json({ message: "Booking successful", booking });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };



export const bookTicket = async (req, res) => {
    try {
      const { eventId, seatsBooked, paymentIntentId } = req.body;
      const event = await Event.findById(eventId);
      const user = req.user;
  
      if (!event) return res.status(404).json({ message: "Event not found" });
  
      if (event.availableSeats < seatsBooked) {
        return res.status(400).json({ message: "Not enough seats available" });
      }
  
      const totalPrice = event.price * seatsBooked;
  
      const booking = new Booking({
        user: user.id,
        event: eventId,
        seatsBooked,
        totalPrice,
        paymentStatus: "paid",
        paymentIntentId,
      });
  
      await booking.save();
  
      event.availableSeats -= seatsBooked;
      await event.save();
  
      // sendConfirmationEmail(user.email, event.title, seatsBooked);
  
      res.status(201).json({ message: "Booking successful", booking });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Booking failed", error });
      return res.json();
    }
  };

  


// 📌 Get All Bookings (User)
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("event");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 📌 Get All Bookings (Admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user event");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 📌 Send Confirmation Email
// export const sendConfirmationEmail = async (email, eventTitle, seats) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER, // Your email
//       pass: process.env.EMAIL_PASS, // Your password
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Booking Confirmation",
//     text: `Your booking for ${eventTitle} (${seats} seats) is confirmed!`,
//   };

//   await transporter.sendMail(mailOptions);
// };


// const nodemailer = require('nodemailer');
// const sendgridTransport = require('nodemailer-sendgrid-transport');

// Replace with your SendGrid API Key
// const transporter = nodemailer.createTransport(sendgridTransport({
//   auth: {
//     api_key: process.env.SENDGRID_API_KEY, // Your SendGrid API Key
//     // api_key: 11764b250be69000a680104eefdc9a6b-24bda9c7-7062a1d9
//   },
// }));

// export const sendConfirmationEmail = async (email, eventTitle, seats) => {
//   const mailOptions = {
//     from: 'psandeepenz@gmail.com', // Your verified SendGrid email
//     to: email,
//     subject: 'Booking Confirmation',
//     text: `Your booking for ${eventTitle} (${seats} seats) is confirmed!`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully');
//   } catch (error) {
//     console.info(error);
//     console.error('Error sending email:', error);
//   }
// };



// console.log(process.env.MAILGUN_API_KEY);
// const transporter = nodemailer.createTransport(mailgunTransport({
//   auth: {
//     api_key: process.env.MAILGUN_API_KEY,  // Your Mailgun API Key from environment variable
//     domain: process.env.MAILGUN_DOMAIN,    // Your Mailgun domain from environment variable
//   }
// }));

// Function to send confirmation email
export const sendConfirmationEmail = async (email, eventTitle, seats)  => {
console.log('api called');
// console.log(req.body);
// const { email, eventTitle, seats } = req.body;
if (!email || !eventTitle || !seats) {
  return res.status(400).json({ message: 'Missing required fields: email, eventTitle, or seats' });
}
  const transporter = nodemailer.createTransport(mailgunTransport({
    auth: {
      api_key: process.env.MAILGUN_API_KEY,  // Your Mailgun API Key from environment variable
      domain: process.env.MAILGUN_DOMAIN,    // Your Mailgun domain from environment variable
    }
  }));
  // console.log('transporter :-  ', transporter);

  const mailOptions = {
    from: 'psandeepenz@gmail.com',   // Your verified email in Mailgun
    to: email,
    subject: 'Booking Confirmation',
    text: `Your booking for ${eventTitle} (${seats} seats) is confirmed!`,
  };

  try {
    // Send email using the transporter
    console.log( "mailoptons:  -------",mailOptions)
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  //  return  res.status({success: true});
  return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
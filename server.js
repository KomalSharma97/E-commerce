import express from "express";
import dotenv from "dotenv";
import stripe from "stripe";
import bodyParser from "body-parser";
import mongoose from "mongoose";
// Load variables
dotenv.config();


// Start Server
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/contactDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    no: {
        type: String,
        required: true
    }
});

const Contact = mongoose.model('Contact', contactSchema);

const saveContact = (name, no) => {
    const contact = new Contact({ name, no });
    contact.save()
        .then(() => console.log('Contact saved successfully'))
        .catch(error => console.error('Error saving contact:', error));
        throw error;
};
//Home Route
app.get('/', (req, res) => {
    res.sendFile("E-com.html", { root: "public" });
});
// Success
app.get('/success', (req, res) => {
    res.sendFile("success.html", { root: "public" });
});
// Cancel
app.get('/cancel', (req, res) => {
    res.sendFile("cancel.html", { root: "public"});
});
 

//Stripe
let stripeGateway = stripe(process.env.stripe_api);
let DOMAIN = process.env.DOMAIN;

app.post("/stripe-checkout", async (req, res) => {
    const lineItems = req.body.items.map((item) => {
        const price = parseInt(item.price.replace(/[^\d.]/g, "") * 100);
        const unitAmount = Math.round(price * 100);
        console.log("item-title:", item.title);
        console.log("Product Image URL:", item.productImg);
        console.log("item-price:", item.price);
        console.log("unitAmount:", unitAmount);
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.title,
                    images: [item.productImg],
                },
                unit_amount: unitAmount,       
            },
            quantity: item.quantity,
        };
    });
    console.log("lineItems:", lineItems);

    //Create Checkout Session
    const session = await stripeGateway.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${DOMAIN}/success`,
        cancel_url: `${DOMAIN}/cancel`,
        line_items: lineItems,
        //Asking Address in Stripe Checkout Page
        billing_address_collection: "required",
    });
    res.json(session.url);
});

// Contact Route
app.post("/contact", async (req, res) => {
    const { name, number } = req.body;

    try {
        // Save contact information to the database
        await saveContact(name, number);

        // Retrieve all contacts from the database
        const contacts = await Contact.find();
        console.log("All Contacts:", contacts);

        // Respond to the client
        res.status(200).send("Contact information saved successfully");
    } catch (error) {
        console.error('Error in /contact route:', error);
        res.status(500).send("An error occurred while saving contact information");
    }
});




app.listen(3000, ()  => {
  console.log("listening on port 3000;");
});



const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const nodemailer = require("nodemailer");
const app = express();
const port = process.env.PORT || 5000;

const corsConfig = {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
app.use(express.json());

const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.ZOHO_USERNAME,
        pass: process.env.ZOHO_PASS
    }
});

const sendDriverMail = (driver) => {
    transporter.sendMail({
        from: "calciteX@pendler.co.in", // verified sender email
        to: driver.email, // recipient email
        subject: "Your Early Bird Registration successful", // Subject line
        text: "Hello world!", // plain text body
        html: `
        <h4>Hello ${driver.fullName}</h4>
        <p>Thank you for registering with Pendler as a User. This is an acknowledgment mail to notify about the details received. You will be shared with all the details periodically.</p>
        <p>Keep yourself tuned for the official release. Join us in adding impact to the Pendler community with extra loaded benefits / perks. Stay safe.</p>
        <p>Do let us know in case you need any further assistance.</p>
        <P>Regards, <br/>PendlerCommunity <br/>A Ride Sharing Platform</P>
        `, // html body
    }, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const sendUserMail = (user) => {
    transporter.sendMail({
        from: "calciteX@pendler.co.in", // verified sender email
        to: user.email, // recipient email
        subject: "Your Early Bird Registration successful", // Subject line
        text: "Hello world!", // plain text body
        html: `
        <h4>Hello ${user.fullName}</h4>
        <p>Thank you for registering with Pendler as a User. This is an acknowledgment mail to notify about the details received. You will be shared with all the details periodically.</p>
        <p>Keep yourself tuned for the official release. Join us in adding impact to the Pendler community with extra loaded benefits / perks. Stay safe.</p>
        <p>Do let us know in case you need any further assistance.</p>
        <P>Regards, <br/>PendlerCommunity <br/>A Ride Sharing Platform</P>
        `, // html body
    }, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-lkphvzo-shard-00-00.dysamrx.mongodb.net:27017,ac-lkphvzo-shard-00-01.dysamrx.mongodb.net:27017,ac-lkphvzo-shard-00-02.dysamrx.mongodb.net:27017/?ssl=true&replicaSet=atlas-11u6ye-shard-0&authSource=admin&retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const usersCollection = client.db("pendler").collection("usersCollection")
        const driversCollection = client.db("pendler").collection("driversCollection")
        const queriesCollection = client.db("pendler").collection("queriesCollection")

        app.post("/drivers", async(req, res) => {
            const driver = req.body;
            sendDriverMail(driver);
            const result = await driversCollection.insertOne(driver)
            res.send(result)
        })

        app.post("/users", async(req, res) => {
            const user = req.body;
            sendUserMail(user)
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })

        app.post("/queries", async(req, res) => {
            const queries = req.body;
            const result = await queriesCollection.insertOne(queries)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Pendler server is running");
})

app.listen(port, () => {
    console.log(`Pendler server is running on port: ${port}`);
})
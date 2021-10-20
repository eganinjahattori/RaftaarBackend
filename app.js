const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var nodemailer = require('nodemailer');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(
    "mongodb+srv://raftaaruser:eganinja2021@cluster0.f4sgh.mongodb.net/Cluster0?retryWrites=true&w=majority",
    {
        //useMongoClient: true
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    console.log("Database Connected")
);

const contactSchema = mongoose.Schema({
    Name: { type: String },
    Email: { type: String },
    Subject: { type: String },
    Message: { type: String },
});

const contactModel = mongoose.model('contact', contactSchema);

var mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'eganinjahattori@gmail.com',
        pass: 'Gmail@2021'
    }
});

app.get('/backend', async (req, res) => {
    return res.send("Backend Server");
});

app.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        console.log(name, email, subject, message);

        var newContact = new contactModel({ Name: name, Email: email, Subject: subject, Message: message });
        newContact.save((err, record) => {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log(record);
        });

        var mailOptions = {
            from: 'eganinjahattori@gmail.com',
            to: 'rajatis1999@gmail.com',
            subject: 'New Query Received in Contact Us Form (www.raftaarlounge.com)',
            text: `Name: ${name} \nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
        };

        mail.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        }); 

        return res.status(200).send("We received your data");
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("There was some error in the server. Please contact your administrator.");
    }
});

app.listen(4040, () => {
    console.log("Server is live");
});
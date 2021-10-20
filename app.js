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

const bookTableSchema = mongoose.Schema({
    Name: { type: String },
    Email: { type: String },
    Phone: { type: Number },
    Date: { type: String },
    Time: { type: String },
    People: { type: Number },
    Message: { type: String },
});

const bookTableModel = mongoose.model('table', bookTableSchema);

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
            to: ['rajat.program@gmail.com', 'Raftaarloungedelhi@gmail.com'],
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

app.post('/bookTable', async (req, res) => {
    try {
        const { name, email, phone, date, time, people, message } = req.body;
        console.log(name, email, phone, date, time, people, message);

        var newTable = new bookTableModel({
            Name: name, Email: email, Phone: phone,
            Date: date,
            Time: time,
            People: people,
            Message: message
        });
        newTable.save((err, record) => {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log(record);
        });

        var mailOptions = {
            from: 'eganinjahattori@gmail.com',
            to: ['rajat.program@gmail.com', 'Raftaarloungedelhi@gmail.com'],
            subject: 'New Book Received in Book Table Form (www.raftaarlounge.com)',
            text: `Name: ${name} \nEmail: ${email}\nPhone: ${phone}\nDate: ${date}\nTime: ${time}\nPeople: ${people}\nMessage: ${message}`
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

app.get('/all/query', async(req, res) => {
    contactModel.find({}, function (err, records) {
        if (err) {
            console.log(err);
            return res.status(500).send("Some error occured. Please contact your administrator.");
        } else {
            return res.status(200).send({data: records});
        }
    })
});

app.get('/all/booking', async(req, res) => {
    bookTableModel.find({}, function (err, records) {
        if (err) {
            console.log(err);
            return res.status(500).send("Some error occured. Please contact your administrator.");
        } else {
            return res.status(200).send({data: records});
        }
    })
});

app.listen(process.env.PORT || 4040, () => {
    console.log("Server is live");
});
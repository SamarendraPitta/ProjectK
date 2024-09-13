const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use(cors());

app.use(cors({
    origin: 'http://127.0.0.1:5500/',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

async function connectToDatabase() {
    try {
        const pool = await mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'Samprojectk@@',
            database: 'projectkdb'
        });
        console.log("Connected to database");
        return pool;
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
}

app.post('/contactpagebooking', async (req, res) => {
    const formData = req.body;

    try {
        const pool = await connectToDatabase();
        if (!pool) {
            throw new Error("Failed to connect to the database");
        }
        var tablename = 'contactformbooking';
        //await sendEmail(formData, tablename);
        await insertFormData(formData, tablename, pool);
        res.status(200).json({ success: true, message: 'Data inserted and email sent successfully' });
        pool.end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/mainformdata', async (req, res) => {
    const mainformData = req.body;
    try {
        const pool = await connectToDatabase();
        if (!pool) {
            throw new Error("Failed to connect to the database");
        }
        var tablename = 'mainformcustomerdetails';
        //await sendEmail(mainformData, tablename);
        await insertFormData(mainformData, tablename, pool);
        res.status(200).json({ success: true, message: 'Data inserted and email sent successfully' });
        pool.end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/submitmodalform', async (req, res) => {
    console.log("form data received", req.body);
    const modalformdata = req.body;
    try {
        const pool = await connectToDatabase();
        if (!pool) {
            throw new Error("Failed to connect to the database");
        }
        var tablename = 'customer_details_modal';
        //await sendEmail(modalformdata, tablename);
        await insertFormData(modalformdata, tablename, pool);
        res.status(200).json({ success: true, message: 'Data inserted and email sent successfully' });
        pool.end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

async function sendEmail(formData, tablename) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'samarendrayadav5@gmail.com',
            pass: ''
        }
    });

    const message = {
        from: 'samarendrayadav5@gmail.com',
        to: 'samarendra.pitta99@gmail.com',
        subject: 'Booking' + tablename,
        text: `Form data:\n${JSON.stringify(formData, null, 2)}`
    };

    await transporter.sendMail(message, function (err, res) {
        if (err) {
            console.log("error occured while sending mail", err);
        }
    });
    console.log('Email sent successfully', res);
}

async function insertFormData(formData, tablename, pool) {
    if (!pool) {
        throw new Error("Failed to connect to the database");
    }
    const currentDate = new Date()
    const isCustomerAlreadyPresent = await checkingCustomerAlreadyPresent(formData.name, formData.phonenumber, pool);


    if (isCustomerAlreadyPresent) {
        const insertdata = insertdataintotables(formData, tablename)
        return;
    } else {
        const insertQueryCustomerDB = 'INSERT INTO customerdb (Name, Phonenumber, Email, Date) VALUES (?, ?, ?, ?)';
        await pool.query(insertQueryCustomerDB, [formData.name, formData.phonenumber, formData.email, currentDate], (err, results) => {
            if (err) {
                console.error('Error inserting data into customerdb:', err);
                return;
            }
            console.log('Data inserted into customerdb successfully');
        });
        insertdataintotables(formData, tablename)

    }
}

async function insertdataintotables(formData, tablename) {

    const pool = await connectToDatabase();
    if (!pool) {
        throw new Error("Failed to connect to the database");
    }
    const currentDate = new Date()

    if (tablename == 'mainformcustomerdetails') {
        console.log("enteredddddddddddddddddddddddddddddddddddddd")
        const insertQuery = 'INSERT INTO mainformcustomerdetails (Name, Phonenumber, Dojdate, Dropdate, Cartype, Passenger_count, Email, Traveledbefore, Message, Date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await pool.query(insertQuery, [formData.name, formData.phonenumber, formData.dojdate, formData.dropdate, formData.cartype, formData.passenger_count, formData.email, formData.check, formData.message, currentDate], (err, results) => {
            if (err) {
                console.error('Error inserting data into Mainformcustomerdetail:', err);
                return;
            }
            console.log('Data inserted into Mainformcustomerdetail successfully');
        });
    }
    else if (tablename === 'contactformbooking') {
        const insertQuery = 'INSERT INTO contactformbooking (Name, Phonenumber, Email, Message, Date) VALUES (?, ?, ?, ?, ?)';
        await pool.query(insertQuery, [formData.name, formData.phonenumber, formData.email, formData.comment, currentDate], (err, results) => {
            if (err) {
                console.error('Error inserting data into Contactformbooking:', err);
                return;
            }
            console.log('Data inserted into Contactformbooking successfully');
        });
    }
    else {
        const insertQuery = 'INSERT INTO customer_details_modal (Name, Phonenumber, Dojdate, Dropdate, Cartype, Passenger_count, Email, Pickup_location, Dropoff_location, Need_accommodation, Date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await pool.query(insertQuery, [formData.name, formData.phonenumber, formData.dojdate, formData.dropdate,
        formData.car_type, formData.passenger_count, formData.email, formData.pickup_location, formData.dropoff_location, formData.need_accommodation, currentDate], (err, results) => {
            if (err) {
                console.error('Error inserting data into customer_details_modal:', err);
                return;
            }
            console.log('Data inserted into customer_details_modal successfully');
        });
    }
}

async function checkingCustomerAlreadyPresent(name, phonenumber, pool) {

    if (!pool) {
        throw new Error("Failed to connect to the database");
    }
    const query = 'SELECT * FROM customerdb WHERE name = ? or phonenumber = ?';
    try {
        const [rows, fields] = await pool.execute(query, [name || null, phonenumber || null]);
        return rows.length > 0;
    } catch (error) {
        console.error("Error checking customer presence:", error);
        return false;
    }
}


// Start the server
const port = process.env.PORT || 5500;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



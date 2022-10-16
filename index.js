const express = require('express')
const mongoose = require('mongoose')
const moment = require('moment')
const session = require('express-session')
const nodemailer = require('nodemailer');
const api = require('./api')
const User = require("./user")
const path = require('path')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 8888

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbName = process.env.DB_NAME;
const mongoURI = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.cvhon.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.connect(mongoURI).then(() => {
  console.log('Connected to MongoDB')
}).catch(err => console.log(err))


app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  }
))
app.use('/api', api)

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Website running at port ${port}`)
})


async function main() {
  // const transporter = nodemailer.createTransport({
  //   host: 'smtp.gmail.com',
  //   port: 587,
  //   auth: {
  //     user: process.env.GMAIL_EMAIL,
  //     pass: process.env.GMAIL_PASS,
  //   },
  // });transporter.verify().then(console.log).catch(console.error);

  // transporter.sendMail({
  //   from: `"Sports Buddy" <${process.env.GMAIL_EMAIL}>`, // sender address
  //   to: "alam.sami.md@gmail.com", // list of receivers
  //   subject: "Sports buddy ✔", // Subject line
  //   text: "There is a new article. It's about sending emails, check it out!", // plain text body
  //   html: "<b>There is a new article. It's about sending emails, check it out!</b>", // html body
  // }).then(info => {
  //   console.log({info});
  // }).catch(console.error);


}
// main()

console.log(moment().hour())
console.log(moment().isoWeekday())
const User = require('./user')
const bcrypt = require('bcrypt')

async function registerUser(req, res) {
  const firstname = req.body.firstname
  const lastname = req.body.lastname
  const email = req.body.email
  const password = req.body.password
  const university = req.body.university
  const hashedPassword = await bcrypt.hash(password, 5)
  
  if(await User.exists({ email: email }) !== null) {
    res.json({ success: false, message: "The email is already registered." })
    return ;
  }
  const newUser = new User({
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: hashedPassword,
    university: university
  })

  newUser.save().then(() => {
    req.session.user = newUser
    res.json({ success: true, message: "User successfully created." })
  })
}

async function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({
    email: email  
  })
  if(user && await bcrypt.compare(password, user.password)) {
    req.session.user = user
    res.json({ success: true, message: "User logged in." })
  } else {
    req.session.user = null
    res.json({ success: false, message: "Email and password doesn't match."})
  }
}

async function logoutUser(req, res) {
  req.session.user = null
  res.json({ success: true, message: "User logged out" })
}

async function ensureLoggedin (req, res, next) {
  if(req.session.user) {
    next()
  } else {
    res.json({ success: false, message: "You need to be logged in." })
  }
}

module.exports = { registerUser, loginUser, logoutUser, ensureLoggedin }

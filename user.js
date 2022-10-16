const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  password: { type: String },
  university: { type: String },
  sports: {type: Array, default: []},
  fields: {type: Array, default: []}, 
  playnow: {type: Boolean, default: false},
  times: {type: Array, default: []},
})

module.exports = mongoose.model("user", UserSchema)

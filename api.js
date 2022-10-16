const router = require('express').Router()
const moment = require('moment')
const User= require('./user')
const { registerUser, loginUser, ensureLoggedin, logoutUser } = require('./auth')
const universityDetails = [
  {
    "university": "Harvard University",
    "fields": ["Dillon Fieldhouse", "Jordan Field", "Lavietes Pavilion", "McCurdy Outdoor Track", "Roberto A. Mignone Field", "Ohiri Field"]
  }, 
  {
      "university": "MIT",
      "fields": ["Rockwell Cage", "Jack Barry Field", "Briggs Field", "duPont Athletic Center", "Al & Barrie Zesiger Sports & Fitness Center"]
  },
  {
      "university": "Drexel University",
      "fields": ["Vidas Athletic Complex", "Buckley Green", "Maguire Field", "Astroturf field"]    
  },
  {
      "university": "Villanova University",
      "fields": ["The Jake Nevin Field House", "Villanova Stadium", "Higgins Soccer Complex", "Butler Annex", "Jake Nevin Field House"]    
  }
]
const sports = ['Football', 'Volleyball', 'Basketball', 'Soccer']
const threshold = 2


router.get('/demo', (req, res) => {
  return res.json({
    success: true,
    message: "This is a JSON object"
  })
})

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logoutUser)

router.get('/whoami',ensureLoggedin, async(req, res) => {
    const email = req.session.user.email;
    const user = await User.findOne({
      email: email  
    })
    const userData = {
      success: true,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      university: user.university,
      fields: user.fields,
      sports: user.sports,
      times: user.times
    }
    res.json(userData)
})

router.post('/playnow',ensureLoggedin, async (req, res)=>{
   
  const email = req.session.user.email;
  const sports = req.body.sports;
  const fields= req.body.fields;
  const user = await User.findOne({
    email: email  
  })
  user.playnow= true;
  user.sports= sports;
  user.fields= fields;
  await user.save();
  res.json({ success: true, message: "Sports and Fields are modified successfully"});
})

router.post('/playlater',ensureLoggedin, async (req, res)=>{
   
  const email = req.session.user.email;
  const sports = req.body.sports;
  const fields= req.body.fields;
  const times= req.body.times;
  const user = await User.findOne({
    email: email  
  })
  user.playnow= false;
  user.sports= sports;
  user.fields= fields;
  user.times= times;
  await user.save();
  res.json({ success: true, message: "Sports and Fields are modified successfully"});
})

router.get('/getuniversities', (req, res) => {
  res.json(universityDetails.map(obj => obj.university))
})

router.post('/getuniversitydetails', (req, res) => {
  const university = req.body.university;
  const cands = universityDetails.filter(obj => obj.university === university)
  console.log(university)
  if(cands.length > 0) {
    res.json(cands[0])
  } else {
    res.json({ university: "", fields: [] })
  }
})

async function getTeams(req) {
  const user = await User.findOne({ email: req.session.user.email })
  const users = await User.find({ university: user.university })
  const result = []
  for(let i = 0; i < 7*24; i++) {
    const teams = []
    for(let sport of user.sports) {
      for(let field of user.fields) {
        const team = []
        for(let other of users) {
          if(!other.times.some(item => item === i)) continue;
          if(other.fields.some(item => item === field) && 
             other.sports.some(item => item === sport)) {
            team.push({ 
              firstname: other.firstname,
              lastname: other.lastname,
              email: other.email 
            })
          }
        }
        if(team.length >= threshold) {
          teams.push({
            sport: sport,
            field: field,
            team: team
          })
        }
      }
    }
    result.push(teams)
  }
  return result
}

router.get('/getteams', ensureLoggedin, async (req, res) => {
  res.json(await getTeams(req))
})

router.get('/getrowmajor', (req, res) => {
  const day = moment().isoWeekday() - 1
  const hour = moment().hour()
  const ind = 24 * day + hour
  res.json(ind)
})

router.get('/getcurrent', ensureLoggedin, async (req, res) => {
  const teams = await getTeams(req)
  const day = moment().isoWeekday() - 1
  const hour = moment().hour()
  const ind = 24 * day + hour
  return res.json(teams[ind])
})

module.exports = router

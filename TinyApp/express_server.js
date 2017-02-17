var express = require('express');

var app = express();

var PORT = process.env.PORT || 8080;

var cookieParser = require('cookie-parser')

app.set('view engine', 'ejs');

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "lucy3d": "http://www.lucia3d.com"
};
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

app.get("/urls", (req, res) => {
  console.log('USER', users[req.cookies.userId])
  console.log('COOKIES', users[req.cookies])
  let templateVars = {
    urls: urlDatabase,
    user: users[req.cookies.userId]
// set in register
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL:  urlDatabase[req.params.id],
    user: users[req.cookies.userId]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  console.log(req.cookies.userId);
  let templateVars = {
    shortURL: req.params.id,
    longURL:  urlDatabase[req.params.id],
    user: users[req.cookies.userId]
  };
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
 res.render("urls_register");
});

app.get("/login", (req, res) => {

 res.render("urls_login");
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  var shortID = generateRandomString();
  urlDatabase[shortID] = req.bodyURL;
  console.log(urlDatabase);
  res.send("Alright!");
});


app.post('/login', (req, res)=> {
  var random = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;

  // Deal with existing email
  for (let k in users) {
    if (users[k].email === email && users[k].password === password){
      // res.status(400).send("This email already exists");
      res.cookie('userId', req.body.userId);
      return res.redirect("/");
    }
  };

  return res.status(403).send('Invalid email or password');
});

app.post("/urls/:id/delete", (req,res) =>{
  delete urlDatabase[req.params.id]
  res.redirect("/urls")
})

app.post("/urls/:id", (req,res) =>{
  urlDatabase[req.params.id] = req.body.newLong;
  res.redirect('/urls')
})

app.post('/logout', (req, res)=> {
  res.clearCookie('userId', req.body.userId);
  res.redirect("/");
})

app.get("/u/:shortURL", (req, res) => {
 let longURL = urlDatabase["longURL"];
 res.redirect(longURL);
});

app.post("/register",(req,res) => {
  // Deal with empty form
  var random = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password){
    res.status(400).send("Use a valid email and/or password");
    return;
  };
  // Deal with existing email
  for(let k in users){
    if (users[k].email === email){
      res.status(400).send("This email already exists");
      return;
    }
    console.log(users);
  };

  users[random] = {
    id: random,
    email:email,
    password:password
  }
  // If we're here, we have what we need!
  res.cookie('userId', random)
  res.redirect("/urls")
});

app.get("/", (req, res) => {
  res.end("Hello!");
  // Change this to rdirect to /urls
});

const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
function generateRandomString() {
  let empStr = "";
  for (let i = 0; i < 6; i++){
    let random = Math.floor(Math.random() * characters.length)
    empStr += characters[random];
  }

  return empStr;
}
generateRandomString();


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

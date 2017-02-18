var express = require('express');

var app = express();

var PORT = process.env.PORT || 8080;

var cookieParser = require('cookie-session')

app.set('view engine', 'ejs');

const bcrypt = require('bcrypt');

var urlDatabase = {
  "lucy3d": {
    longURL: "http://www.lucia3d.com",
    userID: "userRandomID"
  },
  "b2xVn2": {
    longURL: "http://www.Hello.com",
    userID: "user2RandomID"
  },
};


const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "xxx"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "123"
  }
}

function urlsForUser(id){
  userUrls = {}
for (shortURL in urlDatabase){
  if( id === urlDatabase[shortURL].userID){
    userUrls[shortURL] = urlDatabase[shortURL]
  }
}
return userUrls;
}
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: [/* secret keys */],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlsForUser(req.cookies.userId),
    user: users[req.cookies.userId]
// set in register
  };
res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {

  if (req.cookies['userID']){
    let templateVars = {
      user: users[req.cookies.userId]
    };
    res.render("urls_new", templateVars);
  }

});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
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
  urlDatabase[shortID] = {
      key: req.bodyURL,  // LONG URL
      usersID:users[req.cookies.userId]
  }
  console.log(urlDatabase);
  res.send("Alright!");
});

app.post('/login', (req, res)=> {

  let email = req.body.email;
  let password = req.body.password;
  const hashed_password = bcrypt.hashSync(password, 10)
  // Deal with existing email
  const match = bcrypt.hashSync(password, users[userID].password);
 for (let k in users) {
    if (users[k].email === req.body.email &&(match === true)){
    res.cookie('userId', k);
    return res.redirect("/urls");
  } console.log()
  };

  return res.status(403).send('Invalid email or password');
});

app.post("/urls/:id/delete", (req, res) =>{
  delete urlDatabase[req.params.id];
    res.redirect('/urls');
    console.log("Hi");
})


app.post("/urls/", (req,res) =>{
  const user = users[req.cookies.userId];
  const urlEntry = urlDatabase[req.params.id];

  if (user.id === urlEntry.userID) {
  }
  res.redirect('/urls');
})

app.post('/logout', (req, res)=> {
  res.clearCookie('userId', req.body.userId);
  res.redirect("/");
})

app.get("/u/:shortURL", (req, res) => {
 let longURL = urlDatabase[shortURL].longURL;
 res.redirect(longURL);
});

app.post("/register",(req,res) => {
  var random = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;
  const hashed_password = bcrypt.hashSync(password, 10);
  if (!email || !hashed_password){
    res.status(400).send("Use a valid email and/or password");
    return;
  };
  // Deal with existing email
  for(let k in users){
    if (users[k].email === email){
      res.status(400).send("This email already exists");
      return;
    }
    console.log(hashed_password);
  };
  users[random] = {
    id: random,
    email:email,
    password:password
  }
  res.cookie('userId', random)
  console.log(hashed_password);
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

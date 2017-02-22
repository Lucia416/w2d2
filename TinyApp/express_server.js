const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

}))

const checkUserExist = function(users, fullEmail){
  for (user in users){
    if (users[user].email === fullEmail) {
      return true;
    }
  }
  return false;
}

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

function urlsForUser(id) {
  const userUrls = {}
  for (shortURL in urlDatabase){
    if( id === urlDatabase[shortURL].userID){
      return userUrls[shortURL] = urlDatabase[shortURL]
    }
  }
  return userUrls;
}

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

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlsForUser(req.session.userId),
    user: users[req.session.userId]
  };
   if(!req.session.userId){
     return res.direct('/login');
   }else{
  res.render("urls_index", templateVars);
}
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.session.userId]
  };
  if (req.session.userId){
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  } return res.status(403).send
});

app.post("/urls", (req, res) => {
  let shortID = generateRandomString();
  urlDatabase[shortID] = {
      longURL: req.body.longURL,
      userID: req.session.userId
  }
    if (!req.body.longURL){
      res.status(400).send("No URL submitted")
    } else{
    res.redirect("/urls"+"/"+shortID)
  }
});


app.get("/urls/:id", (req, res) => {
  let log = req.session.userId
  let data = urlDatabase[req.params.id]
   if((!data)|| (!log)) {
    res.status(404).send("Please enter a valid entry!")
  } else{
    let templateVars = {
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id].longURL,
      user: users[req.session.userId]
    };
  res.render("urls_show", templateVars);
 }
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
    res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id].longURL= req.body.newLong;
    res.redirect(`/urls/${req.params.id}`)
});

app.get("/", (req, res) => {
if(!req.session.userId){
  res.redirect("/login")
  } else {
    res.redirect("/urls");
  }
});

app.get("/urls.json", (req, res) => {
 res.json(urlDatabase);
});

app.get("/u/:shortURL", (req, res) => {
  if(!req.params.shortURL){
    res.redirect("/urls");
  } else {
    let longURL = urlDatabase[req.params.shortURL].longURL;
      res.redirect(longURL);
 }
});


 app.post("/urls/:id/update", (req, res) => {
  //  let data = urlDatabase[req.params.id]
  //  let longURL = req.body.longURL;
  //  urlDatabase[req.params.id].longURL = longURL;
  res.redirect("/urls");
 });

app.get("/login", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.session.userId]
  };
  if (req.session.userId){
 res.render("urls_index", templateVars);
 } else {
    res.render("urls_login");
 }
});

app.post('/login', (req, res)=> {

  let email = req.body.email;
  let password = req.body.password;
  if(email && password) {
    const hashed_password = bcrypt.hashSync(password, 10)
     for (var userID in users) {
       const match = bcrypt.compareSync(password, users[userID].password);
        if (users[userID].email === req.body.email &&(match === true)){
          req.session.userId = userID;
            return res.redirect("/urls");
        }
      };
  }
  return res.status(403).send('Invalid email or password');
});

app.post('/logout', (req, res)=> {
  req.session = null;
  res.redirect("/urls");
})

app.get("/register", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.session.userId]
  }

  if(req.session.userId){
    res.redirect("/urls", templateVars);
  }else{
    res.render("urls_register");
 }
});

app.post("/register",(req,res) => {
  var userID = generateRandomString();
  let email = req.body.email;
  const password = req.body.password;
  if (!email || !password){
    return res.status(400).send("Use a valid email and/or password");
  };
  const hashed_password = bcrypt.hashSync(password, 10);
  if(checkUserExist(users,req.body.email)){
    res.status(400).send("This email already exists");
  }

  users[userID] = {
    id: userID,
    email:req.body.email,
    password:hashed_password
  }
  req.session.userId = userID;
  console.log(hashed_password);
  res.redirect("/urls")
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

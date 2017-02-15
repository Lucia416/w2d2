// server.js
// load the things we need
var express = require('express');
var app = express();
var PORT = process.env.PORT || 8080;
var cookieParser = require('cookie-parser')
// set the view engine to ejs
app.set('view engine', 'ejs');

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "lucy3d": "http://www.lucia3d.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies.username };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL:  urlDatabase[req.params.id],
    username: req.cookies.username
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  var shortID = generateRandomString();
  urlDatabase[shortID] = req.bodyURL;
  console.log(urlDatabase);
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.post('/login', (req, res)=> {
  res.cookie('username',req.body.username);
  res.redirect("/");
})
//app.post("/urls")
app.post("/urls/:id/delete", (req,res) =>{
  delete urlDatabase[req.params.id]
  res.redirect("/urls")
})

app.post("/urls/:id", (req,res) =>{
  urlDatabase[req.params.id] = req.body.newLong;
  res.redirect('/urls')
})
app.post('/logout', (req, res)=> {
res.clearCookie('username', req.body.username);
  res.redirect("/");
})
// app.get("/urls/:id", (req,res) =>{
// //urlDatabase[req.body.newLong] = req.params.newLong;
//
// res.redirect('/urls')
// })

app.get("/u/:shortURL", (req, res) => {
 let longURL = urlDatabase["longURL"];
 res.redirect(longURL);
});
app.get("/", (req, res) => {
  res.end("Hello!");
});

const characters = "0123456789abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXY"
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

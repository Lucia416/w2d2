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

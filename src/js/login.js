const { ipcRenderer } = require("electron");
import {getDB, error, unError, hide, show} from "./utility.js";

const uname = document.querySelector("#name");
const pass = document.querySelector("#pass");
const spass = document.querySelector("#spass");
const login = document.querySelector("#login");
const showPass = document.querySelector("#showpass");
const message = document.querySelector("#message");

uname.focus();

uname.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter" && ev.target.value.length >= 4) pass.focus();
});
uname.addEventListener("blur", (ev) => {
  ev.target.value.length >= 4 && unError(ev.target);
});


pass.addEventListener("keyup", (ev) => {
    if (ev.key === "Enter" && ev.target.value.length >= 4) login.focus();
});
pass.addEventListener("blur", (ev) => {
  ev.target.value.length >= 4 && unError(ev.target);
});

showPass.addEventListener("change", () => {
  spass.value = pass.value;

  if (showPass.checked) {
    hide(pass);
    show(spass);
  } 
  
  else {
    hide(spass);
    show(pass);
  }
});

login.addEventListener("click", () => {
  const user_name = uname.value;
  const password = pass.value;

  if(user_name.length < 4) {
    uname.classList.add("error");
    uname.focus();
    return;
  }

  if(password.length < 4) {
    pass.classList.add("error");
    pass.focus();
    return;
  }

  let db = getDB();
  let allUsers = db.prepare("select * from users").all();

  let has_user = false;
  let user_id = -1;
  let is_admin = false;

  allUsers.forEach(user => {
    if(user.name === user_name && user.password === password) {
      has_user = true; 
      user_id = user.id;
      is_admin = user.is_admin;
    }
  });

  if(has_user) {
    hide(message);

    let {ipcRenderer} = require("electron");
    
    try { 
      db.prepare("update active_user set user_id=?, is_admin=? where id=?").run(user_id, is_admin, 1);
      db.close();
    }

    catch(e) {
      db.prepare("insert into active_user(id, user_id, is_admin) values(?, ?, ?)").run(1, user_id, is_admin);
      db.close();
    }

    ipcRenderer.send("open:pon");
    window.close();
  } else {
    show(message);
    db.close();
  }
});

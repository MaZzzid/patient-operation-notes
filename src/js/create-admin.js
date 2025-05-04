import {show, hide, error, unError, insert } from "./utility.js";

const unameEle = document.querySelector("#name");
const passEle = document.querySelector("#pass");
const spassEle = document.querySelector("#spass");
const rpassEle = document.querySelector("#r-pass");
const srpassEle = document.querySelector("#sr-pass");
const createEle = document.querySelector("#create");
const showPasswordEle = document.querySelector("#show-password");

unameEle.focus();

unameEle.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter" && ev.target.value.length >= 4) 
    passEle.focus();
});

unameEle.addEventListener("blur", (ev) => {
  if(ev.target.value.length >= 4) unError(unameEle);
})

passEle.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter" && ev.target.value.length >= 4) 
    rpassEle.focus();
});

passEle.addEventListener("blur", (ev) => {
  if(ev.target.value.length >= 4) unError(passEle);
});

rpassEle.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter" && ev.target.value === passEle.value) 
    createEle.focus();
});

rpassEle.addEventListener("blur", (ev) => {
  if(ev.target.value.length >= 4 && ev.target.value === passEle.value) unError(rpassEle);
});

showPasswordEle.addEventListener("change", () => {
  if (showPasswordEle.checked) {
    hide(passEle);
    hide(rpassEle);
    show(spassEle)
    show(srpassEle)

    spassEle.value = passEle.value;
    srpassEle.value = rpassEle.value
  } else {
    hide(spassEle);
    hide(srpassEle);
    show(passEle);
    show(rpassEle);
  }
});

createEle.addEventListener("click", () => {

  if(showPasswordEle.checked) {
    showPasswordEle.checked = "";
    hide(spassEle);
    hide(srpassEle);
    show(passEle);
    show(rpassEle);
  }

  let username = unameEle.value;
  let password = passEle.value;
  let r_prasswor = rpassEle.value;

  if(username.length < 4) {
    error(unameEle);
    unameEle.title = "At least 4 character";
    unameEle.focus();
    return;
  }

  if(password.length < 4) {
    error(passEle);
    passEle.title = "At least 4 character";
    passEle.focus();
    return;
  }

  if(r_prasswor.length < 4) {
    error(rpassEle);
    rpassEle.title = "At least 4 character"
    rpassEle.focus();
    return;
  }

  if(password !== r_prasswor) {
    error(rpassEle);
    rpassEle.title = "Pasword does not match";
    rpassEle.focus();
    return;
  }

  insert("users", ["name", "password", "is_admin"], [username.trim(), password.trim(), 1]);
  
  let {ipcRenderer} = require("electron");
  ipcRenderer.sendSync("open:relunch");
});

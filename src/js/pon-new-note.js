const newNoteNav = document.querySelector(".navitem[data-navitem=new-note]");

const newNote = document.querySelector("#new-note");
const dateEle = newNote.querySelector("#new-note-date");
const nameEle = newNote.querySelector("#new-note-name");
const sexEle = newNote.querySelector("#new-note-sex");
const ageEle = newNote.querySelector("#new-note-age");
const bedEle = newNote.querySelector("#new-note-bed");
const addressEle = newNote.querySelector("#new-note-address");
const gurdianEle = newNote.querySelector("#new-note-gurdian");
const mobileEle = newNote.querySelector("#new-note-mobile");
const surgeonEle = newNote.querySelector("#new-note-surgeon");
const asstSurgeonEle = newNote.querySelector("#new-note-asst-surgeon");
const anesEle = newNote.querySelector("#new-note-anes");
const indicationEle = newNote.querySelector("#new-note-indication");
const procedureEle = newNote.querySelector("#new-note-procedure");
const remarkEle = newNote.querySelector("#new-note-remark");
const contractEle = newNote.querySelector("#new-note-contract");
const paidEle = newNote.querySelector("#new-note-paid");
const dueEle = newNote.querySelector("#new-note-due");
const saveEle = newNote.querySelector("#new-note-save");

bedEle.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter") ageEle.focus();
});

ageEle.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter") sexEle.focus();
});


nameEle.addEventListener("keyup", (ev) => {
  if (ev.target.value.length > 0 && ev.key === "Enter") {
    ev.target.classList.remove("error");
    mobileEle.focus();
  }
});

nameEle.addEventListener("blur", (ev) => {
  if (ev.target.value.length > 0) nameEle.classList.remove("error");
});

mobileEle.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter") gurdianEle.focus();
});


gurdianEle.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter") addressEle.focus();
});

addressEle.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter") surgeonEle.focus();
});

indicationEle.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter") procedureEle.focus();
});

procedureEle.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter") remarkEle.focus();
});

remarkEle.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter") contractEle.focus();
});

contractEle.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter") paidEle.focus();
});

paidEle.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter") dueEle.focus();
});

dueEle.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter") saveEle.focus();
});

contractEle.addEventListener("input", () => {
  let contract = Number(contractEle.value);
  let paid = Number(paidEle.value);
  dueEle.value = contract - paid;
});

paidEle.addEventListener("input", () => {
  let contract = Number(contractEle.value);
  let paid = Number(paidEle.value);
  dueEle.value = contract - paid;
});

dueEle.addEventListener("input", () => {
  let contract = Number(contractEle.value);
  let due = Number(dueEle.value);
  paidEle.value = contract - due;
});

saveEle.addEventListener("click", () => {
  if (nameEle.value.length === 0) {
    nameEle.focus();
    nameEle.classList.add("error");
    return;
  }

  let date = dateEle.value || new Date().toISOString().slice(0, 10);
  let bed = bedEle.value.trim() || "";
  let name = nameEle.value.trim();
  let sex = sexEle.value;
  let age = ageEle.value.trim() || "";
  let address = addressEle.value.trim() || "";
  let mobile = mobileEle.value.trim() || "";
  let gurdian = gurdianEle.value.trim() || "";
  let surgeon = surgeonEle.value.trim() || "";
  let asstSurgeon = asstSurgeonEle.value.trim() || "";
  let anes = anesEle.value.trim() || "";
  let indication = indicationEle.value.trim() || "";
  let procedure = procedureEle.value.trim() || "";
  let remark = remarkEle.value.trim() || "";
  let contract = Number(contractEle.value).toFixed(2).trim() || "";
  let paid = Number(paidEle.value).toFixed(2).trim() || "";
  let due = Number(dueEle.value).toFixed(2).trim() || "";

  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync("database.db");

  db.prepare(`insert into patients('date', 'name', 'sex', 'age', 'bed', 'address', 'mobile', 'gurdian', 'surgeon', 'asst_surgeon', 'anes', 'indication', 'procedure', 'remark', 'contract', 'paid', 'due') values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(date, name, sex, age, bed, address, mobile, gurdian, surgeon, asstSurgeon, anes, indication, procedure, remark, Number(contract), Number(paid), Number(due));

  db.close();

  nameEle.value = "";
  ageEle.value = "";
  bedEle.value = "";
  gurdianEle.value = "";
  addressEle.value = "";
  mobileEle.value = "";
  indicationEle.value = "";
  procedureEle.value = "";
  remarkEle.value = "";
  contractEle.value = "";
  paidEle.value = "";
  dueEle.value = "";
  nameEle.classList.remove("error");

  let div = document.createElement("div");
  let new_note = document.querySelector(".new-note")
  new_note.append(div);
  div.innerHTML = `
    <svg width="70" height="70" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
  <circle cx="26" cy="26" r="25" fill="#5D29A0" stroke="#5D29A0" stroke-width="2" />
  <path fill="none" stroke="#FFFFFF" stroke-width="4" d="M14 27 l7 7 l17 -17" stroke-linecap="round"
    stroke-linejoin="round">
    <animate attributeName="stroke-dasharray" from="0,50" to="50,0" dur="0.5s" fill="freeze" />
  </path>
</svg>
  `;

  div.classList.add("save-animation");
  div.classList.add("show");

  setTimeout(() => {
    new_note.removeChild(div);
    nameEle.focus();
  }, 700);
});

function update(e) {
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync("database.db");
  let doctores = db.prepare("select * from doctors").all();
  let doctorList = "";

  doctores.forEach(doctor => {
    doctorList += `<option value="${doctor.name}">${doctor.name}</option>`;
  });

  surgeonEle.innerHTML = doctorList;
  asstSurgeonEle.innerHTML = doctorList;
  anesEle.innerHTML = doctorList;

  nameEle.focus();
}

newNoteNav.addEventListener("click", update);

dateEle.value = new Date().toISOString().slice(0, 10);
nameEle.focus();
update();



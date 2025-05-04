const doctorListWindow = document.querySelector(".doctor-list");
const addDoctor = document.querySelector("#doctor-list-add-doctor");
const tbody = document.querySelector("#doctor-list-render-tbody")
const save = document.querySelector("#doctor-list-add-doctor-button");

addDoctor.addEventListener("blur", (e) => {
  if (e.target.value.length > 0) { e.target.classList.remove("error"); }
});

addDoctor.addEventListener("keyup", (e) => {
  if (e.target.value.length > 0 && e.key === "Enter") {
    e.target.classList.remove("error");
    save.focus();
  }
});

save.addEventListener("click", () => {

  if (addDoctor.value.length < 1) {
    addDoctor.classList.add("error");
    addDoctor.focus();
    return;
  }

  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync("database.db");
  db.prepare("insert into doctors (name) values(?)").run(addDoctor.value.trim());
  db.close();

  addDoctor.value = "";
  render();

  let div = document.createElement("div");
  let new_note = document.querySelector(".doctor-list");

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
  new_note.append(div);

  setTimeout(() => {
    new_note.removeChild(div);
  }, 700);

  addDoctor.focus();
});

function render() {
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync("database.db");
  let doctors = db.prepare("select * from doctors").all();
  db.close();

  let rows = "";
  doctors.forEach((doctor, i) => {
    rows += `<tr id="doctor-no-${i + 1}">
      <td>${i + 1}</td>
      <td>${doctor.name}</td>
      <td>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18px">
        <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
      </td>
    </tr>`
  });
  tbody.innerHTML = rows;


  const doctorRows = document.querySelectorAll(".doctor-list tr[id|=doctor-no]");
  const doctorRowEditIcons = [];

  doctorRows.forEach(doctorRow => {
    doctorRow.addEventListener("dblclick", handleEdit);
    doctorRowEditIcons.push(doctorRow.querySelector("td:nth-child(3)"));
  });

  doctorRowEditIcons.forEach(doctorRowEditIcon => {
    doctorRowEditIcon.querySelector("svg").classList.add("rotateable");

    doctorRowEditIcon.addEventListener("click", handleEdit);
    doctorRowEditIcon.addEventListener("mouseover", handleMouseOver);
    doctorRowEditIcon.addEventListener("mouseleave", handleMouseLeave);
  });
}

function handleEdit() {
  let id_no = -1;
  if (this instanceof HTMLTableRowElement) {
    id_no = Number(this.id.slice(10));
  } else {
    id_no = Number(this.parentElement.id.slice(10));
  }


  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync("database.db");
  let doctorName = db.prepare("select * from doctors where id=?").get(id_no).name;
  db.close();

  let overlay = document.createElement("div");
  overlay.classList.add("edit-doctor-overlay");
  let div = document.createElement("div");

  let close = document.createElement("div");
  close.innerHTML = `
  <svg width="30" height="30" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;">
  <style>
    .line {
      stroke:rgb(0, 0, 0);
      stroke-width: 5;
      stroke-linecap: round;
      transition: all 0.4s ease;
    }
    svg:hover .line1,
    svg:hover .line2 {
      stroke: #ff0000;
    }
  </style>
  <line class="line line1" x1="15" y1="15" x2="35" y2="35" />
  <line class="line line2" x1="35" y1="15" x2="15" y2="35" />
</svg>
  `;

  let inputLabel = document.createElement("label");
  inputLabel.innerText = "Doctor Name";
  inputLabel.htmlFor = "edit-doctor-name";

  let input = document.createElement("input");
  input.type = "text";
  input.id = "edit-doctor-name";
  input.value = doctorName;

  let button = document.createElement("button");
  button.innerText = "Save";

  div.append(close, inputLabel, input, button);
  div.classList.add("edit-doctor");
  overlay.append(div);
  doctorListWindow.append(overlay);
  input.selectionStart = 0;
  input.selectionEnd = input.value.length;
  input.focus();

  close.addEventListener("click", () => doctorListWindow.removeChild(overlay));
  overlay.addEventListener("click", () => { doctorListWindow.removeChild(overlay) });

  div.addEventListener("click", (ev) => {
    ev.stopPropagation();
  });

  input.addEventListener("keyup", (ev) => {
    ev.stopPropagation();
    if (ev.key === "Enter" && ev.target.value.length > 0) {
      button.focus();
    }
  });

  button.addEventListener("click", (ev) => {
    ev.stopPropagation();
    if (input.value.length > 0) {
      const { DatabaseSync } = require("node:sqlite");
      const db = new DatabaseSync("database.db");
      db.prepare("update doctors set name = ? where id = ?").run(input.value.trim(), id_no);
      input.value = "";
      doctorListWindow.removeChild(overlay);
      render();

      addDoctor.focus();
    }
  });
}

function handleMouseOver() {
  this.querySelector("svg").classList.add("rotate");
}

function handleMouseLeave() {
  this.querySelector("svg").classList.remove("rotate");
}
render();

document.querySelector("[data-navitem=doctor-list]").addEventListener("click", () => {
  addDoctor.focus();
});
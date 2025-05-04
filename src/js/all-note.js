const all_note = document.querySelector(".navitem[data-navitem='all-note']");
const search = document.querySelector("#all-note-search");
const display_per_page = document.querySelector("#all-note-display-per-page");
const page_no = document.querySelector("#all-note-page-no");
const all_page = document.querySelector("#all-note-all-page");
const goto_page = document.querySelector("#all-note-goto-page");
const start_date = document.querySelector("#all-note-start-date");
const end_date = document.querySelector("#all-note-end-date");
const tbody = document.querySelector(".all-note tbody");

let currentPage = 1;
let possibleIndex = 1;

function isWithinDate(date, s_date, e_date) {
  let d = new Date(date).getTime();

  if (s_date === -1 && e_date === -1) return true;
  else if (s_date === -1 && d <= e_date) return true;
  else if (d >= s_date && e_date === -1) return true;
  if (d >= s_date && d <= e_date) return true;
  return false;
}

function renderHTML(data) {
  tbody.innerHTML = "";
  data.forEach((d) => {
    let tr = document.createElement("tr");
    let dateReverse = d.date.split("-").reverse().join("-");
    let style = Number(d.due) > 0 ? "style='background-color: red'" : "";
    tr.innerHTML = `

      <td>${d.id}</td>
      <td>${d.name}</td>
      <td>${d.age}</td>
      <td>${dateReverse}</td>
      <td>${d.mobile}</td>
      <td>${d.contract}</td>
      <td ${style}>${d.due}</td>
      <td>${d.surgeon}</td>
      <td> 
        <svg xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8">
          <animate attributeName="y" values="14;16;14" dur="1.5s" repeatCount="indefinite" />
          </rect>
        </svg>
      </td>
    `;
    makeRowIteractive(tr);
    tbody.appendChild(tr);
  });
}

function reset() {
  currentPage = 1;
  possibleIndex = 1;
  render();
}

function render() {
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync("database.db");
  let notes = db.prepare("select * from patients").all();
  db.close();

  let niddle = search.value.trim();
  let toDisplay = Number(display_per_page.value) || 1;

  let regex = new RegExp(niddle, "i");
  let possibleMatch = new Set();

  let start_d = new Date(start_date.value).getTime() || -1;
  let end_d = new Date(end_date.value).getTime() || -1;

  notes.forEach((note) => {
    if (regex.test(note.id)) {
      possibleMatch.add(note);
      return;
    }

    if (regex.test(note.name)) {
      possibleMatch.add(note);
      return;
    }

    if (regex.test(note.sex)) {
      possibleMatch.add(note);
      return;
    }

    if (regex.test(note.age)) {
      possibleMatch.add(note);
      return;
    }

    if (regex.test(note.bed)) {
      possibleMatch.add(note);
      return;
    }

    if (regex.test(note.address)) {
      possibleMatch.add(note);
      return;
    }

    if (regex.test(note.mobile)) {
      possibleMatch.add(note);
      return;
    }

    if (regex.test(note.gurdian)) {
      possibleMatch.add(note);
      return;
    }

    if (regex.test(note.surgeon)) {
      possibleMatch.add(note);
      return;
    }

    if (regex.test(note.asst_surgeon)) {
      possibleMatch.add(note);
      return;
    }

    if (regex.test(note.anes)) {
      possibleMatch.add(note);
      return;
    }

    if (regex.test(note.indication)) {
      possibleMatch.add(note);
      return;
    }

    if (regex.test(note.procedure)) {
      possibleMatch.add(note);
      return;
    }

    if (regex.test(note.remark)) {
      possibleMatch.add(note);
      return;
    }

    if (regex.test(note.contract)) {
      possibleMatch.add(note);
      return;
    }

    if (regex.test(note.paid)) {
      possibleMatch.add(note);
      return;
    }

    if (regex.test(note.due)) {
      possibleMatch.add(note);
      return;
    }
  });

  let withInDate = new Set();
  possibleMatch.forEach((match) => {
    if (isWithinDate(match.date, start_d, end_d)) {
      withInDate.add(match);
    }
  });

  withInDate = [...withInDate];
  withInDate.reverse();

  let start_index = (currentPage - 1) * toDisplay;
  let end_index = currentPage * toDisplay;

  possibleIndex = Math.ceil(withInDate.length / toDisplay);
  all_page.innerText = possibleIndex;
  page_no.innerText = currentPage;
  goto_page.value = currentPage;

  goto_page.setAttribute("max", possibleIndex);
  let toShow = withInDate.slice(start_index, end_index);

  renderHTML(toShow);
  search.focus();
}

search.addEventListener("input", reset);
display_per_page.addEventListener("input", (e) => {
  if (e.target.value > 0) reset();
});
start_date.addEventListener("input", reset);
end_date.addEventListener("input", reset);
all_note.addEventListener("click", reset);

display_per_page.addEventListener("blur", (e) => {
  if (!e.target.value) e.target.value = 1;
});

goto_page.addEventListener("input", (e) => {
  let next_page = Number(e.target.value);

  if (next_page <= possibleIndex && next_page > 0) {
    currentPage = Math.floor(next_page);
    render();
  }
  if (next_page > possibleIndex) {
    currentPage = possibleIndex;
    render();
  }
});

function makeRowIteractive(tr) {
  let lastTd = tr.querySelector("td:last-child");

  tr.addEventListener("dblclick", renderEdit);
  lastTd.addEventListener("click", print);
}

function renderEdit() {
  let id = Number(this.querySelector("td:nth-child(1)").innerText);
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync("database.db");
  let data = db.prepare("select * from patients where id=?").get(id);
  let all_note_overlayEle = document.querySelector(".all-note-overlay");

  let sex = '';

  if (data.sex === "Female") {
    sex = `<div class="row row-4">
          <label>Sex</label>
          <select>
            <option value="Female" selected>Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>`
  }

  if (data.sex === "Male") {
    sex = `<div class="row row-4">
          <label>Sex</label>
          <select>
            <option value="Female">Female</option>
            <option value="Male" selected>Male</option>
            <option value="Other">Other</option>
          </select>
        </div>`
  }

  if (data.sex === "Other") {
    sex = `<div class="row row-4">
          <label>Sex</label>
          <select>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other" selected>Other</option>
          </select>
        </div>`
  }

  let htmls = `
    <div class="ov">
      <div class="cn">
        <div class="row row-1">
          <div>
            <div><label>ID: </label><div>${id}</div></div>
            <div class="inputs">
              <div><label>Date</label><input type="date" value="${data.date}"></div>
              <div><label>Bed</label><input type="text" value="${data.bed}"></div> 
            </div>
          </div>
          <div>
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
          </div>
        </div>

        <div class="row row-2">
          <label>Name</label>
          <input type="text" value="${data.name}">
        </div>

        <div class="row row-3">
          <label>Age</label>
          <input type="text" value="${data.age}">
        </div>

        ${sex}

        <div class="row row-5">
          <label>Mobile</label>
          <input type="text" value="${data.mobile}">
        </div>

        <div class="row row-6">
          <label>Address</label>
          <input type="text" value="${data.address}">
        </div>

        <div class="row row-7">
          <label>Guardian</label>
          <input type="text" value="${data.gurdian}">
        </div>

        <div class="row row-8">
          <label>Surgeon</label>
          <select data-selected="${data.surgeon}"></select>
        </div>

        <div class="row row-9">
          <label>Asst. Surgeon</label>
          <select data-selected="${data.asst_surgeon}"></select>
        </div>

        <div class="row row-10">
          <label>Anesthetian</label>
          <select data-selected="${data.anes}"></select>
        </div>

        <div class="row row-11">
          <label>Indication</label>
          <input type="text" value="${data.indication}">
        </div>

        <div class="row row-12">
          <label>Procedure</label>
          <input type="text" value="${data.procedure}">
        </div>

        <div class="row row-13">
          <label>Remark</label>
          <input type="text" value="${data.remark}">
        </div>

        <div class="row row-14">
          <label>Contract</label>
          <input type="number" value="${data.contract}">
        </div>

        <div class="row row-15">
          <label>Paid</label>
          <input type="number" value="${data.paid}">
        </div>

        <div class="row row-16">
          <label>Due</label>
          <input type="number" value="${data.due}">
        </div>

        <div class="row row-17">
          <button>Save</button>
        </div>

      </div>
    </div>
  `;

  all_note_overlayEle.innerHTML = htmls;

  let closaBtn = all_note_overlayEle.querySelector(".row-1 > div:nth-child(2)");
  let surgeon = all_note_overlayEle.querySelector(".row-8 select");
  let surgeon_name = surgeon.dataset.selected;
  let asst_surgeon = all_note_overlayEle.querySelector(".row-9 select");
  let asst_surgeon_name = asst_surgeon.dataset.selected;
  let anes = all_note_overlayEle.querySelector(".row-10 select");
  let anes_name = anes.dataset.selected;

  let contract = all_note_overlayEle.querySelector(".row-14 input");
  let paid = all_note_overlayEle.querySelector(".row-15 input");
  let due = all_note_overlayEle.querySelector(".row-16 input");
  let saveBtn = all_note_overlayEle.querySelector(".row-17 button");

  let doctors = db.prepare("select * from doctors").all();
  db.close();

  let surgeon_html = "";
  let asst_surgeon_html = "";
  let anes_html = "";

  doctors.forEach(dct => {
    if (dct.name === surgeon_name) surgeon_html += `<option value="${dct.name}" selected>${dct.name}</option>`;
    else surgeon_html += `<option value="${dct.name}">${dct.name}</option>`;

    if (dct.name === asst_surgeon_name) asst_surgeon_html += `<option value="${dct.name}" selected>${dct.name}</option>`;
    else asst_surgeon_html += `<option value="${dct.name}">${dct.name}</option>`;

    if (dct.name === anes_name) anes_html += `<option value="${dct.name}" selected>${dct.name}</option>`;
    else anes_html += `<option value="${dct.name}">${dct.name}</option>`;
  });

  surgeon.innerHTML = surgeon_html;
  asst_surgeon.innerHTML = asst_surgeon_html;
  anes.innerHTML = anes_html;


  contract.addEventListener("input", () => {
    paid.value = 0;
    due.value = 0;
  });

  paid.addEventListener("input", () => {
    due.value = Number(contract.value) - Number(paid.value);
  });

  due.addEventListener("input", () => {
    paid.value = Number(contract.value) - Number(paid.value);
  });

  closaBtn.addEventListener("click", () => {
    all_note_overlayEle.innerHTML = "";
  });

  saveBtn.addEventListener("click", () => {
    let name = all_note_overlayEle.querySelector(".row-2 > input").value || "";
    let age = all_note_overlayEle.querySelector(".row-3 > input").value || "";
    let sex = all_note_overlayEle.querySelector(".row-4 > select").value || "";

    let bed = all_note_overlayEle.querySelector(".row-1  .inputs  input[type='text']").value || 0;
    let date = all_note_overlayEle.querySelector(".row-1  .inputs  input[type='date']").value || 0;

    let mobile =
      all_note_overlayEle.querySelector(".row-5 > input").value || "";
    let address =
      all_note_overlayEle.querySelector(".row-6 > input").value || "";
    let gurdian =
      all_note_overlayEle.querySelector(".row-7 > input").value || "";
    let surgeon =
      all_note_overlayEle.querySelector(".row-8 > select").value || "";
    let asst_surgeon =
      all_note_overlayEle.querySelector(".row-9 > select").value || "";
    let anes = all_note_overlayEle.querySelector(".row-10 > select").value || "";
    let indication =
      all_note_overlayEle.querySelector(".row-11 > input").value || "";
    let procedure =
      all_note_overlayEle.querySelector(".row-12 > input").value || "";
    let remark =
      all_note_overlayEle.querySelector(".row-13 > input").value || "";

    let contract =
      all_note_overlayEle.querySelector(".row-14 > input").value || "0.0";

    let paid =
      all_note_overlayEle.querySelector(".row-15 > input").value || "0.0";

    let due =
      all_note_overlayEle.querySelector(".row-16 > input").value || "0.0";

    const { DatabaseSync } = require("node:sqlite");
    const db = new DatabaseSync("database.db");

    db.prepare(`update patients set name=?, age=?, sex=?, mobile=?, address=?, gurdian=?, surgeon=?, asst_surgeon=?, anes=?, indication=?, procedure=?, remark=?, contract=?, paid=?, due=?, date=?, bed=? where id = ${id}`).run(name, age, sex, mobile, address, gurdian, surgeon, asst_surgeon, anes, indication, procedure, remark, contract, paid, due, date, bed);
    all_note_overlayEle.innerHTML = "";

    render();
  });
}

function print() {
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync("database.db");
  let has_print_id = db.prepare("select * from to_print").all();

  if (has_print_id.length)
    db.prepare("update to_print set pid=?").run(Number(this.parentElement.querySelector("td").innerText));
  else
    db.prepare("insert into to_print (id, pid) values (?, ?)").run(1, Number(this.parentElement.querySelector("td").innerText));
  db.close();

  const { ipcRenderer } = require("electron");
  ipcRenderer.send("print");
}

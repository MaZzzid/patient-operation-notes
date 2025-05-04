const { DatabaseSync } = require("node:sqlite");

export function getDB() {
  return new DatabaseSync("database.db");
}

export function insert(table, fields, values) {
    let field_string = "";
    let value_string = "";

    fields.forEach((f, i) => {
        if (i !== fields.length - 1) {
            field_string += f + ", ";
        } else field_string += f;
    });

    values.forEach((v, i) => {
        if (i !== values.length - 1) {
            value_string += "?, ";
        } else value_string += "?";
    });

    let db = getDB();
    db.prepare(`insert into ${table} (${field_string}) values (${value_string})`).run(...values);
    db.close();
}


export function update(table, fields, values, condition) {
    let set_string = "";

    fields.forEach((f, i) => {
        if (i !== set_string.length - 1) {
            set_string += f + "=?, ";
        } else set_string += f + "=?";
    });

    let db = getDB();
    db.prepare(`update ${table} set ${set_string} ${condition}`).run(...values);
    db.close();
}

export function hide(ele) {
    ele.classList.add("hide");
    ele.classList.remove("show");
    ele.classList.remove("visible");
}

export function hidden(ele) {
    ele.classList.add("hide");
    ele.classList.remove("show");
    ele.classList.remove("visible");
}

export function show(ele) {
    ele.classList.add("show");
    ele.classList.remove("hide");
    ele.classList.remove("hidden");
}

export function visible(ele) {
    ele.classList.add("show");
    ele.classList.remove("hide");
    ele.classList.remove("hidden");
}



export function error(ele) {
    ele.classList.add("error");
}

export function unError(ele) {
    ele.classList.remove("error");
    ele.title = "";
}



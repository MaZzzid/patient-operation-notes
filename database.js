const {DatabaseSync} = require("node:sqlite");
const db = new DatabaseSync("database.db");

db.prepare(`
  create table if not exists users(
    id integer primary key autoincrement,
    name text,
    password text,
    is_admin
  )`).run();

db.prepare(`
  create table if not exists active_user(
    id integer primary key autoincrement,
    user_id text,
    is_admin text
  )`).run();

db.prepare(`
  create table if not exists doctors(
    id integer primary key autoincrement,
    name text
  )`).run();

db.prepare(`
  create table if not exists to_print(
    id integer primary key autoincrement,
    pid integer
  )`).run();

db.prepare(`
  create table if not exists patients(
    id integer primary key autoincrement,
    date text,
    name text,
    sex text,
    age text,
    bed text,
    address text,
    mobile text,
    gurdian text,
    surgeon text,
    asst_surgeon text,
    anes text,
    indication text,
    procedure text,
    remark text,
    contract text,
    paid text,
    due text
  )`).run();

db.close();
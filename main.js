import { app, BrowserWindow, ipcMain } from "electron";

import { DatabaseSync } from "node:sqlite";
import  "./database.js";

const db = new DatabaseSync("database.db");
let window;

app.whenReady().then(() => {
  try {
    let users = db.prepare(`select * from users`).all();
    if (users.length === 0) createAdminWindow();
    else createLoginWindow();
  }
  catch (e) {
    createAdminWindow();
  }

  ipcMain.on("open:relunch", () => {
    app.relaunch();
    app.quit();
  });

  ipcMain.on("open:pon", (ev) => {    
    createPONWindow();
  });

  ipcMain.on("print", (ev) => {
    let printWindow = new BrowserWindow({
      parent: window,
      modal: true,
      minimizable: false,
      icon: "./src/tarafder.ico",
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
        devTools: false,
      },
    });
    printWindow.setMenu(null);
    printWindow.loadFile("./src/print.html");
  });
});

function createAdminWindow() {
  window = new BrowserWindow({
    width: 400,
    height: 500,
    icon: "./src/tarafder.ico",
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      devTools: false,
    },
  });

  window.loadFile("./src/create-admin.html");
  window.setMenu(null);
  window.setResizable(false);
}

function createLoginWindow() {
  window = new BrowserWindow({
    width: 400,
    height: 500,
    icon: "./src/tarafder.ico",
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      devTools: false,
    },
  });

  window.loadFile("./src/login.html");
  window.setMenu(null);
  window.setResizable(false);
}

function createPONWindow() {
  window = new BrowserWindow({
    icon: "./src/tarafder.ico",
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      devTools: false,
    },
  });

  window.loadFile("./src/pon.html");
  window.setMenu(null);
  window.maximize();
}

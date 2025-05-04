const setting = document.querySelector("#setting");
const msg = document.querySelector(".setting-msg")
const oldPassword = document.querySelector("#old-password");
const newPassword = document.querySelector("#new-password");
const repeatPassword = document.querySelector("#repeat-password");
const saveNewPassword = document.querySelector("#save-new-password");

const showPassword = document.querySelector("#show-password");
const oldPasswordViewer = document.querySelector("#old-password-viewer");
const newPasswordViewer = document.querySelector("#new-password-viewer");
const repeatPasswordViewer = document.querySelector("#repeat-password-viewer");

oldPassword.addEventListener("keyup", (ev) => {
    if (ev.target.value.length > 0 && ev.key === "Enter")
        newPassword.focus();
});

oldPassword.addEventListener("blur", (ev) => {
    if (ev.target.value.length > 0) ev.target.classList.remove("error");
})

newPassword.addEventListener("keyup", (ev) => {
    if (ev.target.value.length > 0 && ev.key === "Enter")
        repeatPassword.focus();
});

repeatPassword.addEventListener("keyup", (ev) => {
    if (ev.target.value.length > 0 && ev.key === "Enter")
        saveNewPassword.focus();
});

showPassword.addEventListener("input", () => {
    if (showPassword.checked) {
        oldPasswordViewer.value = oldPassword.value;
        newPasswordViewer.value = newPassword.value;
        repeatPasswordViewer.value = repeatPassword.value;

        oldPassword.classList.add("hidden");
        newPassword.classList.add("hidden");
        repeatPassword.classList.add("hidden");

        oldPasswordViewer.classList.remove("hidden");
        newPasswordViewer.classList.remove("hidden");
        repeatPasswordViewer.classList.remove("hidden");
    } else {
        oldPassword.classList.remove("hidden");
        newPassword.classList.remove("hidden");
        repeatPassword.classList.remove("hidden");

        oldPasswordViewer.classList.add("hidden");
        newPasswordViewer.classList.add("hidden");
        repeatPasswordViewer.classList.add("hidden");
    }
});

saveNewPassword.addEventListener("click", (ev) => {
    const { DatabaseSync } = require("node:sqlite");
    const db = new DatabaseSync("database.db");
    let old_pass = db.prepare("select * from users where is_admin=?").get(1);

    if (oldPassword.value.length === 0) {
        oldPassword.classList.add("error");
        oldPassword.focus();
        return;
    }

    if (old_pass.password === oldPassword.value) {
        if (newPassword.value.trim() === repeatPassword.value.trim()) {
            db.prepare("update users set password=? where is_admin=?").run(newPassword.value.trim(), 1);
            db.close();
            oldPassword.value = "";
            newPassword.value = "";
            repeatPassword.value = "";

            let div = document.createElement("div");

            div.innerHTML = `
                        <svg width="70" height="70" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="26" cy="26" r="25" fill="#5D29A0" stroke="#5D29A0" stroke-width="2" />
                            <path 
                                fill="none" 
                                stroke="#FFFFFF" 
                                stroke-width="4" 
                                d="M14 27 l7 7 l17 -17" 
                                stroke-linecap="round"
                                stroke-linejoin="round">
                                <animate attributeName="stroke-dasharray" from="0,50" to="50,0" dur="0.5s" fill="freeze" />
                            </path>
                        </svg>
                    `;
            div.classList.add("save-animation");
            div.classList.add("show");
            setting.append(div);

            setTimeout(() => {
                setting.removeChild(div);
            }, 700);
        } else {
            msg.classList.add("show");
            msg.innerText = "Password does not matched.";
            newPassword.focus();
            return;
        }
    }

});

document.querySelector("[data-navitem=setting]").addEventListener("click", (ev) => {
    oldPassword.focus();
});
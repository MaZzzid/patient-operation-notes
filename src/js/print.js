const { DatabaseSync } = require('node:sqlite')
const db = new DatabaseSync('database.db')

const nav = document.querySelector('nav')
const navItems = nav.querySelectorAll('& > div')

navItems.forEach(navItem => {
  navItem.addEventListener('click', () => {
    if (document.querySelector('nav .active') === navItem) return

    let navName = navItem.dataset.print
    let activeNavItem = document.querySelector('nav div.active')
    let activeMainItem = document.querySelector('main div.active')

    activeNavItem.classList.remove('active')
    activeMainItem.classList.remove('active')
    navItem.classList.add('active')
    document.querySelector(`main .${navName}`).classList.add('active')
  })
})

document.querySelectorAll('.print button').forEach(btn => {
  btn.addEventListener('click', () => {
    print()
  })
})

let query = db.prepare('select * from to_print')
let result = query.get()

result = db.prepare(`select * from patients where id=?`).get(result.pid)

let opNote = document.querySelector('.op-note')

let opNoteDate = opNote.querySelector('.op-note-date')
let opNoteTime = opNote.querySelector('.op-note-time')
let opNoteIndication = opNote.querySelector('.op-note-indication')
let opNoteSurgeon = opNote.querySelector('.op-note-surgeon')
let opNoteAsst = opNote.querySelector('.op-note-asst')
let opNoteAnes = opNote.querySelector('.op-note-anes')
let opNoteFinding = opNote.querySelector('.op-note-finding')

let date = new Date(result.date)
let year = date.getFullYear()
let month = date.getMonth() + 1
let day = date.getDate()

if (month < 10) month = '0' + month
if (day < 10) day = '0' + day

date = `${day}-${month}-${year}`
opNoteDate.textContent = date

let time = result.op_time
opNoteTime.textContent = time

opNoteIndication.textContent = result.indication
opNoteSurgeon.textContent = result.surgeon
opNoteAsst.textContent = result.asst_surgeon
opNoteAnes.textContent = result.anes
opNoteFinding.textContent = result.procedure

let tsname = document.querySelectorAll('.ts-name')
let tsage = document.querySelectorAll('.ts-age')
let tssex = document.querySelectorAll('.ts-sex')
let tsdate = document.querySelectorAll('.ts-date')
let tsbed = document.querySelectorAll('.ts-bed')

tsname.forEach(el => (el.textContent = result.name))
tsage.forEach(el => (el.textContent = result.age + ' Y'))
tssex.forEach(el => (el.textContent = result.sex))
tsdate.forEach(el => (el.textContent = date))
tsbed.forEach(el => (el.textContent = result.bed))

let tsmname = document.querySelector('.tsmname')
let tsmage = document.querySelector('.tsmage')
let tsmsex = document.querySelector('.tsmsex')
let tsmdate = document.querySelector('.tsmdate')
let tsmbed = document.querySelector('.tsmbed')

tsmname.textContent = result.name
tsmage.textContent = result.age + ' Y'
tsmsex.textContent = result.sex
tsmdate.textContent = date
tsmbed.textContent = result.bed

let opcname = document.querySelector('.opcname')
let opcage = document.querySelector('.opcage')
let opcdoctor = document.querySelector('.opcdoctor')
let opcanes = document.querySelector('.opcanes')

opcname.textContent = result.name
opcage.textContent = result.age
opcdoctor.textContent = result.surgeon
opcanes.textContent = result.anes

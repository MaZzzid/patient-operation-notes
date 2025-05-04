document.querySelectorAll(".navitem").forEach(navitem => {
  navitem.addEventListener("click", () => {
    
    const active_navitem = document.querySelector(".navitem.active");
    if(navitem === active_navitem) return;
    const active_mainitem_class = active_navitem.dataset.navitem;
    const active_mainitem = document.querySelector(`main > .${active_mainitem_class}`);

    const next_active_mainitem_class = navitem.dataset.navitem;
    const next_active_mainitem = document.querySelector(`main > .${next_active_mainitem_class}`);

    active_navitem.classList.remove("active");
    active_mainitem.classList.remove("active");

    navitem.classList.add("active");
    next_active_mainitem.classList.add("active");
  })
});
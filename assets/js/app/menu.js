// assets/js/app/menu.js
window.Menu = {
  load() {
    return fetch("partials/menu.html")
      .then(r => r.text())
      .then(html => {
        document.getElementById("menu-area").innerHTML = html;
        Guards.run(document.getElementById("menu-area"));
        this.bind();
        this.initSneat();
      });
  },

  bind() {
    document.querySelectorAll("#menu-area [data-route]").forEach(a => {
      a.addEventListener("click", () => {
        const route = a.dataset.route;
        Router.go(route);
        this.setActive(route);
      });
    });
  },

  setActive(routeName) {
    document.querySelectorAll("#menu-area .menu-item")
      .forEach(li => li.classList.remove("active", "open"));

    const link = document.querySelector(`#menu-area [data-route="${routeName}"]`);
    if (!link) return;

    const item = link.closest(".menu-item");
    item?.classList.add("active");

    const parent = item?.closest(".menu-sub")?.closest(".menu-item");
    parent?.classList.add("active", "open");
  },

  initSneat() {
    if (window.MenuComponent) return;
    window.MenuComponent = new Menu(document.querySelector('#layout-menu'));
  }
};

function openMenu(menu, container = false) {
  if (container) {
    document.querySelectorAll('.menu.container .menu').forEach(menu => {
      menu.classList.remove('menu-closed');
    });
  }
  document.querySelector(`#${menu}`).classList.remove('menu-closed');
}

function closeMenu(menu) {
  document.querySelector(`#${menu}`).classList.add('menu-closed');
}
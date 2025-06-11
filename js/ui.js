function openMenu(menu) {
  document.querySelector(`#${menu}`).classList.remove('menu-closed');
}

function closeMenu(menu) {
  document.querySelector(`#${menu}`).classList.add('menu-closed');
}
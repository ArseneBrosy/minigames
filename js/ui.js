function openMenu(menu, container = false) {
  if (container) {
    document.querySelectorAll('.menu.container .menu').forEach(menu => {
      menu.classList.add('menu-closed');
    });
  }
  document.querySelector(`#${menu}`).classList.remove('menu-closed');
}

function closeMenu(menu) {
  document.querySelector(`#${menu}`).classList.add('menu-closed');
}

function copyInput(input) {
  const inputElement = document.getElementById(input);
  inputElement.select();

  document.execCommand("copy");

  event.target.innerHTML = '<span class="material-symbols-outlined">check</span>';
}
function generateCode(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function codeInputAction(input) {
  event.preventDefault();

  const key = event.key.toUpperCase();
  if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".includes(key)) {
    document.querySelectorAll("#code input")[input].value = key;
    document.querySelectorAll("#code input")[input].classList.add("filled");
    if (input < 4) {
      document.querySelectorAll("#code input")[input + 1].select();
    } else {
      const value =
          document.querySelectorAll("#code input")[0].value +
          document.querySelectorAll("#code input")[1].value +
          document.querySelectorAll("#code input")[2].value +
          document.querySelectorAll("#code input")[3].value +
          document.querySelectorAll("#code input")[4].value;
      console.log(value);
    }
  }
  if (key === "BACKSPACE") {
    if (document.querySelectorAll("#code input")[input].value === "") {
      document.querySelectorAll("#code input")[input - 1].value = "";
      document.querySelectorAll("#code input")[input - 1].classList.remove("filled");
      document.querySelectorAll("#code input")[input - 1].select();
    } else {
      document.querySelectorAll("#code input")[input].value = "";
      document.querySelectorAll("#code input")[input].classList.remove("filled");
    }
  }
}

document.querySelector('#private-lobby-button').href = `./game.html?room=${generateCode()}`;
document.querySelector('#open-private-lobby-menu').addEventListener('click', () => {
  document.querySelector('#private-lobby-menu').classList.remove('menu-closed');
});
document.querySelector('#close-private-lobby-menu').addEventListener('click', () => {
  document.querySelector('#private-lobby-menu').classList.add('menu-closed');
});
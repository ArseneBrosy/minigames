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
      window.location.href = `./game.html?room=${value}`;
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

const picture = localStorage.getItem("picture");
if (picture !== null) {
  document.querySelector("#profile-picture").style.backgroundImage = `url('../src/images/profile${picture}.png')`;
}

document.querySelector("#randomize").addEventListener('click', () => {
  const picture = Math.floor(Math.random() * 4);
  document.querySelector("#profile-picture").style.backgroundImage = `url('../src/images/profile${picture}.png')`;
  localStorage.setItem('picture', picture.toString());
});

const pseudo = localStorage.getItem("pseudo");
if (pseudo !== null) {
  document.querySelector('#pseudo').value = pseudo;
}

document.querySelector('#pseudo').addEventListener('input', (e) => {
  if (e.target.value !== "") {
    localStorage.setItem('pseudo', e.target.value);
  }
});
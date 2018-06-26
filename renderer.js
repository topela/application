"use strict";

// Debug
// positions.forEach(([x, y]) => {
//   const div = document.createElement('div')
//   div.style.width = `${movuinoSide}px`
//   div.style.height = `${movuinoSide}px`
//   div.style['background-color'] = 'black'
//   div.style.position = 'fixed'
//   div.style.left = `${rest + circle.offsetLeft + x}px`
//   div.style.top = `${rest + y}px`
//   document.body.appendChild(div)
// })

function drawMovuino(movuino) {
  const [x, y] = positions.shift();

  const style = {
    top: `${rest + y}px`,
    left: `${rest + circle.offsetLeft + x}px`
  };
}

// // buttons
// (() => {
//   const audio = document.querySelector(".audio");
//   const muted = !!localStorage.getItem("muted");
//   if (muted) {
//     audio.querySelector("img")
//   }
//   audio.addEventListener("click", () => {

//   })
// })();

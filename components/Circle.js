"use strict";

const React = require("react");

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

// function drawMovuino(movuino) {
//   const [x, y] = positions.shift();

//   const style = {
//     top: `${rest + y}px`,
//     left: `${rest + circle.offsetLeft + x}px`
//   };
// }

module.exports = class Circle extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { positions: null };
  }

  componentDidMount() {
    const circle = this.ref;
    this.offsetLeft = circle.offsetLeft;
    const diameter = circle.clientHeight;

    // Movuino square size
    const movuinoSide = 100;

    // Grid in circle size
    // https://fr.vikidia.org/wiki/Racine_carr%C3%A9e_de_2
    // diameter is the hypotenuse
    const gridSide = diameter / Math.sqrt(2);
    this.rest = (diameter - gridSide) / 2;

    // Debug
    // const div = document.createElement('div')
    // div.style.width = `${gridSide}px`
    // div.style.height = `${gridSide}px`
    // div.style['background-color'] = 'red'
    // div.style.position = 'fixed'
    // div.style.left = `${rest + circle.offsetLeft}px`
    // div.style.top = `${rest}px`
    // document.body.appendChild(div)
    // const square = height / slices;
    // const height = circle.clientHeight;

    const slices = Math.floor(gridSide / movuinoSide);

    const positions = [];

    let row = 0;
    let col = 0;
    let n = 0;

    for (let i = 0; i < slices * slices; i++) {
      const x = col * movuinoSide;
      const y = row * movuinoSide;

      col++;

      if (++n === slices) {
        row++;
        col = 0;
        n = 0;
      }

      positions.push([x, y]);
    }

    function shuffle(a) {
      for (let i = a.length; i; i--) {
        const j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
      }
    }

    shuffle(positions);
    this.setState({ positions });
  }

  shouldComponentUpdate() {
    return this.props.children.length === 0;
  }

  render() {
    console.log("render");
    const { children } = this.props;
    const { positions } = this.state;
    const { rest, offsetLeft } = this;
    return (
      <div
        className="circle"
        ref={_ => {
          this.ref = _;
        }}
      >
        {positions &&
          children.map((child, idx) => {
            const [x, y] = positions.shift();

            return (
              <div
                style={{
                  position: "absolute",
                  top: `${rest + y}px`,
                  left: `${rest + offsetLeft + x}px`
                }}
                key={idx}
              >
                {child}
              </div>
            );
          })}
      </div>
    );
  }
};

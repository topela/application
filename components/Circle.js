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

module.exports = class Circle extends React.Component {
  constructor(...args) {
    super(...args);
    this.positions = [];
    this.mounted = false;
  }

  componentDidMount() {
    if (this.mounted) return;

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

    const slices = Math.floor(gridSide / movuinoSide);

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

      this.positions.push([x, y]);
    }

    function shuffle(a) {
      for (let i = a.length; i; i--) {
        const j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
      }
    }

    shuffle(this.positions);
    this.mounted = true;
  }

  render() {
    const { data, renderItem } = this.props;
    const { rest, offsetLeft, positions } = this;
    return (
      <div
        className="circle"
        style={{
          backgroundColor: "lightyellow",
          width: "100vmin",
          height: "100vmin",
          borderRadius: "50%",
          boxSizing: "border-box",
          border: "solid lightgrey 10px",
          transition: "all 0.2s ease-in-out"
        }}
        ref={_ => {
          this.ref = _;
        }}
      >
        {positions &&
          data.map(item => {
            const [x, y] = positions.shift();
            return renderItem(item, {
              top: `${rest + y}px`,
              left: `${rest + offsetLeft + x}px`
            });
          })}
      </div>
    );
  }
};

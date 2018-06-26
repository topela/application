"use strict";

const React = require("react");
const sounds = require("../lib/sounds");

module.exports = class Movuino extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      isOpen: false,
      rate: 0
    };
  }

  onMouseOver(evt) {
    document.querySelector(".circle").style.opacity = 1;
    evt.target.style.opacity = 1;
  }

  onMouseLeave(evt) {
    document.querySelector(".circle").style.opacity = 0.2;
    evt.target.style.opacity = 0.2;
  }

  open() {
    this.setState({ isOpen: true });

    const { movuino } = this.props;

    sounds.inflate();

    if (movuino.online) {
      movuino.startVibro();
      setTimeout(() => {
        movuino.stopVibro();
      }, 100);
    }

    if (this.props.onOpen) {
      this.props.onOpen();
    }
  }

  close() {
    this.setState({ isOpen: false });

    const { movuino } = this.props;

    sounds.pop();

    if (movuino.online) {
      movuino.startVibro();
      setTimeout(() => {
        movuino.stopVibro();
      }, 100);
    }

    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  componentDidMount() {
    const { movuino } = this.props;
    let rate = 0;
    movuino.on("data", () => rate++);
    setInterval(() => {
      this.setState({
        rate
      });
      rate = 0;
    }, 1000);
  }

  render() {
    const { color, name, plugged, online, accel, gyro } = this.props.movuino;
    const { isOpen, rate } = this.state;

    const attrs = {};
    if (isOpen) {
      attrs.onMouseOver = this.onMouseOver;
      attrs.onMouseLeave = this.onMouseLeave;
    } else {
      attrs.onClick = () => this.open();
    }

    return (
      <div
        {...attrs}
        className={`circle movuino ${isOpen && "big"}`}
        style={{
          backgroundColor: color,
          opacity: online || plugged ? "1" : "0",
          zIndex: isOpen ? "99" : "0"
          // top: `${rest + this.y}px`,
          // left: `${rest + circle.offsetLeft + this.x}px`
        }}
      >
        <img
          onClick={() => this.close()}
          className="close-button"
          src="./images/close.png"
          hidden={true}
        />
        <div className="status">
          <h1 className="title">{name}</h1>
          <span
            hidden={!online}
            className="range"
          >{`Ranges: ${accel} / ${gyro}`}</span>
          <div className="status">
            <img className="plugged" src="./images/usb.png" hidden={!plugged} />
            <img className="plugged" src="./images/wifi.png" hidden={!online} />
            <span hidden={!online} className="rate">{`${rate}m/s`}</span>
          </div>
        </div>
      </div>
    );
  }
};

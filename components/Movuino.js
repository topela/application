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
        style={{
          zIndex: isOpen ? "99" : "0",
          width: isOpen ? "100vmin" : "100px",
          height: isOpen ? "100vmin" : "100px",
          position: isOpen ? "fixed" : "absolute",
          cursor: isOpen ? "default" : "pointer",
          top: isOpen ? "0" : this.props.style.top,
          left: isOpen ? "calc((100% - 100vmin) / 2)" : this.props.style.left,
          backgroundColor: color,
          opacity: online || plugged ? "1" : "0",
          fontSize: "12px",
          overflow: "hidden",
          boxSizing: "border-box",
          borderRadius: "50%",
          transition: "all 0.4s ease-in-out",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {isOpen && (
          <img
            style={{
              width: "64px",
              cursor: "pointer",
              bottom: "10px",
              position: "absolute"
            }}
            onClick={() => this.close()}
            className="close-button"
            src="./images/close.png"
          />
        )}
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "14px", fontWeight: "bold" }}>{name}</h1>
          <span
            hidden={!online}
            className="range"
          >{`Ranges: ${accel} / ${gyro}`}</span>
          <div className="status">
            <img
              style={{ height: "18px" }}
              src="./images/usb.png"
              hidden={!plugged}
            />
            <img
              style={{ height: "18px" }}
              src="./images/wifi.png"
              hidden={!online}
            />
            <span hidden={!online} className="rate">{`${rate}m/s`}</span>
          </div>
        </div>
      </div>
    );
  }
};

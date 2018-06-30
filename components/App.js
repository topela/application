"use strict";

const graph = require("../graph");

const React = require("react");
const movuino = require("movuino");

const Circle = require("./Circle");
const Movuino = require("./Movuino");
const Configuration = require("./Configuration");

module.exports = class App extends React.Component {
  constructor(...args) {
    super(...args);
    const { movuinos } = movuino;
    this.state = { movuinos, movuino: null };
  }

  update() {
    const { movuinos } = movuino;
    this.setState({ movuinos });
  }

  componentDidMount() {
    movuino.on("movuino", device => {
      this.update();

      for (const event of ["online", "offline", "plugged", "unplugged"]) {
        device.on(event, () => this.update());
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <h1
          style={{
            position: "fixed",
            left: "10px",
            top: "10px",
            cursor: "pointer",
            color: "white"
          }}
        >
          Movuino
        </h1>

        <Configuration movuinos={this.state.movuinos} />

        <Circle
          data={this.state.movuinos}
          renderItem={(movuino, style) => (
            <Movuino
              style={style}
              onOpen={() => {
                graph.start(movuino);
                this.setState({ movuino });
              }}
              onClose={() => {
                graph.stop(movuino);
                this.setState({ movuino: null });
              }}
              key={movuino.id}
              movuino={movuino}
            />
          )}
        />
        <img
          style={{
            position: "fixed",
            left: "10px",
            bottom: "10px"
          }}
          hidden={!this.state.movuino}
          src="./images/3d.svg"
        />
        {/* <div
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px"
          }}
        >
          <img style={{ cursor: "pointer" }} src="./images/mute.png" />
        </div> */}
      </React.Fragment>
    );
  }
};

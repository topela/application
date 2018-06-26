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
        <Circle>
          {this.state.movuinos.map(movuino => (
            <Movuino
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
          ))}
        </Circle>
        <img
          className="axes"
          hidden={!this.state.movuino}
          src="./images/3d.svg"
        />
        <Configuration movuinos={this.state.movuinos} />
      </React.Fragment>
    );
  }
};

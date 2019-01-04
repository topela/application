"use strict";

const React = require("react");
const os = require("os");
const movuino = require("movuino");

module.exports = class Configuration extends React.Component {
  constructor(...args) {
    super(...args);
    const ssid = localStorage.getItem("ssid") || "";
    const password = localStorage.getItem("password") || "";
    const host = localStorage.getItem("host") || "";
    const hide = localStorage.getItem("hide") === "true";

    this.state = {
      ssid,
      password,
      host,
      hide,
      ready: false
    };
  }

  onSubmit(evt) {
    evt.preventDefault();

    const { ssid, password, host, hide } = this.state;

    localStorage.setItem("ssid", ssid);
    localStorage.setItem("password", password);
    localStorage.setItem("host", host);
    localStorage.setItem("hide", hide);

    movuino.movuinos.forEach(async movuino => {
      if (!movuino.plugged) {
        return;
      }
      try {
        await movuino.setWifi({
          ssid,
          password,
          host
        });
      } catch (err) {
        console.error(err);
      }
    });
  }

  async componentDidMount() {
    const { ssid, host } = await movuino.detectWifi();

    console.log(ssid, host);

    this.setState({
      ssid,
      host,
      password: ""
    });

    this.setState({ ready: true });
  }

  render() {
    const { hide, host, ssid, ready } = this.state;

    return (
      <form
        onSubmit={evt => this.onSubmit(evt)}
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          color: "white"
        }}
      >
        <fieldset disabled={!ready}>
          <div className="form-group">
            <label htmlFor="ssid">WiFi name</label>
            <input
              type="text"
              value={ssid}
              onChange={({ target }) => this.setState({ ssid: target.value })}
              required
              className="form-control"
              name="ssid"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">WiFi password</label>
            <input
              type={hide ? "password" : "text"}
              className="form-control"
              name="password"
              onChange={({ target }) =>
                this.setState({ password: target.value })
              }
            />
          </div>
          <div className="form-check">
            <label className="form-check-label">
              <input
                className="form-check-input"
                checked={hide}
                onChange={({ target }) =>
                  this.setState({ hide: target.checked })
                }
                name="hide"
                type="checkbox"
              />
              Hide
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="host">Computer IP</label>
            <input
              type="text"
              value={host}
              required
              className="form-control"
              name="host"
              onChange={({ target }) => this.setState({ host: target.value })}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </fieldset>
      </form>
    );
  }
};

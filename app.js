"use strict";

const React = require("react");
const ReactDOM = require("react-dom");
const App = require("./components/App.js");

const randomColor = require("randomcolor");
const faker = require("faker");

const movuino = require("movuino");

const sounds = require("./lib/sounds");

movuino.on("error", onError);
window.addEventListener("error", onError);

movuino.listen();

function onError(err) {
  sounds.fart();
  console.error(err);
}

movuino.on("movuino", device => {
  device.on("error", onError);

  const color = randomColor({
    luminosity: "light",
    format: "rgba",
    alpha: 0.9,
    seed: device.id
  });
  device.color = color;
  const name = (() => {
    faker.locale = "fr";
    faker.seed(device.id);
    return faker.name.firstName();
  })();
  device.name = name;

  console.log("movuino", name);

  device.on("plugged", async () => {
    console.log(name, "plugged");

    try {
      await device.attachSerial();
    } catch (err) {
      onError(err);
      return;
    }

    sounds.on();
    device.plugged = true;
  });

  device.on("unplugged", () => {
    console.log(name, "unpluged");

    sounds.off();
    movuino.plugged = false;
  });

  device.on("online", () => {
    console.log(name, "online");

    sounds.youpi();
    movuino.online = true;
  });

  device.on("offline", () => {
    console.log(name, "offline");

    sounds.aw();
    movuino.online = false;
  });

  device.on("vibrator-on", () => {
    console.log(name, "vibrator on");
  });

  device.on("vibrator-off", () => {
    console.log(name, "vibrator off");
  });

  device.on("button-up", () => {
    console.log(name, "button-up");
  });

  device.on("button-down", () => {
    console.log(name, "button-down");
  });
});

ReactDOM.render(<App />, document.getElementById("root"));

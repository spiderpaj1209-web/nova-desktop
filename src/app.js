import { initUpdater } from "./nova-updates.js";

initUpdater({
  button: document.querySelector("#update-button"),
  status: document.querySelector("#update-status"),
  version: document.querySelector("#version-label"),
});

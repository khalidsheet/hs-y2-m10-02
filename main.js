import { DragGesture } from "@use-gesture/vanilla";
import { App } from "./App/app";
import "./style.css";

const app = new App();

const canvas = document.querySelector("#canvas");
const guesture = new DragGesture(canvas, (e) => {
  app.onDrag(e, e.delta[0]);
});

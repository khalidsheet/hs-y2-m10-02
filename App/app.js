import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Color,
  Group,
  Clock,
  MathUtils,
  Vector3,
} from "three";
import { gsap } from "gsap";

// import resources from "./Resources";
import { Tile } from "./Tiles/Tile";

export class App {
  constructor() {
    this._version = "light";
    this._parent = new Group();

    this._init();
  }

  async _init() {
    // RENDERER
    this._gl = new WebGLRenderer({
      canvas: document.querySelector("#canvas"),
    });

    this._gl.setSize(window.innerWidth, window.innerHeight);

    // CAMERA
    const aspect = window.innerWidth / window.innerHeight;
    this._camera = new PerspectiveCamera(60, aspect, 1, 100);
    this._camera.position.x = 0;
    this._camera.position.y = 0;
    this._camera.position.z = 10;
    // this._camera.lookAt(0, 2.2, 0);
    this._resize();

    // SCENE
    this._scene = new Scene();

    // CLOCK
    this._clock = new Clock();

    // LOAD
    this._load();

    this._animate();

    this._initEvents();
  }

  async _load() {
    // await resources.load();

    // INIT SCENE
    this._initScene();

    // INIT LIGHTS
    this._initights();
  }

  _initScene() {
    // SCENE
    this._scene.background = new Color(0x16201f);

    this._tiles = new Tile();
    this._tilesGroup = this._tiles.createTiles(400, 800, 10, 10);

    this._tilesGroup.children.forEach((tile) => {
      tile.position.y = MathUtils.randFloat(-100, 100);
    });

    this._scene.add(this._tilesGroup);
  }

  onDrag(e, delta) {
    this._tilesGroup.children.forEach((tile) => {
      tile.userData.newPosition.x += delta;
    });
  }

  _initights() {
    // DIRECTIONAL
    // const dl = new DirectionalLight();
    // dl.position.set(4, 0, 5);
    // dl.lookAt(0, 0, 0);
    // dl.intensity = 30;
    // this._dl = dl;
    // this._scene.add(dl);
    // // // SPORTLIGHT
    // const sl = new SpotLight();
    // sl.intensity = 700;
    // sl.position.set(0, 5, 5);
    // this._sl = sl;
    // const sl2 = new SpotLight();
    // sl2.intensity = 700;
    // sl2.position.set(2, 5, -5);
    // this._sl2 = sl2;
    // this._scene.add(sl, sl2);
  }

  _initEvents() {
    window.addEventListener("resize", this._resize.bind(this));
  }

  _resize() {
    let fov = Math.atan(window.innerHeight / 2 / this._camera.position.z) * 2;
    fov = MathUtils.radToDeg(fov);

    this._camera.fov = fov;

    this._gl.setSize(window.innerWidth, window.innerHeight);

    const aspect = window.innerWidth / window.innerHeight;
    this._camera.aspect = aspect;
    this._camera.updateProjectionMatrix();
  }

  _animate() {
    this._clock.delta = this._clock.getDelta();
    this._tiles.update();

    this._gl.render(this._scene, this._camera);

    window.requestAnimationFrame(this._animate.bind(this));
  }
}

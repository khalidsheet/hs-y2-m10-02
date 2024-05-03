import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Color,
  DirectionalLight,
  SpotLight,
  Group,
  SpotLightHelper,
  Clock,
} from "three";
import { gsap } from "gsap";

import resources from "./Resources";

const CONFIG = {
  light: {
    ambientLightIntesity: 5,
    background: "#f4d9ed",
    envMapIntensity: 1,
    spotLightIntensity: 0,
  },
  dark: {
    ambientLightIntesity: 0,
    background: 0x02040a,
    envMapIntensity: 0.13,
    spotLightIntensity: 400,
  },
};

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
    this._camera.position.x = 3;
    this._camera.position.y = 2.3;
    this._camera.position.z = 8;
    this._camera.lookAt(0, 2.2, 0);

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
    await resources.load();

    // INIT SCENE
    this._initScene();

    // INIT LIGHTS
    this._initights();

    this.__initStarterAnimations();
  }

  _initScene() {
    // SCENE // ENVMAP
    this._scene.background = new Color("#000000");

    // TV
    const tv = resources.get("car");
    this._parent.add(tv.scene);

    // SCREEN
    this._scene.add(this._parent);
  }

  _initights() {
    // DIRECTIONAL
    const dl = new DirectionalLight();
    dl.position.set(4, 0, 5);
    dl.lookAt(0, 0, 0);
    dl.intensity = 0;
    this._dl = dl;
    this._scene.add(dl);
    const dlh = new SpotLightHelper(dl);
    this._scene.add(dlh);

    // // SPORTLIGHT
    const sl = new SpotLight();
    sl.intensity = 0;
    sl.position.set(0, 5, 5);
    this._sl = sl;

    const sl2 = new SpotLight();
    sl2.intensity = 0;
    sl2.position.set(2, 5, -5);
    this._sl2 = sl2;
    this._scene.add(sl, sl2);
  }

  changeVersion() {
    this._version = this._version === "light" ? "dark" : "light";
    //this._scene.background = new Color(CONFIG[this._version].background)

    const config = CONFIG[this._version];

    // BACKGROUND
    const color = new Color(config.background);
    gsap.to(this._scene.background, { r: color.r, b: color.b, g: color.g });

    // ENVMAP
    this._scene.traverse((el) => {
      if (el.isMesh && el.material.envMapIntensity) {
        const { material } = el;
        gsap.to(material, { envMapIntensity: config.envMapIntensity });
      }
    });
  }

  __initStarterAnimations() {
    gsap.to(this._camera.position, {
      z: 8,
      x: 3,
      y: 2.3,
      duration: 1,
      delay: 1,
      ease: "power2.inOut",
    });

    const toColor = new Color("#f1f1f1");
    gsap.to(this._sl, {
      intensity: 700,
      duration: 2,
      delay: 1,
    });

    gsap.to(this._sl2, {
      intensity: 700,
      duration: 2,
      delay: 1.8,
    });

    gsap.to(this._dl, {
      intensity: 10,
      duration: 2,
      delay: 2,
    });

    gsap.to(this._scene.background, {
      r: toColor.r,
      g: toColor.g,
      b: toColor.b,
      duration: 2,
      delay: 4,
    });
  }

  _initEvents() {
    window.addEventListener("resize", this._resize.bind(this));
  }

  _resize() {
    this._gl.setSize(window.innerWidth, window.innerHeight);

    const aspect = window.innerWidth / window.innerHeight;
    this._camera.aspect = aspect;
    this._camera.updateProjectionMatrix();
  }

  _animate() {
    this._clock.delta = this._clock.getDelta();

    this._parent.rotation.y = this._clock.elapsedTime * -1 * 0.3;
    this._parent.position.y = Math.sin(this._clock.elapsedTime * 0.9) * 0.1;

    this._gl.render(this._scene, this._camera);

    window.requestAnimationFrame(this._animate.bind(this));
  }
}

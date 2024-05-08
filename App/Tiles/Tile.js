import { Mesh, Group, PlaneGeometry, MeshBasicMaterial } from "three";
import { damp } from "maath/easing";
export class Tile extends Group {
  constructor() {
    super();
  }

  createTiles(width = 1, height = 1, count = 1, space = 50) {
    for (let i = 0; i < count; i++) {
      const tile = this.createSingleTile(width, height);
      tile.position.x = i * (space + width);
      tile.userData.newPosition = tile.position.clone();
      this.add(tile);
    }

    return this;
  }

  createSingleTile(width, height) {
    const geometry = new PlaneGeometry(width, height);
    const material = new MeshBasicMaterial();
    const mesh = new Mesh(geometry, material);

    return mesh;
  }

  update() {
    this.children.forEach((tile) => {
      damp(tile.position, "x", tile.userData.newPosition.x, 0.25);
    });
  }
}

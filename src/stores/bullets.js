import { defineStore } from 'pinia'
import * as PIXI from 'pixi.js'

export const useBulletsStore = defineStore({
  id: 'bullets',
  state: () => ({
    _bullets: []
  }),
  getters: {
    GetBullets: (state) => state._bullets
  },
  actions: {
    DrawBullets(x, y, size) {
        //3.) Create a Bullet Graphics...
        var BulletGraphics = new PIXI.Graphics();


        BulletGraphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        BulletGraphics.beginFill(0xDE3249, 1);
        BulletGraphics.drawCircle(x, y, size);
        BulletGraphics.endFill();

        this._bullets.push(BulletGraphics);

        return BulletGraphics;
    }
  }
})

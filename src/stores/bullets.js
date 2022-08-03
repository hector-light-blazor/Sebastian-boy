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
    GetBull(){
      
      return [...this._bullets];
    },
    DrawBullets(x, y, size) {
        var found = false;
        //3.) Create a Bullet Graphics...
        var BulletGraphics = new PIXI.Graphics();


        BulletGraphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        BulletGraphics.beginFill(0xDE3249, 1);
        BulletGraphics.drawCircle(x, y, size);
        BulletGraphics.endFill();


        //Need to make sure it doesnt intersect with another bullet..
        for(var i = 0; i < this._bullets.length; i++){
            let cBox = BulletGraphics.getBounds();
            let lBox = this._bullets[i].getBounds();
            if(this.rectIntersect(cBox, lBox)){
              found = true; 
              break;
            }

        }
        if(!found){
          this._bullets.push(BulletGraphics);

          return BulletGraphics;
        }

        return null;
       
    },
    rectIntersect(box1, box2){
      let aBox = box1;
      let bBox = box2;
      return aBox.x + aBox.width > bBox.x &&
             aBox.x < bBox.x + bBox.width &&
             aBox.y + aBox.height > bBox.y &&
             aBox.y < bBox.y + bBox.height;
    }
  }
})

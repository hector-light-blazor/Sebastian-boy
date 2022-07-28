import { defineStore } from 'pinia'
import * as PIXI from 'pixi.js'
import player from "@/assets/players/rockets.png"
import astone from "@/assets/players/astone.gif"
import sun from "@/assets/players/sun.png"

export const usePlayerStore = defineStore({
  id: 'player',
  state: () => ({
    good: '💓',
    bad: '❤',
    hearts: [],
    enemies: [],
    player: new PIXI.Sprite.from(player),
    planet: new PIXI.Sprite.from(sun),
    _playerSize: 60,
    _enemySize: 100
  }),
  getters: {
    GetLife: (state) => state.hearts,
    GetPlayer: (state) => state.player,
    GetEnemies: (state) => state.enemies,
    GetPlanet: (state) => state.planet
  },
  actions: {
    SetupSize(app) {
       //center sprites anchor point
       this.player.anchor.set(0.5, 0.5);

       this.player.width = this._playerSize;
       this.player.height = this._playerSize;

       // Configuration:
       // X AND Y Position: Move the Ship to center below...
       this.player.x = app.screen.width / 2;
       this.player.y = app.screen.height - (this.player.height + 80);
    },
    SetupPlanet(app){
       this.planet.anchor.set(0.5, 0.5);
       this.planet.width = 100;
       this.planet.height = 100;

       // Configuration:
       // X AND Y Position: Move the Ship to center below...
       this.planet.x = app.screen.width / 2;
       this.planet.y = app.screen.height - (this.planet.height - 15);

    },
    SetupEnimies(size, appWidth){
      for(var i = 0; i < size; i++){
        var texture = new PIXI.Sprite.from(astone);
       
        texture.anchor.set(0.5, 0.5)
        texture.width  = this._enemySize;
        texture.height = this._enemySize;
        texture.x = Math.floor(Math.random() * appWidth);
        texture.y = -(Math.floor(Math.random() * appWidth));
        this.enemies.push(texture);
      }
    },
    SetupHearts(size) {
      for(var i = 0; i < size; i++){
        this.hearts.push(this.good);
      }
   },
   takeHeart(){
      for(var i=this.hearts.length-1;i>=0;i--){
        let holder = this.hearts[i]
        if(holder != this.bad){
           this.hearts[i] = this.bad;
           break;
        }
      }
   },
   addEnemyStage(stage){
      for(var i = 0; i < this.enemies.length; i++){
        stage.addChild(this.enemies[i])
      }
   },
   rectIntersect(enemy){
     let aBox = enemy.getBounds();
     let bBox = this.player.getBounds();
     return aBox.x + aBox.width > bBox.x &&
            aBox.x < bBox.x + bBox.width &&
            aBox.y + aBox.height > bBox.y &&
            aBox.y < bBox.y + bBox.height;
   }
  }
})

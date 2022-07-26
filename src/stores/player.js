import { defineStore } from 'pinia'
import * as PIXI from 'pixi.js'
import player from "@/assets/players/rockets.png"

export const usePlayerStore = defineStore({
  id: 'player',
  state: () => ({
    good: '💓',
    bad: '❤',
    hearts: [],
    player: PIXI.Sprite.from(player),
    size: 60
  }),
  getters: {
    GetLife: (state) => state.hearts,
    GetPlayer: (state) => state.player
  },
  actions: {
    SetupSize(app) {
       //center sprites anchor point
       this.player.anchor.set(0.5, 0.5);

       this.player.width = this.size;
       this.player.height = this.size;

       // Configuration:
       // X AND Y Position: Move the Ship to center below...
       this.player.x = app.screen.width / 2;
       this.player.y = app.screen.height - (this.player.height - 15);
    },
    SetupHearts(size) {
      for(var i = 0; i < size; i++){
         this.hearts.push(this.good);
      }
   }
  }
})

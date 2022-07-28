import { defineStore } from 'pinia'
import * as PIXI from 'pixi.js'
import BG from "@/assets/stages/bg_global.png"
import BG2 from "@/assets/players/explosion1.png"


export const useBackgroundStore = defineStore({
  id: 'background',
  state: () => ({
    background: PIXI.Sprite.from(BG),
    size: 60
  }),
  getters: {
    GetBackGround: (state) => state.background
  },
  actions: {
    Setup(app) {
        this.background = PIXI.Sprite.from(BG)
      
        // this.background.width = app.screen.width;
        // this.background.height = app.screen.height;
      }
  }
})

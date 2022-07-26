import { defineStore } from 'pinia'
import * as PIXI from 'pixi.js'
import BG from "@/assets/stages/bg_global.png"

export const useBackgroundStore = defineStore({
  id: 'background',
  state: () => ({
    default: "~/assets/stages/bg_global.png",
    background: PIXI.Sprite.from(BG),
    size: 60
  }),
  getters: {
    GetBackGround: (state) => state.background
  },
  actions: {
    Setup() {
        this.background = PIXI.Sprite.from(this.default)
      }
  }
})

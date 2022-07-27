import { defineStore } from 'pinia'
import * as PIXI from 'pixi.js'


export const useEngineStore = defineStore({
  id: 'pixi',
  state: () => ({
    _application: null,
  }),
  getters: {
    GetApplication: (state) => state._application,
    GetView: (state) => state._application.view
  },
  actions: {
    SetupEngine() {
            this._application = new PIXI.Application({
                autoResize: true,
              resolution: devicePixelRatio 
            });
    }
  }
})

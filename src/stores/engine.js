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

            //To get the desire widthRatio need to devide buy the device pixel ratio.
            // Ex. if the ration is 2. What ever you set the width will be multiplied by 2.
            // Divindig the innnerWidth of the window will ensure to give you the correct width ratio.

            const widthRatio = window.innerWidth / devicePixelRatio;
            const heightRatio = window.innerHeight / devicePixelRatio;
           
            this._application = new PIXI.Application({
              autoResize: true,
              width: widthRatio,
              height: heightRatio,
              resolution: devicePixelRatio
            });
    }
  }
})

<script setup>
import { RouterView } from 'vue-router'
import { useEngineStore } from '@/stores/engine'
import * as PIXI from 'pixi.js'


const app = useEngineStore();
app.SetupEngine();

document.body.appendChild(app.GetView);



// Resize function window
const resize = () => {
   // Resize the renderer
	app.GetApplication.renderer.resize(window.innerWidth, window.innerHeight);
}

   // Listen for window resize events
   window.addEventListener('resize', resize);
resize();



</script>

<template>
   <RouterView />
</template>

<style scoped>

</style>
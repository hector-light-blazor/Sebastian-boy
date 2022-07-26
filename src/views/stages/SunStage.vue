<script setup>
    import { onMounted, reactive } from "vue"
    import { useBackgroundStore } from '@/stores/background'
    import { usePlayerStore } from '@/stores/player'
    import { useBulletsStore } from '@/stores/bullets'


    import * as PIXI from 'pixi.js'
    
  
    //make keys reactive and
    const keyboard = reactive({ keys: {}
    
    })


    const app = new PIXI.Application({
            autoResize: true,
            resolution: window.devicePixelRatio || 1,
    });

    const player = usePlayerStore()
    
    //Setup Size of the player hearts..
    player.SetupHearts(12)

    const bullets = useBulletsStore()

    //GLOBAL VARIABLES...
    const PLAYER_DIRECTION = 5;
    const KEY_UP = 38;
    const KEY_DOWN = 40;
    const KEY_LEFT = 37;
    const KEY_RIGHT = 39;


    const KEY = {
        UP_ARROW:   38,
        DOWN_ARROW: 40,
        LEFT_ARROW: 37,
        RIGHT_ARROW: 39,
        SPACE_BAR: 32
    }

    const LIMIT_PLAYER_DOWN = 310;
    const LIMIT_PLAYER_UP = 35;
    const LIMIT_PLAYER_LEFT = 35;
    const LIMIT_PLAYER_RIGHT = 565


 // add game ticket to handle animation..
        const gameLoop = () => {

            if(keyboard.keys[KEY_UP]){

                if(app.screen.contains(player.GetPlayer.x, 
                    (player.GetPlayer.y - PLAYER_DIRECTION))){
                        
                    player.GetPlayer.y -= PLAYER_DIRECTION
                }
            }else if(keyboard.keys[KEY_DOWN]){
                if(app.screen.contains(player.GetPlayer.x, 
                    (player.GetPlayer.y + PLAYER_DIRECTION))){
                    player.GetPlayer.y += PLAYER_DIRECTION
                   
                }
            }
            else if(keyboard.keys[KEY_LEFT]){
                 if(app.screen.contains((player.GetPlayer.x - PLAYER_DIRECTION), 
                    player.GetPlayer.y)){
                    player.GetPlayer.x -= PLAYER_DIRECTION
                }
            }
            else if(keyboard.keys[KEY.RIGHT_ARROW]){
                if(app.screen.contains((player.GetPlayer.x + PLAYER_DIRECTION), 
                    player.GetPlayer.y)){
                    player.GetPlayer.x += PLAYER_DIRECTION
                
                }
            }

            if(keyboard.keys[KEY.SPACE_BAR]){
                // Draw the bullet in the intial location of the player view..
                // Check first if the bullet is within the screen..
                if(app.screen.contains(player.GetPlayer.x, (player.GetPlayer.y - player.GetPlayer.height))){
                    app.stage.addChild(
                        
                        bullets.DrawBullets(player.GetPlayer.x, player.GetPlayer.y - player.GetPlayer.height, 8))
                }
            }
            
        }

        const KeyDown = (e) =>{
             keyboard.keys[e.keyCode] = true;
        }

        const KeyUp = (e) => {
            keyboard.keys[e.keyCode] = false;
        }



          //redraw the bullets..
        const animate = () => {  
         requestAnimationFrame(animate);

        if(bullets.GetBullets.length > 0){
            // Change the last bullet to the beginning
            for(var b=bullets.GetBullets.length-1;b>=0;b--){
                bullets.GetBullets[b].position.y -= PLAYER_DIRECTION;
              }

            //TODO: Figure out the probably of removing bullets..
            // // Remove Graphics when out of stage..
            // for( var i = 0; i < bullets.GetBullets.length; i++){ 
            //     if (!app.screen.contains(bullets.GetBullets[i].position.x, bullets.GetBullets[i].position.y)){
            //         app.stage.removeChild(bullets.GetBullets[i]);
            //         bullets.GetBullets.splice(i, 1); 
            //     }
            // }
        }
            app.render(app.stage);
        }


         // start animating
         animate();  


    onMounted(() => {


        
        player.SetupSize(app);

        document.querySelector("#container").appendChild(app.view);

        app.stage.addChild(useBackgroundStore().GetBackGround);

        app.stage.addChild(player.GetPlayer);

        //Animation Event Loop
        app.ticker.add(gameLoop);

        //Capture Keyboard Events..
          
    window.addEventListener('keydown',KeyDown,true);

    window.addEventListener('keyup',KeyUp,true);


    })


    // // Where to add the canvas element
    // 
</script>
<style scoped>

ul{
    position: absolute;
    left: 50%;
    margin-left: -430px;
    z-index: 9999;
    list-style-type:none
}
ul > li{
    float: left;
}
</style>

<template>
  <div style="position: relative;">
        <ul>
            <li v-for="heart in player.GetLife" :key="heart" >
                {{heart}}
            </li>
        </ul>

    <main id="container">
        
        
    </main>
  </div>
</template>

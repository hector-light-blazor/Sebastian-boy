<script setup>
    import { onMounted, reactive } from "vue"
    import { useBackgroundStore } from '@/stores/background'
    import { usePlayerStore } from '@/stores/player'
    import { useBulletsStore } from '@/stores/bullets'
    import { useEngineStore } from '@/stores/engine'
    
  
    //make keys reactive and
    const keyboard = reactive({ keys: {}})


    const app = useEngineStore()

    const background = useBackgroundStore()


    const player = usePlayerStore()
    
    //Setup Size of the player hearts..
    player.SetupHearts(10)


    const bullets = useBulletsStore()

    //GLOBAL VARIABLES...
    const PLAYER_DIRECTION = 5;
    const ENEMY_DIRECTION = 2;
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

    var fps, fpsInterval, startTime, now, then, elapsed;


    // add game ticket to handle animation..
    const gameLoop = () => {
        
        if(keyboard.keys[KEY_UP]){
            
            if(app.GetApplication.screen.contains(player.GetPlayer.x, 
                    (player.GetPlayer.y - PLAYER_DIRECTION))){
                        
                        player.GetPlayer.y -= PLAYER_DIRECTION
                }
            }else if(keyboard.keys[KEY_DOWN]){
                if(app.GetApplication.screen.contains(player.GetPlayer.x, 
                    (player.GetPlayer.y + PLAYER_DIRECTION))){
                        player.GetPlayer.y += PLAYER_DIRECTION
                   
                }
            }
            else if(keyboard.keys[KEY_LEFT]){
                if(app.GetApplication.screen.contains((player.GetPlayer.x - PLAYER_DIRECTION), 
                    player.GetPlayer.y)){
                        player.GetPlayer.x -= PLAYER_DIRECTION
                }
            }
            else if(keyboard.keys[KEY.RIGHT_ARROW]){
                if(app.GetApplication.screen.contains((player.GetPlayer.x + PLAYER_DIRECTION), 
                    player.GetPlayer.y)){
                        player.GetPlayer.x += PLAYER_DIRECTION
                
                }
            }

            if(keyboard.keys[KEY.SPACE_BAR]){
                // Draw the bullet in the intial location of the player view..
                // Check first if the bullet is within the screen..
                if(app.GetApplication.screen.contains(player.GetPlayer.x, (player.GetPlayer.y - player.GetPlayer.height))){
                    app.GetApplication.stage.addChild(
                        
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

             now = Date.now();
             elapsed = now - then;


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

            if(player.GetEnemies.length > 0){
                //console.log("there is enemies to work with");
                // if enough time has elapsed, draw the next frame
    
                if (elapsed > fpsInterval) {
    
                    // Get ready for next frame by setting then=now, but also adjust for your
                    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
                    then = now - (elapsed % fpsInterval);
    
                    // Put your drawing code here
                    for(var i = 0; i < player.GetEnemies.length; i++){
                        player.GetEnemies[i].position.y += PLAYER_DIRECTION;

                        //Check if the enemy hit the player..
                        var holdEnemy = player.GetEnemies[i];
                        if(player.rectIntersect(holdEnemy)){
                            app.GetApplication.stage.removeChild(holdEnemy);
                            player.GetEnemies.splice(i, 1);
                            player.takeHeart();
                        }
                    }
    
                }
            }


            app.GetApplication.render(app.GetApplication.stage);
        }

        //aSSIGN SOME FUN VARIABLES
        fpsInterval = 1000 / 30;
        then = Date.now();
        startTime = then;

         // start animating
         animate();  


    onMounted(() => {
        
        player.SetupSize(app.GetApplication);

        //Setup background full size;;
        background.Setup(app.GetApplication);
        //Setup Enemies for this stage..
        player.SetupEnimies(100, app.GetApplication.screen.width);
        app.GetApplication.stage.addChild(background.GetBackGround);

        app.GetApplication.stage.addChild(player.GetPlayer);

        //Add every single enemy to the stages
        player.addEnemyStage(app.GetApplication.stage);
        

        //Animation Event Loop
        app.GetApplication.ticker.add(gameLoop);

        //Capture Keyboard Events..
          
    window.addEventListener('keydown',KeyDown,true);

    window.addEventListener('keyup',KeyUp,true);


    })


    // Where to add the canvas element
    
</script>
<style scoped>

ul{
    position: absolute;
    left: 0;
    z-index: 9999;
    list-style-type:none;
    padding: 0;
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
  </div>
</template>

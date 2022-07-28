<script setup>
    import { onMounted, reactive } from "vue"
    import { useBackgroundStore } from '@/stores/background'
    import { usePlayerStore } from '@/stores/player'
    import { useBulletsStore } from '@/stores/bullets'
    import { useEngineStore } from '@/stores/engine'
import { PlaneGeometry } from "pixi.js"
    
  
    //make keys reactive and
    const keyboard = reactive({ keys: {}})


    const app = useEngineStore()
    app.SetupEngine();
   

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
                    let response =  bullets.DrawBullets(player.GetPlayer.x, player.GetPlayer.y - player.GetPlayer.height, 8);

                    if(response != null){
                        app.GetApplication.stage.addChild(response)
                    }
                }
            }
            
        }

        const KeyDown = (e) =>{
            keyboard.keys[e.keyCode] = true;
             e.preventDefault();
        }

        const KeyUp = (e) => {
            keyboard.keys[e.keyCode] = false;
             e.preventDefault();
        }



          //redraw the bullets..
        const animate = () => {  
            requestAnimationFrame(animate);

             now = Date.now();
             elapsed = now - then;


          
                if (elapsed > fpsInterval) {




                            // Change the last bullet to the beginning
                            for(var b=bullets.GetBullets.length-1;b>=0;b--){
                                bullets.GetBullets[b].position.y -= PLAYER_DIRECTION;
                                var holdBullet = bullets.GetBullets[b];

                                //Check if that current bullet intersected with a enemyDirection
                                 for(var i = 0; i < player.GetEnemies.length; i++){
                                        var holdEnemy = player.GetEnemies[i];

                                        if(bullets.rectIntersect(holdBullet.getBounds(), holdEnemy.getBounds())){
                                            app.GetApplication.stage.removeChild(holdEnemy);
                                            app.GetApplication.stage.removeChild(holdBullet);
                                            bullets.GetBullets.splice(b, 1);
                                            player.GetEnemies.splice(i, 1);
                                            break;
                                        }
                                }

                          }


                              
                            // Put your drawing code here
                            for(var i = 0; i < player.GetEnemies.length; i++){
                                player.GetEnemies[i].position.y += PLAYER_DIRECTION;
    
                                //Check if the enemy hit the player..
                                var holdEnemy = player.GetEnemies[i];
                                if(player.rectIntersect(holdEnemy)){
                                    app.GetApplication.stage.removeChild(holdEnemy);
                                    player.GetEnemies.splice(i, 1);
                                    player.takeHeart();
                                }else if(!app.GetApplication.screen.contains(holdEnemy.position.x, 
                               holdEnemy.position.y) && holdEnemy.position.y > 500){
                                    console.log("The enemy is not in the square")
                                    app.GetApplication.stage.removeChild(holdEnemy);
                                    player.GetEnemies.splice(i, 1);
                                }
                            }
                              


                            //TODO: Figure out the probably of removing bullets..
                            // // Remove Graphics when out of stage..
                            // for( var i = 0; i < bullets.GetBullets.length; i++){ 
                                //     if (!app.screen.contains(bullets.GetBullets[i].position.x, bullets.GetBullets[i].position.y)){
                                    //         app.stage.removeChild(bullets.GetBullets[i]);
                            //         bullets.GetBullets.splice(i, 1); 
                            //     }
                            // }
                     
                // if(player.GetEnemies.length > 0){
                //     //console.log("there is enemies to work with");
                //     // if enough time has elapsed, draw the next frame
        
        
                     
        
        
                //     }

                       // Get ready for next frame by setting then=now, but also adjust for your
                        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
                        then = now - (elapsed % fpsInterval);
            }
            app.GetApplication.render(app.GetApplication.stage);
        }

        //aSSIGN SOME FUN VARIABLES
        fpsInterval = 1000 / 40;
        then = Date.now();
        startTime = then;

         // start animating
         animate();  


    onMounted(() => {
        document.querySelector("#map").appendChild(app.GetApplication.view);
        player.SetupSize(app.GetApplication);
        player.SetupPlanet(app.GetApplication)

        //Setup background full size;;
        background.Setup(app.GetApplication);
        //Setup Enemies for this stage..
        player.SetupEnimies(30, app.GetApplication.screen.width);
        app.GetApplication.stage.addChild(background.GetBackGround);

        app.GetApplication.stage.addChild(player.GetPlayer);
        app.GetApplication.stage.addChild(player.GetPlanet);


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
  <div style="position: relative;text-align: center; border: 1px solid red; 
  display: flex; justify-content: center;  align-items: center; height: 100vh;">
        <div>
            <ul>
                <li v-for="heart in player.GetLife" :key="heart" >
                    {{heart}}
                </li>
            </ul>
        </div>

        <div id="map">

        </div>
  </div>
</template>

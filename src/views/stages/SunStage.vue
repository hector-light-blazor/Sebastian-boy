<script setup>
    import { onMounted, reactive } from "vue"
    import { useBackgroundStore } from '@/stores/background'
    import { usePlayerStore } from '@/stores/player'
    import { useBulletsStore } from '@/stores/bullets'
    import { useEngineStore } from '@/stores/engine'
  
    //Global Temporary array..
    let holdBullets = [];
    let Enemies = [];

    //make keys reactive and
    const keyboard = reactive({ keys: {}, data: ""})
    
    //Create worker for processing game intersection with player and enemy...
    const worker = new Worker(new URL('./worker.js', import.meta.url))

    //Receive message of the worker..
    worker.onmessage = (e) => {
        
        var data = e.data;
        for(var i = 0; i < data.length; i++){
            var hBullet = null;
            var hEnemy = null;
            if(data[i].indexB != -1 && data[i].indexE != -1){
                hBullet = bullets.GetBullets[data[i].indexB];
                hEnemy = player.GetEnemies[data[i].indexE];
                app.GetApplication.stage.removeChild(hBullet);
                app.GetApplication.stage.removeChild(hEnemy);
                bullets.GetBullets.splice(data[i].indexB, 1);
                player.GetEnemies.splice(data[i].indexE, 1);
            }else if(data[i].indexB == -1){
                hEnemy = player.GetEnemies[data[i].indexE];
                app.GetApplication.stage.removeChild(hEnemy);
                player.GetEnemies.splice(data[i].indexE, 1);
            }else if(data[i].indexE == -1){
                hBullet = bullets.GetBullets[data[i].indexB];
                app.GetApplication.stage.removeChild(hBullet);
                bullets.GetBullets.splice(data[i].indexB, 1);
            }   
        } 
    }

    const app = useEngineStore()
    

    const background = useBackgroundStore()


    const player = usePlayerStore()
    
    //Setup Size of the player hearts..
    player.SetupHearts(20)


    const bullets = useBulletsStore()

    //GLOBAL VARIABLES...
    //TODO: Move them to player store..
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

                            //Test worker to send bullets..
                           // let HoldBullets = bullets.GetBullets
                            //console.log("WITH OUT WORKER", bullets.GetBull());
                            // if(bullets.GetBullets.length > 0){
                            //     worker.postMessage(bullets.GetBullets);
                            // }
                            //Reset variables
                            holdBullets = [];
                            Enemies = [];

                            // This loop will move the bullets upward
                            for(var i = 0; i < bullets.GetBullets.length; i++){
                                bullets.GetBullets[i].position.y -= PLAYER_DIRECTION;

                                var holdBullet = bullets.GetBullets[i];

                                //We will hold the bullet to send for process by the worker..
                                holdBullets.push({
                                    bounds: holdBullet.getBounds().clone(),
                                    index: i
                                });
                          }

                          


                              
                            // Put your drawing code here
                           
                            for(var i = 0; i < player.GetEnemies.length; i++){
                                player.GetEnemies[i].position.y += PLAYER_DIRECTION;
                                var holdEnemy = player.GetEnemies[i];

                                Enemies.push({
                                    bounds: holdEnemy.getBounds().clone(),
                                    index: i
                                });
                            }
                              
                            if(holdBullets.length > 0 && Enemies.length > 0){
                                
                                 worker.postMessage({be: true, 
                                 bullets: holdBullets, 
                                 enemy: Enemies,
                                 screen: app.GetApplication.screen.clone()
                                 });
                            }

        
    
                        then = now - (elapsed % fpsInterval);
            }
            app.GetApplication.render(app.GetApplication.stage);
        }

        //aSSIGN SOME FUN VARIABLES
        fpsInterval = 1000 / 40;
        then = Date.now();
        startTime = then;

         


    onMounted(() => {
        app.SetupEngine();
   
        document.querySelector("#map").appendChild(app.GetApplication.view);
       
        // start animating
         animate();  
       
        player.SetupSize(app.GetApplication);
        player.SetupPlanet(app.GetApplication)

        //Setup background full size;;
        background.Setup(app.GetApplication);
        //Setup Enemies for this stage..
        player.SetupEnimies(20, app.GetApplication.screen.width);
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
    list-style-type:none;
    padding: 0;
}
ul > li{
    float: left;
}
.heart-holder{
    position: absolute;
    left: 0;
    top: 0;
    font-size: 3em;
    z-index: 9999;
}
</style>

<template>
  <div style="position: relative;text-align: center; border: 1px solid red; 
  display: flex; justify-content: center;  align-items: center; height: 100vh;">
        
        <div class="heart-holder">
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

function rectIntersect(box1, box2){
    let aBox = box1;
    let bBox = box2;
    return aBox.x + aBox.width > bBox.x &&
           aBox.x < bBox.x + bBox.width &&
           aBox.y + aBox.height > bBox.y &&
           aBox.y < bBox.y + bBox.height;
  }


self.addEventListener('message', e => {
  
    var data = e.data;
    console.log(data)
    if(data.be){
        var bullets = data.bullets;
        var enemies = data.enemy;
        var response = [];
       
       
        for(var i = 0; i < bullets.length; i++){
            if(!rectIntersect(bullets[i].bounds, data.screen)){
                bullets.splice(i, 1);
                response.push({
                    indexB: i,
                    indexE: -1
                });
            }
        }
        
        //Loop through enemies if any is outside the screen containers.
        //add to remove list..
        for(var i = 0; i < enemies.length; i++){
            if(!rectIntersect(enemies[i].bounds, data.screen)){
                enemies.splice(i, 1);
                response.push({
                    indexB: -1,
                    indexE: i
                });
            }
        }

        //Loop bullets and collision with enemies..
        for(var i = 0; i < bullets.length; i++){
            for(var x = 0; x < enemies.length; x++){
                if(rectIntersect(bullets[i].bounds, enemies[x].bounds)){
                    response.push({
                        indexB: bullets[i].index,
                        indexE: enemies[x].index
                    });
                    break;
                }
            }
        }
        //Send Back to the main thread..
        postMessage(response);
    }
});











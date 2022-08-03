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











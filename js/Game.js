BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    this.ground = null;
    this.fullScreenToggle = null;
    this.cursors = null;
    this.groundTiles = null;
    this.moveTimer = null;
    this.portal = null;
    this.enemies = null;
    this.healthbar = null;
    this.quitButton = null;
    this.teleportSound = null;
    this.food = null;
};

BasicGame.Game.prototype = {

    create: function () {

        this.world.resize(4096, 4096);

        this.fullScreenToggle = this.input.keyboard.addKey(Phaser.Keyboard.F);
        this.fullScreenToggle.onUp.add(this.goFull, this);
        
        this.quitButton = this.input.keyboard.addKey(Phaser.Keyboard.Q);
        this.quitButton.onUp.add(this.quitGame, this);
        
        this.teleportSound = this.add.audio('teleport');

        BasicGame.levelGenerator.generate();
        
        this.portal = this.add.sprite(0,0,'portal');
        this.portal.anchor.set(0.5,0.5);
        BasicGame.levelGenerator.placePortal(this.portal);
        
        BasicGame.player.add(0, 0);
        BasicGame.levelGenerator.placePlayer(BasicGame.player);
        
        this.enemies = BasicGame.levelGenerator.placeEnemies();
        this.food = BasicGame.levelGenerator.placeFood();
        
        ;
       
        
        this.groundTiles = this.add.group();
        this.groundTiles.addMultiple(BasicGame.levelGenerator.groundTiles);
        
        
        
        for (var i = 0; i < this.food.length; i++){
            this.food[i].bringToTop();
        }
        
        this.portal.bringToTop();
        BasicGame.player.sprite.bringToTop();
        
        for (var i = 0; i < this.enemies.length; i++){
            this.enemies[i].sprite.bringToTop();
        }
        
        this.healthbar = this.add.graphics();
        this.healthbar.beginFill(0xFF0000);
        this.healthbar.drawRect(this.camera.x, this.camera.y, BasicGame.player.health * 5, 16);
        this.healthbar.cameraOffset.setTo(100, 100);
        this.healthbar.fixedToCamera = true;
        
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
    },

    update: function () {
        this.camera.follow(BasicGame.player.sprite);
        
        var playerX = BasicGame.player.sprite.x;
        var playerY = BasicGame.player.sprite.y;

        if (this.cursors.right.isDown && this.moveTimer < this.game.time.now){
            if ( this.attackEnemies(playerX + 64, playerY)){
                this.groundTiles.forEach(this.movePlayer, this, true, playerX + 64, playerY);
            }
            this.move();
            this.eatFood(playerX + 64, playerY);
            this.moveTimer = this.game.time.now + 200;

        }
        else if (this.cursors.left.isDown && this.moveTimer < this.game.time.now){
            if (this.attackEnemies(playerX - 64, playerY)) {
                this.groundTiles.forEach(this.movePlayer, this, true, playerX - 64, playerY);
            }
            this.move();
            this.eatFood(playerX - 64, playerY);
            this.moveTimer = this.game.time.now + 200;
            
        }
        else if (this.cursors.up.isDown && this.moveTimer < this.game.time.now){
            if (this.attackEnemies(playerX, playerY - 64)){
                this.groundTiles.forEach(this.movePlayer, this, true, playerX, playerY - 64);
            }
            this.move();
            this.eatFood(playerX, playerY - 64);
            this.moveTimer = this.game.time.now + 200;
            
        }
        else if (this.cursors.down.isDown && this.moveTimer < this.game.time.now){
            if (this.attackEnemies(playerX, playerY + 64)) {
                this.groundTiles.forEach(this.movePlayer, this, true, playerX, playerY + 64);
            }        
            this.move();
            this.eatFood(playerX, playerY + 64);
            this.moveTimer = this.game.time.now + 200;
        }

        
        
        
        //update healthbar
        this.healthbar.width = BasicGame.player.health * 5;
       
        
        
        
        if (BasicGame.player.health <= 0){
            this.quitGame()
        }
        
        if (BasicGame.player.sprite.x == this.portal.x && BasicGame.player.sprite.y == this.portal.y){
            this.teleportSound.play();
            this.state.start('Game');
        }
    },

    quitGame: function () {
        BasicGame.player.health = 100;
        BasicGame.player.hunger = 200;
        BasicGame.player.xp = 0;
        BasicGame.player.level = 1;
        this.state.start('MainMenu');

    },
    
    goFull: function() {
        
        if (this.scale.isFullScreen)
        {
            this.scale.stopFullScreen();
        }
        else
        {
            this.scale.startFullScreen(false);
        }

    },
    
    movePlayer: function(tile, playerX, playerY) {
        if (tile.x == playerX && tile.y == playerY){
            BasicGame.player.sprite.x = tile.x;
            BasicGame.player.sprite.y = tile.y;
        }
        
        
    },
    
    move: function() {
        
        this.moveEnemies();
        
        BasicGame.player.hunger -= 1;
        
        if (BasicGame.player.hunger > 198){
            BasicGame.player.health += 10;
        }
        else if (BasicGame.player.hunger > 185) {
            BasicGame.player.health += 1;
        }
        else if (BasicGame.player.hunger > 100) {
            
        }
        else if (BasicGame.player.hunger > 50) {
            if (BasicGame.player.health > 30){
                BasicGame.player.health -= 1;
            }
        }
        else {
            BasicGame.player.health -= 1;
        }
        
        if (BasicGame.player.health > 100){
            BasicGame.player.health = 100;
        }
        
    },
    
    moveEnemies: function() {
         for (var i = 0; i < this.enemies.length; i++){
            var enemy = this.enemies[i];
            var enemyX = enemy.sprite.x;
            var enemyY = enemy.sprite.y;
            for (var x = enemyX - (4 * 64); x < enemyX + (4 * 64); x+= 64){
                for (var y = enemyY - (4 * 64); y < enemyY + (4 * 64); y+= 64){
                    if (BasicGame.player.sprite.x == x && BasicGame.player.sprite.y == y){
                        var diffX = BasicGame.player.sprite.x - enemy.sprite.x;
                        var diffY = BasicGame.player.sprite.y - enemy.sprite.y;
                        
                        //if (Math.abs(diffX) > Math.abs(diffY)){
                            if (diffX > 0){
                                this.groundTiles.forEach(this.moveEnemy, this, true, enemyX + 64, enemyY, enemy)
                                if (enemy.sprite.x + 64 == BasicGame.player.sprite.x && enemy.sprite.y == BasicGame.player.sprite.y ){
                                    this.attackPlayer(enemy);
                                }
                            }
                            else if (diffX < 0){
                                this.groundTiles.forEach(this.moveEnemy, this, true, enemyX - 64, enemyY, enemy)
                                if (enemy.sprite.x - 64 == BasicGame.player.sprite.x && enemy.sprite.y == BasicGame.player.sprite.y )  {
                                    this.attackPlayer(enemy);
                                }
                            }
                        //}
                        //else {
                            if (diffY > 0){
                                this.groundTiles.forEach(this.moveEnemy, this, true, enemy.sprite.x, enemyY + 64, enemy)
                                if (enemy.sprite.x == BasicGame.player.sprite.x && enemy.sprite.y + 64 == BasicGame.player.sprite.y )  {
                                    this.attackPlayer(enemy);
                                }
                            }
                            else if (diffY < 0){
                                this.groundTiles.forEach(this.moveEnemy, this, true, enemy.sprite.x, enemyY - 64, enemy)
                                if (enemy.sprite.x == BasicGame.player.sprite.x && enemy.sprite.y - 64 == BasicGame.player.sprite.y )  {
                                    this.attackPlayer(enemy);
                                }
                            }
                        //}
                    } // comparison
            
                } //y loop      
            } //x loop
         }//outer loop
    }, 
    
    moveEnemy: function(tile, enemyX, enemyY, enemy) {
        var canMove = true;
        //var isPlayer = false;
        for (var i = 0; i < this.enemies.length; i++){
            if (this.enemies[i].sprite.x == enemyX && this.enemies[i].sprite.y == enemyY){
                canMove = false;
            }
        }
        if (enemyX == BasicGame.player.sprite.x && enemyY == BasicGame.player.sprite.y ){
            canMove = false;
        }
        if (tile.x == enemyX && tile.y == enemyY && canMove){
            enemy.sprite.x = tile.x;
            enemy.sprite.y = tile.y;
        }
        
    },
    
    attackEnemies: function(x,y){
        for (var i = 0; i < this.enemies.length; i++){
            if (this.enemies[i].sprite.x == x && this.enemies[i].sprite.y == y && this.enemies[i].sprite.alive){
                //BasicGame.player.health -= this.enemies[i].getDamage();
                this.enemies[i].health -= BasicGame.player.getDamage();
                
                //BasicGame.player.hurtSound.play();
                
                if (this.enemies[i].health <= 0){
                    BasicGame.player.gainExperience(10);
                    this.enemies[i].sprite.kill();
                }
                return false;
            } 
        }
        return true;
    },
    
    attackPlayer: function(enemy){
        if (enemy.sprite.alive){
            BasicGame.player.health -= enemy.getDamage();
            BasicGame.player.hurtSound.play();
        }
    },
    
    eatFood: function(x,y){
        for (var i = 0; i < this.food.length; i++){
            if (this.food[i].x == x && this.food[i].y == y && this.food[i].alive){
                this.food[i].kill();
                BasicGame.player.hunger = 200;
            } 
        
        }
    }

};
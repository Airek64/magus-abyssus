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
};

BasicGame.Game.prototype = {

    create: function () {

        this.world.resize(4096, 4096);

        this.fullScreenToggle = this.input.keyboard.addKey(Phaser.Keyboard.F);
        this.fullScreenToggle.onUp.add(this.goFull, this);

        BasicGame.levelGenerator.generate();
        
        this.portal = this.add.sprite(0,0,'portal');
        this.portal.anchor.set(0.5,0.5);
        BasicGame.levelGenerator.placePortal(this.portal);
        
        BasicGame.player.add(0, 0);
        BasicGame.levelGenerator.placePlayer(BasicGame.player);
        
        this.enemies = BasicGame.levelGenerator.placeEnemies();
        
        this.groundTiles = this.add.group();
        this.groundTiles.addMultiple(BasicGame.levelGenerator.groundTiles);
        
        for (var i = 0; i < this.enemies.length; i++){
            this.enemies[i].sprite.bringToTop();
        }
        
        this.portal.bringToTop();
        BasicGame.player.sprite.bringToTop();
        
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
    },

    update: function () {
        this.camera.follow(BasicGame.player.sprite);
        
        var playerX = BasicGame.player.sprite.x;
        var playerY = BasicGame.player.sprite.y;

        if (this.cursors.right.isDown && this.moveTimer < this.game.time.now && this.attackEnemies(playerX + 64, playerY)){
            
            this.groundTiles.forEach(this.movePlayer, this, true, playerX + 64, playerY);
            this.moveTimer = this.game.time.now + 200;
        }
        else if (this.cursors.left.isDown && this.moveTimer < this.game.time.now && this.attackEnemies(playerX - 64, playerY)){
            this.groundTiles.forEach(this.movePlayer, this, true, playerX - 64, playerY);
            this.moveTimer = this.game.time.now + 200;
        }
        else if (this.cursors.up.isDown && this.moveTimer < this.game.time.now && this.attackEnemies(playerX, playerY - 64)){
            this.groundTiles.forEach(this.movePlayer, this, true, playerX, playerY - 64);
            this.moveTimer = this.game.time.now + 200;
        }
        else if (this.cursors.down.isDown && this.moveTimer < this.game.time.now && this.attackEnemies(playerX, playerY + 64)){
            this.groundTiles.forEach(this.movePlayer, this, true, playerX, playerY + 64);
            this.moveTimer = this.game.time.now + 200;
        }

        if (BasicGame.player.sprite.x == this.portal.x && BasicGame.player.sprite.y == this.portal.y){
            this.state.start('Game');
        }
    },

    quitGame: function (pointer) {

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
    
    attackEnemies: function(x,y){
        for (var i = 0; i < this.enemies.length; i++){
            if (this.enemies[i].sprite.x == x && this.enemies[i].sprite.y == y && this.enemies[i].sprite.isAlive){
                BasicGame.player.health -= this.enemies[i].getDamage();
                this.enemies[i].health -= BasicGame.getDamage();
                if (this.enemies[i].health <= 0){
                    BasicGame.player.gainExperience(10);
                    this.enemies[i].sprite.kill();
                }
                return false;
            } 
        }
        return true;
    }

};
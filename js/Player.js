BasicGame.Player = function(game) {
    
    this.game = game;
    this.health = 100;
    this.hunger = 200;
    this.maxDamageMult = null;
    this.minDamageMult = null;
    this.level = 1;
    this.xp = 0;
    this.sprite = null;
    this.cursors;
    this.hurtSound;

    
}

BasicGame.Player.prototype = {
 
    add: function (x,y){
        //add sprite
        this.sprite = this.game.add.sprite(x, y, 'player');
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.anchor.set(0.5,0.6);
        //this.sprite.body.setSize(62, 80);
        
        //this.health = 100;
        this.maxDamageMult = 5;
        this.minDamageMult = 3;
//        this.level = 1;
//        this.xp = 0;
        
        this.hurtSound = this.game.add.audio('hurt');
//        this.hurtSound = this.game.add.audio('hurt');

        
        this.cursors = this.game.input.keyboard.createCursorKeys();
    },
    
    getDamage: function() {
        return 5 * this.game.rnd.integerInRange(this.minDamageMult + this.level, this.maxDamageMult + this.level);
    },
    
    gainExperience: function(xp) {
        this.xp += xp;
        if (this.xp > 100 + (25 * (this.level -1))){
            this.level++;
        }
    }
    
}
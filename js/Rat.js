BasicGame.Rat = function(game) {
    
    this.game = game;
    this.health = null;
    this.sprite = null;
    this.maxDamageMult = null;
    this.minDamageMult = null;
    this.hurtSound;

    
}

BasicGame.Rat.prototype = {
 
    add: function (x,y){
        //add sprite
        this.sprite = this.game.add.sprite(x, y, 'rat');
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.anchor.set(0.5,0.5);
        //this.sprite.body.setSize(62, 80);
        
        this.health = 50;
        this.maxDamageMult = 5;
        this.minDamageMult = 2;
        
//        this.hurtSound = this.game.add.audio('hurt');

        
        this.cursors = this.game.input.keyboard.createCursorKeys();
    
    },
    
    getDamage: function() {
        return 5 * this.game.rnd.integerInRange(this.minDamageMult, this.maxDamageMult);
    }
    
}
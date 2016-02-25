
BasicGame.MainMenu = function (game) {

    this.style = null;
    this.text = null;
    this.fullSceenToggle = null;
    this.comfirmButton = null;
};

BasicGame.MainMenu.prototype = {

	create: function () {

        this.style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

        this.text = this.game.add.text(0, 0, "Start", this.style);
        this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        
        this.text.setTextBounds(0, 100, 800, 100);
        
        this.fullScreenToggle = this.input.keyboard.addKey(Phaser.Keyboard.F);
        this.fullScreenToggle.onUp.add(this.goFull, this);
        this.confirmButton = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.confirmButton.onUp.add(this.startGame, this);
	},

	update: function () {

	},

	startGame: function (pointer) {
		this.state.start('Game');
	},    
    
    goFull: function(pointer){

        if (this.scale.isFullScreen){
            this.scale.stopFullScreen();
        } else {
            this.scale.startFullScreen(false);
        }
    }
    
};
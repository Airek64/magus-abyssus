
BasicGame.MainMenu = function (game) {

    this.style = null;
    this.style2 = null;
    this.text = null;
    this.text2 = null;
    this.fullSceenToggle = null;
    this.comfirmButton = null;
};

BasicGame.MainMenu.prototype = {

	create: function () {

        this.add.sprite(60, 100, 'title');
        
        this.style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.style2 = { font: "bold 16px Arial", fill: "#877", boundsAlignH: "center", boundsAlignV: "middle" };

        this.text = this.game.add.text(130, 350, "Press Enter to Start", this.style);
        this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        
        this.text2 = this.game.add.text(0,700, "Press F to toggle Full Screen", this.style2);
        this.text2.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        
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
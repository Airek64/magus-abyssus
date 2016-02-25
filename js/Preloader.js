
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

        this.load.image('title', 'assets/Title.png');
		this.load.image('player', 'assets/character-sketch.png');
        this.load.image('ground', 'assets/GroundTile.png');
        this.load.image('wall', 'assets/WallTile.png');
        this.load.image('portal', 'assets/vortex.png');
        this.load.image('food', 'assets/Apple.png');
        this.load.image('rat', 'assets/Rat.png');
        this.load.audio('hurt', 'assets/Hit_Hurt.ogg');
        this.load.audio('teleport', 'assets/Teleport.ogg');
	},

	create: function () {
        BasicGame.player = new BasicGame.Player(this.game);
        BasicGame.levelGenerator = new BasicGame.LevelGenerator(this.game);

	},

	update: function () {

			this.state.start('MainMenu');

	}

};
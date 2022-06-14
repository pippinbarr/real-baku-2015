
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar

		this.game.stage.backgroundColor = "#000000";
		this.preloaderBar = this.add.sprite(0, 0, 'preloaderBar');
		this.preloaderBar.scale.set(12,12);
		this.preloaderBar.anchor.y = 0.5;
		this.preloaderBar.y = this.game.height/2;

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.

		this.load.setPreloadSprite(this.preloaderBar);

		//	Here we load the rest of the assets our game needs.
		//	You can find all of these assets in the Phaser Examples repository

		this.load.atlasJSONHash('atlas','assets/atlas/atlas.png',"assets/atlas/atlas.json",null);

		this.load.audio('bip',['assets/sounds/bip.mp3','assets/sounds/bip.ogg']);
		this.load.audio('step',['assets/sounds/step.mp3','assets/sounds/step.ogg']);
		this.load.audio('splash',['assets/sounds/splash.mp3','assets/sounds/splash.ogg']);
		this.load.audio('whistle',['assets/sounds/whistle.mp3','assets/sounds/whistle.ogg']);
		this.load.audio('bars',['assets/sounds/bars.mp3','assets/sounds/bars.ogg']);
		this.load.audio('record',['assets/sounds/record.mp3','assets/sounds/record.ogg']);
		this.load.audio('jingle',['assets/sounds/jingle.mp3','assets/sounds/jingle.ogg']);

		this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.xml');

		language = document.getElementById("bakugames").getAttribute("data-language");
		if (language == null) language = "en";

		this.load.json('texts','assets/json/texts-' + language + '.json',true);
	},

	create: function () {

		this.state.start('Title');

	}

};

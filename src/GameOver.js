var BUTTON_MOVE_AMOUNT = 2;


BasicGame.GameOver = function (game) {

  //	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

  this.game;		//	a reference to the currently running game
  this.add;		//	used to add sprites, text, groups, etc
  this.camera;	//	a reference to the game camera
  this.cache;		//	the game cache
  this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
  this.load;		//	for preloading assets
  this.math;		//	lots of useful common math operations
  this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
  this.stage;		//	the game stage
  this.time;		//	the clock
  this.tweens;    //  the tween manager
  this.state;	    //	the state manager
  this.world;		//	the game world
  this.particles;	//	the particle manager
  this.physics;	//	the physics manager
  this.rnd;		//	the repeatable random number generator

  //	You can use any of these from any function within this State.
  //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.GameOver.prototype = {

  create: function () {

    this.gameOverSound = this.add.audio('bars',0.25,false);

    texts = this.cache.getJSON('texts').gameover;

    this.game.stage.backgroundColor = "#000000";

    this.bg = this.game.add.sprite(0,0,'atlas','game_over/bg/game_over_bg.png');
    this.bg.scale.set(12,12);

    this.avatar = this.game.add.sprite(0,0,'atlas','game_over/avatar/game_over_avatar.png');
    this.avatar.scale.set(12,12);
    this.avatar.x = 12*12;
    this.avatar.y = 22*12;
    this.avatar.tint = TINT;


    this.gameOverText = this.game.add.bitmapText(0, 0, 'font', texts.gamesover,36 + texts.gamesoverSizeAdjustment);
    this.gameOverText.tint = 0xFFFF00;
    this.gameOverText.anchor.x = 0.5;
    this.gameOverText.x = this.game.width/2;
    this.gameOverText.y = 2*12;


    var messageStrings = texts.message;
    this.messageTexts = [];
    var messageY = this.gameOverText.y + this.gameOverText.height + 2*12;

    for (var i = 0; i < messageStrings.length; i++)
    {
      this.messageTexts[i] = this.game.add.bitmapText(0, 0, 'font',messageStrings[i],16 + texts.messageSizeAdjustment);
      this.messageTexts[i].tint = 0xFFFFFF;
      this.messageTexts[i].anchor.x = 0.5;
      this.messageTexts[i].x = this.game.width/2;
      this.messageTexts[i].y = messageY;
      messageY += this.messageTexts[i].height + 0.5*12;// this.game.height/3 + (i - (messageStrings.length-1)/2) * 18;
    }

    this.bg.visible = false;
    this.avatar.visible = false;
    this.gameOverText.visible = false;
    for (var i = 0; i < this.messageTexts.length; i++) this.messageTexts[i].visible = false;

    this.time.events.add(Phaser.Timer.SECOND * 1, this.showCell, this);
  },


  showCell: function ()
  {
    this.bg.visible = true;
    this.avatar.visible = true;

    this.time.events.add(Phaser.Timer.SECOND * 1, this.showScreen, this);
  },


  showScreen: function ()
  {
    this.gameOverSound.play();

    this.gameOverText.visible = true;
    for (var i = 0; i < this.messageTexts.length; i++) this.messageTexts[i].visible = true;

    this.time.events.add(Phaser.Timer.SECOND * 5, this.nextState, this);

  },


  update: function ()
  {

  },


  nextState: function ()
  {
    this.game.state.start('EndScreen');
  }
};

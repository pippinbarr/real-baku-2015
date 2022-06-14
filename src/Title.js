
BasicGame.Title = function (game) {

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

BasicGame.Title.prototype = {

  create: function () {

    this.game.input.maxPointers = 1;

    ga('send','event','Game','Load');

    this.titleTexts = this.cache.getJSON('texts').title;
    this.uiTexts = this.cache.getJSON('texts').ui;


    this.jingleSound = this.add.audio('jingle',0.25,false);
    this.barsSound = this.add.audio('bars',0.25,false);
    this.titleSound = this.add.audio('record',0.1,false);


    this.game.stage.backgroundColor = "#000000";

    this.bg = this.game.add.sprite(0,0,'atlas','title/bg/title_bg.png');
    this.bg.scale.set(12,12);

    this.baku2015Text = this.game.add.bitmapText(0, 0, 'font', this.titleTexts.title,30 + this.titleTexts.titleSizeAdjustment);
    this.baku2015Text.tint = 0xFFFF00;
    this.baku2015Text.anchor.x = 0.5;
    this.baku2015Text.anchor.y = 0.5;
    this.baku2015Text.x = this.game.width/2;
    this.baku2015Text.y = 3*this.game.height/4;

    this.baku2015Text.visible = false;

    this.bars = this.game.add.sprite(0,0,'atlas','title/bars/title_bars.png');
    this.bars.scale.set(12,12);
    this.bars.y = -this.bars.height;

    this.barSpeed = 0;

    if (!this.game.device.desktop) {
      playString = this.uiTexts.touchPlay;
      playSizeAdjustment = this.uiTexts.touchPlaySizeAdjustment;
    }
    else {
      playString = this.uiTexts.clickPlay;
      playSizeAdjustment = this.uiTexts.clickPlaySizeAdjustment;
    }

    this.playText = this.game.add.bitmapText(0, 0, 'font', playString,16 + playSizeAdjustment);
    this.playText.tint = 0xFFFF00;
    this.playText.anchor.x = 0.5;
    this.playText.anchor.y = 0;
    this.playText.x = this.game.width/2;
    this.playText.y = 36*12;

    this.playText.visible = false;


    this.checkPlay = false;


    this.time.events.add(Phaser.Timer.SECOND * 2.5, this.showBaku, this);

    this.jingleSound.play();
  },


  showBaku: function ()
  {
    this.titleSound.play();

    this.baku2015Text.visible = true;
    this.time.events.add(Phaser.Timer.SECOND * 1, this.showBars, this);
  },


  showBars: function ()
  {
    this.barSpeed = 20;
  },


  update: function ()
  {
    this.bars.y += this.barSpeed;
    if (this.bars.y > 0)
    {
      this.bars.y = 0;
      this.barSpeed = 0;

      this.barsSound.play();

      this.time.events.add(Phaser.Timer.SECOND * 1, this.showPlay, this);
    }

    if (this.checkPlay && this.game.input.activePointer.justReleased(30))
    {
      // Go to next screen
      this.time.events.add(Phaser.Timer.SECOND * 1, this.nextState, this);

      this.bg.visible = false;
      this.bars.visible = false;
      this.baku2015Text.visible = false;
      this.playText.visible = false;
    }
  },


  showPlay: function ()
  {
    this.playText.visible = true;
    this.checkPlay = true;
    this.time.events.add(Phaser.Timer.SECOND * 0.5, this.flashPlay, this);
  },


  flashPlay: function ()
  {
    if (!this.bg.visible) return;

    this.playText.visible = !this.playText.visible;
    this.time.events.add(Phaser.Timer.SECOND * 0.5, this.flashPlay, this);
  },


  nextState: function ()
  {
    ga('send','event','Game','Start');
    this.game.state.start('Message');
  }

};

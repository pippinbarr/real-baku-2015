

BasicGame.Message = function (game) {

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

BasicGame.Message.prototype = {

  create: function () {

    this.texts = this.cache.getJSON('texts').message;
    this.uiTexts = this.cache.getJSON('texts').ui;

    this.game.stage.backgroundColor = "#000000";

    this.flag = this.game.add.sprite(0,0,'atlas','message/message_flag.png');
    this.flag.scale.set(12,12);
    this.flag.anchor.x = 0.5;
    this.flag.x = this.game.width/2;
    this.flag.y = 4*12;

    var messageStrings = this.texts.message;
    this.messageTexts = [];
    for (var i = 0; i < messageStrings.length; i++)
    {
      this.messageTexts[i] = this.game.add.bitmapText(0, 0, 'font',messageStrings[i],16 + this.texts.messageSizeAdjustment);
      this.messageTexts[i].tint = 0xFFFFFF;
      this.messageTexts[i].anchor.x = 0.5;
      this.messageTexts[i].anchor.y = 0.5;
      this.messageTexts[i].x = this.game.width/2;
      this.messageTexts[i].y = this.game.height/2 + 4*12 + (i - (messageStrings.length-1)/2) * (1.5 * (16 + this.texts.messageSizeAdjustment));
    }

    for (var i = 0; i < this.messageTexts.length; i++) this.messageTexts[i].visible = false;

    if (!this.game.device.desktop) {
      nextString = this.uiTexts.touchContinue;
      nextStringSizeAdjustment = this.uiTexts.touchContinueSizeAdjustment;
    }
    else {
      nextString = this.uiTexts.clickContinue;
      nextStringSizeAdjustment = this.uiTexts.clickContinueSizeAdjustment;
    }

    this.nextText = this.game.add.bitmapText(0, 0, 'font', nextString,16 + nextStringSizeAdjustment);
    this.nextText.tint = 0xFFFF00;
    this.nextText.anchor.x = 0.5;
    this.nextText.anchor.y = 0;
    this.nextText.x = this.game.width/2;
    this.nextText.y = this.game.height - 4*12;

    this.nextText.visible = false;

    this.checkContinue = false;

    this.time.events.add(Phaser.Timer.SECOND * 1, this.showScreen, this);
  },


  showScreen: function ()
  {
    for (var i = 0; i < this.messageTexts.length; i++) this.messageTexts[i].visible = true;

    this.time.events.add(Phaser.Timer.SECOND * 2, this.showContinue, this);

  },


  showContinue: function ()
  {
    this.nextText.visible = true;
    this.time.events.add(Phaser.Timer.SECOND * 0.5, this.flashContinue, this);
    this.checkContinue = true;
  },


  flashContinue: function ()
  {
    if (!this.flag.visible) return;

    this.nextText.visible = !this.nextText.visible;
    this.time.events.add(Phaser.Timer.SECOND * 0.5, this.flashContinue, this);

  },


  update: function ()
  {
    if (this.checkContinue && this.game.input.activePointer.justReleased(30))
    {
      // Go to next screen
      ga('send','event','Game','Continue');
      this.game.state.start('Select');

      // this.time.events.add(Phaser.Timer.SECOND * 1, this.nextState, this);
      //
      // this.flag.visible = false;
      // for (var i = 0; i < this.messageTexts.length; i++) this.messageTexts[i].visible = false;
      // this.nextText.visible = false;
    }

  },


  nextState: function ()
  {
    this.game.state.start('Select');
  }

};

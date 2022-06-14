TINT = 0xffffff;


BasicGame.Select = function (game) {

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

BasicGame.Select.prototype = {

  create: function () {

    this.selectTexts = this.cache.getJSON('texts').select;

    selectSound = this.add.audio('bip',0.05,false);


    this.game.stage.backgroundColor = "#000000";

    this.bg = this.game.add.sprite(0,0,'atlas','bg/door_bg.png');
    this.bg.scale.set(12,12);


    this.selectText = this.game.add.bitmapText(0, 0, 'font', this.selectTexts.choose,18 + this.selectTexts.chooseSizeAdjustment);
    this.selectText.tint = 0xFFFF00;
    this.selectText.anchor.x = 0.5;
    this.selectText.anchor.y = 0;
    this.selectText.x = this.game.width/2;
    this.selectText.y = 5*12;


    this.activist = this.game.add.sprite(0,20*12,'atlas','select/avatar/select_avatar.png');
    this.activist.anchor.x = 0.5;
    this.activist.scale.set(12,12);
    this.activist.tint = 0xD13049;

    this.journalist = this.game.add.sprite(0,this.activist.y,'atlas','select/avatar/select_avatar.png');
    this.journalist.anchor.x = 0.5;
    this.journalist.scale.set(12,12);
    this.journalist.tint = 0x419845;

    this.lawyer = this.game.add.sprite(0,this.activist.y,'atlas','select/avatar/select_avatar.png');
    this.lawyer.anchor.x = 0.5;
    this.lawyer.scale.set(12,12);
    this.lawyer.tint = 0x2576C0;

    this.activist.x = this.game.width/2;
    this.journalist.x = this.game.width/5;
    this.lawyer.x = 4*this.game.width/5;

    this.activist.inputEnabled = true;
    this.activist.input.useHandCursor = true;
    this.activist.events.onInputDown.add(this.onDown);
    this.activist.events.onInputUp.add(this.onUp,this);
    this.activist.events.onInputOver.add(this.onOver);
    this.activist.events.onInputOut.add(this.onOut);

    this.journalist.inputEnabled = true;
    this.journalist.input.useHandCursor = true;
    this.journalist.events.onInputDown.add(this.onDown);
    this.journalist.events.onInputUp.add(this.onUp,this);
    this.journalist.events.onInputOver.add(this.onOver);
    this.journalist.events.onInputOut.add(this.onOut);

    this.lawyer.inputEnabled = true;
    this.lawyer.input.useHandCursor = true;
    this.lawyer.events.onInputDown.add(this.onDown);
    this.lawyer.events.onInputUp.add(this.onUp,this);
    this.lawyer.events.onInputOver.add(this.onOver);
    this.lawyer.events.onInputOut.add(this.onOut);


    this.activistText = this.game.add.bitmapText(0, 0, 'font', this.selectTexts.activist, 12 + this.selectTexts.activistSizeAdjustment);
    this.activistText.tint = 0x111111;
    this.activistText.anchor.x = 0.5;
    this.activistText.anchor.y = 0;
    this.activistText.x = this.activist.x;
    this.activistText.y = this.activist.y + this.activist.height + 12;

    this.journalistText = this.game.add.bitmapText(0, 0, 'font', this.selectTexts.journalist,12 + this.selectTexts.journalistSizeAdjustment);
    this.journalistText.tint = 0x111111;
    this.journalistText.anchor.x = 0.5;
    this.journalistText.anchor.y = 0;
    this.journalistText.x = this.journalist.x;
    this.journalistText.y = this.journalist.y + this.journalist.height + 12;

    this.lawyerText = this.game.add.bitmapText(0, 0, 'font', this.selectTexts.lawyer, 12 + this.selectTexts.lawyerSizeAdjustment);
    this.lawyerText.tint = 0x111111;
    this.lawyerText.anchor.x = 0.5;
    this.lawyerText.anchor.y = 0;
    this.lawyerText.x = this.lawyer.x;
    this.lawyerText.y = this.lawyer.y + this.lawyer.height + 12;

    this.bg.visible = false;
    this.selectText.visible = false;
    this.activist.visible = false;
    this.activistText.visible = false;
    this.journalist.visible = false;
    this.journalistText.visible = false;
    this.lawyer.visible = false;
    this.lawyerText.visible = false;

    this.time.events.add(Phaser.Timer.SECOND * 1, this.showScreen, this);

  },


  showScreen: function ()
  {
    this.bg.visible = true;
    this.selectText.visible = true;
    this.activist.visible = true;
    this.activistText.visible = true;
    this.journalist.visible = true;
    this.journalistText.visible = true;
    this.lawyer.visible = true;
    this.lawyerText.visible = true;
  },


  update: function ()
  {

  },


  onDown: function (b) {

    b.over = true;
    b.down = true;
    b.y -= 12;
    selectSound.play();
  },


  onUp: function (b) {

    b.down = false;

    if (b.over)
    {
      if (b.tint == 0x419845) ga('send','event','Game','Athlete','Journalist');
      if (b.tint == 0xD13049) ga('send','event','Game','Athlete','Activist');
      if (b.tint == 0x2576C0) ga('send','event','Game','Athlete','Lawyer');

      TINT = b.tint;
      b.over = false;
      b.y += 12;

      b.game.time.events.add(Phaser.Timer.SECOND * 0.25, this.nextState, b, this);
    }
  },



  onOut: function (b) {

    b.over = false;
    b.tinted = false;

    if (b.down)
    {
      b.y += 12;
    }

  },


  onOver: function (b) {

    if (b.down)
    {
      b.over = true;
      b.y -= 12;
    }
  },


  nextState: function (b)
  {
    b.game.state.start('EventMenu');
  }

};

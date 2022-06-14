var BUTTON_MOVE_AMOUNT = 2;


BasicGame.EventMenu = function (game) {

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

BasicGame.EventMenu.prototype = {

  create: function () {

    bip = this.add.audio('bip',0.05,false);

    texts = this.cache.getJSON('texts').eventmenu;

    this.game.stage.backgroundColor = "#000000";

    this.avatar = this.game.add.sprite(0,0,'atlas','select/avatar/select_avatar.png');
    this.avatar.scale.set(12,12);
    this.avatar.x = 6*12;
    this.avatar.y = 15*12;
    this.avatar.tint = TINT;

    this.selectText = this.game.add.bitmapText(0, 0, 'font', texts.message,24 + texts.messageSizeAdjustment);
    this.selectText.tint = 0xFFFF00;
    this.selectText.anchor.x = 0.5;
    // this.gameOverText.anchor.y = 0.5;
    this.selectText.x = this.game.width/2;
    this.selectText.y = 4*12;


    sprintButton = this.createButton(20*12,11*12,texts.sprint,0xD13049,'Sprint',texts.sprintSizeAdjustment);
    highjumpButton = this.createButton(sprintButton.x,sprintButton.y + 5*12,texts.highjump,0x2576C0,'HighJump',texts.highjumpSizeAdjustment);
    boxingButton = this.createButton(sprintButton.x,highjumpButton.y + 5*12,texts.boxing,0x419845,'Boxing',texts.boxingSizeAdjustment);
    shotputButton = this.createButton(sprintButton.x,boxingButton.y + 5*12,texts.shotput,0xEFA12B,'ShotPut',texts.shotputSizeAdjustment);
    swimmingButton = this.createButton(sprintButton.x,shotputButton.y + 5*12,texts.swimming,0xD13049,'Swimming',texts.swimmingSizeAdjustment);

    this.selectText.visible = false;
    this.avatar.visible = false;
    sprintButton.visible = false;
    sprintButton.label.visible = false;
    highjumpButton.visible = false;
    highjumpButton.label.visible = false;
    boxingButton.visible = false;
    boxingButton.label.visible = false;
    shotputButton.visible = false;
    shotputButton.label.visible = false;
    swimmingButton.visible = false;
    swimmingButton.label.visible = false;


    this.time.events.add(Phaser.Timer.SECOND * 1, this.showScreen, this);
  },


  showScreen: function ()
  {
    this.game.stage.backgroundColor = "#878787";

    this.avatar.visible = true;
    this.selectText.visible = true;

    sprintButton.visible = true;
    sprintButton.label.visible = true;
    highjumpButton.visible = true;
    highjumpButton.label.visible = true;
    boxingButton.visible = true;
    boxingButton.label.visible = true;
    shotputButton.visible = true;
    shotputButton.label.visible = true;
    swimmingButton.visible = true;
    swimmingButton.label.visible = true;
  },


  update: function ()
  {

  },


  createButton: function (x, y, text, tint, state, sizeAdjustment)
  {
    button = this.game.add.sprite(0,0,'atlas','ui/ui_button.png');
    button.tint = tint;
    button.scale.set(16,12);
    button.x = x;
    button.y = y;

    button.inputEnabled = true;
    button.input.useHandCursor = true;
    button.events.onInputUp.add(this.onUp);
    button.events.onInputDown.add(this.onDown);
    button.events.onInputOver.add(this.onOver);
    button.events.onInputOut.add(this.onOut);

    buttonLabel = this.game.add.bitmapText(0,0, 'font', text, 12 + sizeAdjustment);
    buttonLabel.tint = 0x111111;
    buttonLabel.anchor.x = 0.5;
    buttonLabel.anchor.y = 0.5;
    buttonLabel.x = button.x + button.width/2;
    buttonLabel.y = button.y + button.height/2;

    button.label = buttonLabel;
    button.nextState = state;

    return button;
  },


  onDown: function (b) {

    b.over = true;
    b.down = true;
    b.x += BUTTON_MOVE_AMOUNT;
    b.y += BUTTON_MOVE_AMOUNT;
    b.label.x += BUTTON_MOVE_AMOUNT;
    b.label.y += BUTTON_MOVE_AMOUNT;

    bip.play();
  },


  onUp: function (b) {

    b.down = false;


    if (b.over)
    {
      b.over = false;
      b.x -= BUTTON_MOVE_AMOUNT;
      b.y -= BUTTON_MOVE_AMOUNT;
      b.label.x -= BUTTON_MOVE_AMOUNT;
      b.label.y -= BUTTON_MOVE_AMOUNT;

      if (b.nextState == 'Sprint') ga('send','event','Game','Sport','Sprint');
      else if (b.nextState == 'HighJump') ga('send','event','Game','Sport','HighJump');
      else if (b.nextState == 'ShotPut') ga('send','event','Game','Sport','ShotPut');
      else if (b.nextState == 'Swimming') ga('send','event','Game','Sport','Swimming');
      else if (b.nextState == 'Boxing') ga('send','event','Game','Sport','Boxing');

      b.game.state.start(b.nextState);

      // b.game.time.events.add(Phaser.Timer.SECOND * 0.25, this.nextState, b, this);
    }
  },


  onOut: function (b) {

    b.over = false;

    if (b.down)
    {
      b.x -= BUTTON_MOVE_AMOUNT;
      b.y -= BUTTON_MOVE_AMOUNT;
      b.label.x -= BUTTON_MOVE_AMOUNT;
      b.label.y -= BUTTON_MOVE_AMOUNT;

    }

  },


  onOver: function (b) {

    if (b.down)
    {
      b.over = true;
      b.x += BUTTON_MOVE_AMOUNT;
      b.y += BUTTON_MOVE_AMOUNT;
      b.label.x += BUTTON_MOVE_AMOUNT;
      b.label.y += BUTTON_MOVE_AMOUNT;
    }
  },


  nextState: function (b)
  {
    b.game.state.start(b.nextState);
  }

};

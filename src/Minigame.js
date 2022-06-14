var SCALE = 12;
var TIME = 10;
var ATTEMPTS = 3;

var FONT_SIZE_BIG = 24;
var FONT_SIZE_SMALL = 14;

BasicGame.Minigame = function (game)
{

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

BasicGame.Minigame.prototype = {

  create: function ()
  {



    this.uiTexts = this.cache.getJSON('texts').ui;


    // AUDIO
    this.bipSound = this.add.audio('bip',0.05,false);
    this.whistleSound = this.add.audio('whistle',0.1,false);
    // this.beep_low = this.add.audio('beep_low',1,false);
    this.recordSound = this.add.audio('record',0.1,false);


    // GRAPHICS
    this.game.stage.backgroundColor = "#000000";
    this.avatar.tint = TINT;

    this.bg.visible = false;
    this.avatar.visible = false;

    // Timer
    if (this.hasTimer) this.timeLeft = TIME;
    else this.attempt = 1;

    // UI
    BasicGame.Minigame.prototype.setupUI.call(this);

    // States
    this.gameOver = false;
    this.inputEnabled = false;
    this.continueEnabled = false;

    // Stats
    this.statistic1 = "";
    this.statistic2 = "";
    this.isNewRecord = false;

    this.stateTimer = this.time.events.add(Phaser.Timer.SECOND * 1, BasicGame.Minigame.prototype.showGame, this);
  },


  updateTimer: function ()
  {
    if (!this.hasTimer) return;

    this.timeLeft--;

    this.timerText.text = BasicGame.Minigame.prototype.getTimeString.call(this,this.timeLeft);

    if (this.timeLeft > 0)
    {
      this.timer = this.time.events.add(Phaser.Timer.SECOND * 1, BasicGame.Minigame.prototype.updateTimer, this);
    }
    else
    {
      // Timer has expired
    }
  },


  update: function ()
  {
    if (this.continueEnabled && this.game.input.activePointer.justReleased(30))
    {
      this.game.state.start(this.nextState);
    }
  },


  updateSave: function (saveName, statistic)
  {
    var currentRecord = localStorage[saveName];

    if (currentRecord == undefined || statistic > currentRecord)
    {
      localStorage[saveName] = statistic;
      this.isNewRecord = true;
    }
    else
    {
      this.isNewRecord = false;
    }
  },


  handleEnd: function ()
  {
    this.whistleSound.play();

    this.inputEnabled = false;
    this.avatar.animations.play('idle');

    BasicGame.Minigame.prototype.setInstructionsVisible.call(this,false);
    this.timerText.visible = false;
    this.statsText.visible = false;

    this.stateTimer = this.time.events.add(Phaser.Timer.SECOND * 2, BasicGame.Minigame.prototype.showResults, this);
  },


  setupUI: function ()
  {
    // Timer that appears top left

    if (this.hasTimer) timerString = BasicGame.Minigame.prototype.getTimeString.call(this,this.timeLeft);
    else timerString = "";

    this.timerText = this.game.add.bitmapText(SCALE, SCALE, 'font',timerString,FONT_SIZE_BIG);
    this.timerText.tint = 0xFFFF00;


    // Stat that appears top right

    this.statsText = this.game.add.bitmapText(SCALE, SCALE, 'font','0.0m',FONT_SIZE_BIG);
    this.statsText.tint = 0xFFFF00;
    this.statsText.anchor.x = 1;
    this.statsText.x = this.game.width - SCALE;

    // Instructions

    instructionsStrings = [];
    if (!this.game.device.desktop) {
      instructionsStrings = this.eventTexts.touchInstructions;
      instructionsSizeAdjustment = this.eventTexts.touchInstructionsSizeAdjustment;
    }
    else {
      instructionsStrings = this.eventTexts.clickInstructions;
      instructionsSizeAdjustment = this.eventTexts.clickInstructionsSizeAdjustment;
    }

    var instructionTextsY = 34*12;
    this.instructionsTexts = [];
    for (var i = 0; i < instructionsStrings.length; i++)
    {
      this.instructionsTexts[i] = this.game.add.bitmapText(0, 0, 'font',instructionsStrings[i],20 + instructionsSizeAdjustment);
      this.instructionsTexts[i].tint = 0xFFFF00;
      this.instructionsTexts[i].anchor.x = 0.5;
      this.instructionsTexts[i].anchor.y = 0.5;
      this.instructionsTexts[i].x = this.game.width/2;
      this.instructionsTexts[i].y = instructionTextsY;
      instructionTextsY += this.instructionsTexts[i].height + 0.5*12;
    }

    // Ready, set, ...

    this.readyText = this.game.add.bitmapText(SCALE, SCALE, 'font', this.uiTexts.ready,FONT_SIZE_BIG + this.uiTexts.readySizeAdjustment);
    this.readyText.tint = 0xFFFF00;
    this.readyText.anchor.x = 0.5;
    this.readyText.anchor.y = 0.5;
    this.readyText.x = this.game.width/2;
    this.readyText.y = this.game.height/2;


    this.setText = this.game.add.bitmapText(SCALE, SCALE, 'font', this.uiTexts.set,FONT_SIZE_BIG + this.uiTexts.setSizeAdjustment);
    this.setText.tint = 0xFFFF00;
    this.setText.anchor.x = 0.5;
    this.setText.anchor.y = 0.5;
    this.setText.x = this.game.width/2;
    this.setText.y = this.readyText.y;

    this.goText = this.game.add.bitmapText(SCALE, SCALE, 'font', this.uiTexts.go,FONT_SIZE_BIG + this.uiTexts.goSizeAdjustment);
    this.goText.tint = 0xFFFF00;
    this.goText.anchor.x = 0.5;
    this.goText.anchor.y = 0.5;
    this.goText.x = this.game.width/2;
    this.goText.y = this.readyText.y;

    // Statistics

    this.statistic1TitleText = this.game.add.bitmapText(0,0,'font',this.eventTexts.result + ":",FONT_SIZE_BIG + this.eventTexts.resultsSizeAdjustment);
    this.statistic1TitleText.tint = 0xFFFF00;
    this.statistic1TitleText.anchor.x = 0.5;
    this.statistic1Text = this.game.add.bitmapText(0,0,'font',this.eventTexts.result + ":",FONT_SIZE_BIG + this.eventTexts.resultsSizeAdjustment);
    this.statistic1Text.tint = 0xFFFF00;
    this.statistic1Text.anchor.x = 0.5;
    this.statistic1RecordText = this.game.add.bitmapText(0,0,'font',this.uiTexts.record + "!",FONT_SIZE_SMALL + this.uiTexts.recordSizeAdjustment);
    this.statistic1RecordText.tint = 0xFFFF00;
    this.statistic1RecordText.anchor.x = 0.5;

    this.statistic2TitleText = this.game.add.bitmapText(0,0,'font',this.eventTexts.result + ":",FONT_SIZE_BIG + this.eventTexts.resultsSizeAdjustment);
    this.statistic2TitleText.tint = 0xFFFF00;
    this.statistic2TitleText.anchor.x = 0.5;
    this.statistic2Text = this.game.add.bitmapText(0,0,'font',this.eventTexts.result + ":",FONT_SIZE_BIG + this.eventTexts.resultsSizeAdjustment);
    this.statistic2Text.tint = 0xFFFF00;
    this.statistic2Text.anchor.x = 0.5;

    if (!this.game.device.desktop)
    {
      continueString = this.uiTexts.touchContinue;
      continueStringSizeAdjustment = this.uiTexts.touchContinueSizeAdjustment;
    }
    else {
      continueString = this.uiTexts.clickContinue;
      continueStringSizeAdjustment = this.uiTexts.clickContinueSizeAdjustment;
    }

    this.continueText = this.game.add.bitmapText(0,0,'font',continueString,FONT_SIZE_BIG + continueStringSizeAdjustment);
    this.continueText.tint = 0xFFFF00;
    this.continueText.anchor.x = 0.5;
    this.continueText.x = this.game.width/2;
    this.continueText.y = this.game.height - this.continueText.height - 2*SCALE;

    this.continueText.visible = false;

    // Set initial visibilities

    this.timerText.visible = false;
    this.statsText.visible = false;
    BasicGame.Minigame.prototype.setInstructionsVisible.call(this,false);
    this.readyText.visible = false;
    this.setText.visible = false;
    this.goText.visible = false;

    this.statistic1TitleText.visible = false;
    this.statistic1Text.visible = false;
    this.statistic1RecordText.visible = false;
    this.statistic2TitleText.visible = false;
    this.statistic2Text.visible = false;
  },


  setInstructionsVisible: function (value)
  {
    for (var i = 0; i < this.instructionsTexts.length; i++) this.instructionsTexts[i].visible = value;
  },


  showBlackPreGame: function ()
  {
    this.stateTimer = this.time.events.add(Phaser.Timer.SECOND * 1, BasicGame.Minigame.prototype.showGame, this);
  },


  showGame: function ()
  {
    this.bg.visible = true;
    this.avatar.visible = true;

    this.stateTimer = this.time.events.add(Phaser.Timer.SECOND * 1, BasicGame.Minigame.prototype.showUI, this);
  },


  showUI: function ()
  {
    if (this.hasTimer)
    {
      this.stateTimer = this.time.events.add(Phaser.Timer.SECOND * 1, BasicGame.Minigame.prototype.showReady, this);
    }
    else
    {
      this.stateTimer = this.time.events.add(Phaser.Timer.SECOND * 1, BasicGame.Minigame.prototype.startGame, this);
    }
  },


  showReady: function ()
  {
    this.readyText.visible = true;
    this.bipSound.play();

    BasicGame.Minigame.prototype.setInstructionsVisible.call(this,true);
    this.timerText.visible = true;
    this.statsText.visible = true;

    this.stateTimer = this.time.events.add(Phaser.Timer.SECOND * 1, BasicGame.Minigame.prototype.showSet, this);
  },


  showSet: function ()
  {
    this.readyText.visible = false;
    this.setText.visible = true;
    this.bipSound.play();

    this.stateTimer = this.time.events.add(Phaser.Timer.SECOND * 1, BasicGame.Minigame.prototype.startGame, this);
  },


  startGame: function ()
  {
    this.whistleSound.play();

    BasicGame.Minigame.prototype.setInstructionsVisible.call(this,true);
    this.timerText.visible = true;
    this.statsText.visible = true;

    this.setText.visible = false;
    this.goText.visible = true;

    this.inputEnabled = true;

    if (this.hasTimer) this.timer = this.time.events.add(Phaser.Timer.SECOND * 1, BasicGame.Minigame.prototype.updateTimer,this);
    this.time.events.add(Phaser.Timer.SECOND * 1, BasicGame.Minigame.prototype.hideGo,this);

    this.handleStart();
  },


  hideGo: function ()
  {
    this.goText.visible = false;
  },


  showResults: function ()
  {
    if (this.isNewRecord)
    {
      this.recordSound.play();
    }
    else
    {
      this.bipSound.play();
    }

    if (this.statistic1 != "")
    {
      this.statistic1TitleText.text = this.eventTexts.results[0];
      this.statistic1Text.text = this.statistic1;

      this.statistic1TitleText.visible = true;
      this.statistic1Text.visible = true;

      this.statistic1RecordText.visible = this.isNewRecord;
    }
    if (this.statistic2 != "")
    {
      this.statistic2TitleText.text = this.eventTexts.results[1];
      this.statistic2Text.text = this.statistic2;

      this.statistic2TitleText.visible = true;
      this.statistic2Text.visible = true;
    }

    // Position the results based on two sets of stats
    this.statistic1TitleText.x = this.game.width/2;
    this.statistic1TitleText.y = 2 * 12;
    this.statistic1Text.x = this.game.width/2;
    this.statistic1Text.y = this.statistic1TitleText.y + this.statistic1TitleText.height + SCALE;

    this.statistic1RecordText.x = this.game.width/2;
    this.statistic1RecordText.y = this.statistic1Text.y + this.statistic1Text.height + SCALE;

    if (this.statistic2Text.visible)
    {
      this.statistic2TitleText.x = this.game.width/2;
      this.statistic2TitleText.y = this.statistic1Text.y + this.statistic1Text.height + SCALE + this.statistic1RecordText.height + SCALE;
      this.statistic2Text.x = this.game.width/2;
      this.statistic2Text.y = this.statistic2TitleText.y + this.statistic1TitleText.height + SCALE;


    }


    if (this.isNewRecord)
    {
      this.time.events.add(Phaser.Timer.SECOND * 0.5, BasicGame.Minigame.prototype.flashRecord, this);
    }
    this.time.events.add(Phaser.Timer.SECOND * 2, BasicGame.Minigame.prototype.showContinue, this);

  },


  flashRecord: function ()
  {
    this.statistic1RecordText.visible = !this.statistic1RecordText.visible;

    this.time.events.add(Phaser.Timer.SECOND * 0.5, BasicGame.Minigame.prototype.flashRecord, this);
  },


  flashContinue: function ()
  {
    this.continueText.visible = !this.continueText.visible;

    this.time.events.add(Phaser.Timer.SECOND * 0.5, BasicGame.Minigame.prototype.flashContinue, this);
  },


  showContinue: function ()
  {
    this.continueText.visible = true;
    this.continueEnabled = true;
    this.time.events.add(Phaser.Timer.SECOND * 0.5, BasicGame.Minigame.prototype.flashContinue, this);
  },


  getTimeString: function (time)
  {
    var timeString = "00:" + (time >= 10 ? "" : "0") + time;
    return timeString;
  },


  getAttemptString: function (attempt)
  {
    var attemptString = attempt + ':';
    return attemptString;
  },


  scaleUp: function ( sprite )
  {
    sprite.scale.x *= SCALE;
    sprite.scale.y *= SCALE;
  },

};

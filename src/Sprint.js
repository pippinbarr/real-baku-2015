var SPEED = 400;
var taps = 0;


BasicGame.Minigame.Sprint = function (game)
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

BasicGame.Minigame.Sprint.prototype = {

  create: function ()
  {
    this.game.input.maxPointers = 1;

    // JSON
    this.eventTexts = this.cache.getJSON('texts').sprint;


    // AUDIO
    this.stepSound = this.add.audio('step',1,false);
    // this.whistleSound = this.add.audio('whistle',1,false);


    // GRAPHICS

    this.bg = this.game.add.sprite(0,0,'atlas','bg/bed_sink_bg.png');
    BasicGame.Minigame.prototype.scaleUp.call(this,this.bg);
    this.bg.visible = false;


    // Sprinter

    this.avatar = this.game.add.sprite(0,0,'atlas','sprint/avatar/sprint_avatar_1.png');
    BasicGame.Minigame.prototype.scaleUp.call(this,this.avatar);

    this.avatar.anchor.x = 0.5;
    this.avatar.x = 0 + this.avatar.width/2 + SCALE;
    this.avatar.y = this.game.height - this.avatar.height - 2*SCALE;

    this.game.physics.enable(this.avatar, Phaser.Physics.ARCADE);
    this.avatar.body.velocity.x = 0;

    this.avatar.animations.add('idle',['sprint/avatar/sprint_avatar_1.png'],30,false);
    this.avatar.animations.add('sprint2',Phaser.Animation.generateFrameNames('sprint/avatar/sprint_avatar_',2,7,'.png',0),4,true);
    this.avatar.animations.add('sprint4',Phaser.Animation.generateFrameNames('sprint/avatar/sprint_avatar_',2,7,'.png',0),8,true);
    this.avatar.animations.add('sprint8',Phaser.Animation.generateFrameNames('sprint/avatar/sprint_avatar_',2,7,'.png',0),16,true);
    this.avatar.animations.add('sprint16',Phaser.Animation.generateFrameNames('sprint/avatar/sprint_avatar_',2,7,'.png',0),32,true);

    this.avatar.animations.play('idle');


    // STATS

    this.lastX = this.avatar.body.x;
    this.realDistance = 0;
    this.distance = 0;
    this.taps = 0;


    // Flags

    this.hasTimer = true;
    this.nextState = 'GameOver';

    BasicGame.Minigame.prototype.create.call(this);
  },


  calculateTapRate: function ()
  {
    if (!this.inputEnabled)
    {
      this.taps = 0;
      return;
    }

    this.distance = Math.floor(this.realDistance / 100);
    this.statsText.text = this.getDistanceString();

    if (this.taps < 1)
    {
      this.avatar.body.velocity.x = 0;
      this.avatar.animations.play('idle');

    }
    else if (this.taps < 2)
    {
      this.avatar.body.velocity.x = SPEED/8;
      this.avatar.animations.play('sprint2');
    }
    else if (this.taps < 3)
    {
      this.avatar.body.velocity.x = SPEED/4;
      this.avatar.animations.play('sprint4');
    }
    else if (this.taps < 4)
    {
      this.avatar.body.velocity.x = SPEED/2;
      this.avatar.animations.play('sprint8');
    }
    else
    {
      this.avatar.body.velocity.x = SPEED;
      this.avatar.animations.play('sprint16');
    }

    this.taps = 0;

    this.tapTimer = this.time.events.add(Phaser.Timer.SECOND * 0.5, this.calculateTapRate, this);
  },



  update: function ()
  {
    BasicGame.Minigame.prototype.update.call(this);

    if (this.inputEnabled)
    {
      this.realDistance += Math.abs(this.avatar.body.x - this.lastX);
      this.lastX = this.avatar.body.x;
    }

    if (this.inputEnabled && this.input.activePointer.justReleased(30))
    {
      this.taps++;
    }

    this.handleStepSound();
    this.handleBounds();
    this.handleEnd();
  },


  handleStepSound: function ()
  {
    if (this.avatar.animations.frameName == 'sprint/avatar/sprint_avatar_2.png' && this.prevFrame != 'sprint/avatar/sprint_avatar_2.png')
    {
      this.stepSound.play();
    }

    this.prevFrame = this.avatar.animations.frameName;
  },


  handleStart: function ()
  {
    this.tapTimer = this.time.events.add(Phaser.Timer.SECOND * 0.5, this.calculateTapRate, this);
  },


  handleEnd: function ()
  {
    if (this.gameOver) return;

    if (this.distance >= 100)
    {
      this.distance = 100;
      this.statsText.text = "100.0m";
      this.gameOver = true;
    }

    if (this.timeLeft == 0)
    {
      this.gameOver = true;
    }

    if (this.gameOver)
    {
      ga('send','event','Game','Sport','Sprint',Math.floor(this.distance));

      this.taps = 0;
      this.avatar.body.velocity.x = 0;
      this.avatar.animations.play('idle');

      this.statistic1 = this.getDistanceString();

      BasicGame.Minigame.prototype.updateSave.call(this,"baku_games_sprint",this.distance);
      BasicGame.Minigame.prototype.handleEnd.call(this);
    }
  },


  getDistanceString: function ()
  {
    return "" + this.distance + ".0m";
  },


  handleBounds: function ()
  {
    if (this.avatar.body.x + this.avatar.width > this.game.width)
    {
      this.realDistance += Math.abs(this.avatar.body.x - this.lastX);
      this.lastX = this.avatar.body.x;

      this.avatar.body.velocity.x = 0;
      this.avatar.animations.play("idle");
      SPEED = -SPEED;
      this.taps = 0;
      this.avatar.body.x = this.game.width - this.avatar.width;

      this.avatar.scale.x *= -1;
    }

    else if (this.avatar.body.x < 0)
    {
      this.realDistance += Math.abs(this.avatar.body.x - this.lastX);
      this.lastX = this.avatar.body.x;

      this.avatar.body.velocity.x = 0;
      this.avatar.animations.play("idle");
      SPEED = -SPEED;
      this.taps = 0;

      this.avatar.body.x = 0;

      this.avatar.scale.x *= -1;

      BasicGame.Minigame.prototype.setInstructionsVisible.call(this,false);
    }
  },
};

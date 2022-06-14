var GRAVITY = 500;
var ANIMATION_FRAME_POWER = 500;
var CROUCH_FRAME_RATE = 5;


BasicGame.Minigame.HighJump = function (game)
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

BasicGame.Minigame.HighJump.prototype = {

  create: function ()
  {
    this.eventTexts = this.cache.getJSON('texts').highjump;

    this.jumpSound = this.add.audio('splash',0.25,false);


    this.game.physics.startSystem(Phaser.Physics.ARCADE);


    // GRAPHICS

    this.game.stage.backgroundColor = "#000000";


    // Background

    this.bg = this.game.add.sprite(0,0,'atlas','bg/bed_sink_bg.png');
    BasicGame.Minigame.prototype.scaleUp.call(this,this.bg);
    this.bg.visible = false;


    // Avatar

    this.avatar = this.game.add.sprite(0,0,'atlas','high_jump/avatar/high_jump_avatar_1.png');
    BasicGame.Minigame.prototype.scaleUp.call(this,this.avatar);
    this.game.physics.enable(this.avatar, Phaser.Physics.ARCADE);
    this.avatar.anchor.x = 0.5;
    this.avatar.x = 13.5*12;
    this.avatar.y = 7*12;

    this.avatar.animations.add('idle',['high_jump/avatar/high_jump_avatar_4.png'],30,false);
    this.avatar.animations.add('post-jump',['high_jump/avatar/high_jump_avatar_2.png'],30,false);
    var crouch_down = this.avatar.animations.add('crouch-down',['high_jump/avatar/high_jump_avatar_2.png','high_jump/avatar/high_jump_avatar_3.png'],CROUCH_FRAME_RATE,false);
    var crouch_up = this.avatar.animations.add('crouch-up',['high_jump/avatar/high_jump_avatar_3.png','high_jump/avatar/high_jump_avatar_2.png','high_jump/avatar/high_jump_avatar_1.png'],CROUCH_FRAME_RATE,false);
    this.avatar.animations.play('idle');

    crouch_down.enableUpdate = true;
    crouch_down.onUpdate.add(function () { this.power = 0; },this);
    crouch_down.onComplete.add(function () { this.avatar.animations.play('crouch-up'); this.powerSign = 1; this.power = ANIMATION_FRAME_POWER; },this);

    crouch_up.enableUpdate = true;
    crouch_up.onUpdate.add(function () { this.power = ANIMATION_FRAME_POWER; }, this);
    crouch_up.onComplete.add(function () { this.avatar.animations.play('crouch-down'); this.powerSign = 1; this.power = 0; },this);

    // Physics avatar
    this.jumpAvatar = this.game.add.sprite(0,0,'atlas','high_jump/avatar/high_jump_avatar_4.png');
    BasicGame.Minigame.prototype.scaleUp.call(this,this.jumpAvatar);
    this.game.physics.enable(this.jumpAvatar, Phaser.Physics.ARCADE);
    this.jumpAvatar.body.x = this.avatar.body.x;
    this.jumpAvatar.body.y = this.avatar.body.y;
    this.jumpAvatar.visible = false;
    this.jumpAvatar.tint = TINT;

    // Stats
    this.jumpHeight = 0;
    this.bestJumpHeight = -1000;
    this.power = 0;
    this.powerSign = 1;
    this.endGame = false;


    // Flags

    this.hasTimer = false;
    // this.nextState = 'Swimming';
    this.nextState = 'GameOver';


    BasicGame.Minigame.prototype.create.call(this);
  },


  update: function ()
  {
    BasicGame.Minigame.prototype.update.call(this);

    this.handleInput();
    this.handlePhysics();
    this.handleUI();
    this.handleEnd();
  },


  handleInput: function ()
  {
    if (this.avatar.animations.currentAnim.name == "crouch-down" || this.avatar.animations.currentAnim.name == "crouch-up")
    {
      this.power += (this.powerSign * ANIMATION_FRAME_POWER * (CROUCH_FRAME_RATE * this.game.time.elapsed/1000));
    }

    // Holding down the pointer
    if (this.inputEnabled && this.input.activePointer.isDown && this.avatar.visible)
    {
      // Crouch if standing and not already animating
      if (this.avatar.animations.frameName == 'high_jump/avatar/high_jump_avatar_4.png' && !this.avatar.animations.currentAnim.isPlaying)
      {
        this.power = 0;
        this.avatar.animations.play("crouch-down");
        BasicGame.Minigame.prototype.setInstructionsVisible.call(this,false);
      }
    }
    // Just released the pointer
    else if (this.avatar.visible && this.inputEnabled && this.input.activePointer.isUp && (this.avatar.animations.currentAnim.name == "crouch-down" || this.avatar.animations.currentAnim.name == "crouch-up"))
    {
      this.jumpSound.play();

      this.avatar.visible = false;

      this.jumpAvatar.visible = true;
      this.jumpAvatar.body.x = this.avatar.body.x;
      this.jumpAvatar.body.y = this.avatar.body.y - 5;

      // console.log(this.avatar.animations.currentAnim.currentFrame.name.slice(34,35));
      var frameNumber = Number(this.avatar.animations.currentAnim.currentFrame.name.slice(34,35));
      // console.log(frameNumber);
      var jumpPower = (frameNumber * ANIMATION_FRAME_POWER) + this.power;

      if (jumpPower < 120) jumpPower = 120;
      this.jumpAvatar.body.velocity.y = -jumpPower;
      this.jumpAvatar.body.gravity.y = GRAVITY;

      this.avatar.animations.play("idle");
    }

  },


  handlePhysics: function ()
  {
    if (this.jumpAvatar.visible &&  this.jumpAvatar.body.velocity.y <= 0)
    {
      this.jumpHeight = (this.avatar.body.y - this.jumpAvatar.body.y)/50;
    }

    if (this.jumpAvatar.visible && this.jumpAvatar.body.y > this.avatar.body.y)
    {
      this.jumpSound.play();

      this.jumpAvatar.body.velocity.y = 0;
      this.jumpAvatar.visible = false;
      this.jumpAvatar.body.gravity.y = 0;

      this.avatar.visible = true
      this.avatar.animations.play('post-jump');

      this.inputEnabled = false;
      this.attemptTimer = this.time.events.add(Phaser.Timer.SECOND * 1, this.attemptComplete, this);
    }

  },


  handleUI: function ()
  {
    this.statsText.text = this.getHighJumpHeightString();
  },


  handleStart: function ()
  {

  },


  handleEnd: function ()
  {
    if (this.gameOver) return;

    if (this.endGame)
    {
      this.gameOver = true;
    }

    if (this.gameOver)
    {
      this.avatar.body.velocity.y = 0;
      this.avatar.animations.play('idle');

      this.statistic1 = this.bestJumpHeight.toFixed(2) + 'm';


      BasicGame.Minigame.prototype.updateSave.call(this,"baku_games_high_jump",this.bestJumpHeight);
      BasicGame.Minigame.prototype.handleEnd.call(this);
    }
  },


  attemptComplete: function ()
  {
    ga('send','event','Game','Sport','HighJump',Math.floor(this.jumpHeight));

    if (this.jumpHeight > this.bestJumpHeight) this.bestJumpHeight = this.jumpHeight;

    if (this.attempt == 1) this.timerText.text = this.attempt + ':' + this.getHighJumpHeightString();
    else this.timerText.text += '\n' + this.attempt + ':' + this.getHighJumpHeightString();

    this.attempt++;

    this.attemptTimer = this.time.events.add(Phaser.Timer.SECOND * 1, this.attemptNext, this);
  },


  attemptNext: function ()
  {
    if (this.attempt <= ATTEMPTS)
    {
      this.whistleSound.play();

      this.avatar.animations.play('idle');

      this.inputEnabled = true;

      this.timerText.visible = true;
      this.statsText.visible = true;

      this.goText.visible = true;

      this.time.events.add(Phaser.Timer.SECOND * 1, BasicGame.Minigame.prototype.hideGo,this);
    }
    else
    {
      this.endGame = true;
    }
  },


  getHighJumpHeightString: function (height)
  {
    // if (this.jumpAvatar.visible)
    return this.jumpHeight.toFixed(2) + 'm';
    // else return "0.00m";
  },
};

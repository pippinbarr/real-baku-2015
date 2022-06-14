BasicGame.Minigame.Swimming = function (game)
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

BasicGame.Minigame.Swimming.prototype = {

  create: function ()
  {
    this.splashSound = this.add.audio('splash',0.25,false);

    this.eventTexts = this.cache.getJSON('texts').swimming;


    // GRAPHICS

    this.game.stage.backgroundColor = "#000000";


    // Background

    this.bg = this.game.add.sprite(0,0,'atlas','bg/bed_sink_bg.png');
    BasicGame.Minigame.prototype.scaleUp.call(this,this.bg);
    this.bg.visible = false;

    // Water
    this.water = this.game.add.sprite(0,0,'atlas','swimming/water/swimming_water_1.png');
    BasicGame.Minigame.prototype.scaleUp.call(this,this.water);
    this.water.animations.add('spread',[Phaser.Animation.generateFrameNames('swimming/water/swimming_water_',1,6,'.png',0)],5,true);
    // this.water.animations.play('spread');

    this.water.x = 21*12;
    this.water.y = 31*12;

    // Avatar

    this.avatar = this.game.add.sprite(0,0,'atlas','swimming/avatar/swimming_avatar_1.png');
    BasicGame.Minigame.prototype.scaleUp.call(this,this.avatar);

    // this.avatar.anchor.x = 0.5;
    this.avatar.x = 26*12;
    this.avatar.y = 16*12;

    this.game.physics.enable(this.avatar, Phaser.Physics.ARCADE);
    this.avatar.body.velocity.x = 0;

    this.avatar.animations.add('idle',['swimming/avatar/swimming_avatar_1.png'],30,false);
    this.avatar.animations.add('paddle-idle',['swimming/avatar/swimming_avatar_2.png'],30,false);
    this.avatar.animations.add('paddle',['swimming/avatar/swimming_avatar_3.png'],15,false);
    this.avatar.animations.play('idle');


    // Splash

    splashEmitter = this.game.add.emitter(this.avatar.x + this.avatar.width - 2*12, this.avatar.y + 7*12, 200);
    splashEmitter.makeParticles('atlas','swimming/particle/swimming_splash_particle.png');
    splashEmitter.gravity = 600;
    splashEmitter.setRotation(0,0);
    splashEmitter.setXSpeed(-50,100);
    splashEmitter.setYSpeed(-100,-20);
    splashEmitter.setSize(24,24);



    // Stats
    this.paddles = 0;

    // Flags

    this.hasTimer = true;
    this.nextState = 'GameOver';


    BasicGame.Minigame.prototype.create.call(this);
  },


  update: function ()
  {
    BasicGame.Minigame.prototype.update.call(this);

    if (this.inputEnabled && this.input.activePointer.justReleased(30) &&
    (this.avatar.animations.currentAnim.name == 'paddle-idle' || this.avatar.animations.currentAnim.isFinished))
    {
      this.input.activePointer.reset();
      this.avatar.animations.play('paddle');
      splashEmitter.start(true, 650, null, 5);
      this.paddles++;
      this.splashSound.play();
    }
    else if (this.inputEnabled && this.avatar.animations.currentAnim.isFinished && this.paddles > 0)
    {
      this.avatar.animations.play('paddle-idle');
    }

    if (this.paddles != 0)
    {
      BasicGame.Minigame.prototype.setInstructionsVisible.call(this,false);
    }

    // this.water.animations.frame = Math.min(Math.floor(this.paddles/10),6);
    this.water.animations.frameName = 'swimming/water/swimming_water_' + (Math.min(Math.floor(this.paddles/10),6)+1) + '.png';

    this.handleEnd();
    this.updateStats();
  },


  handleStart: function ()
  {
    this.avatar.animations.play('idle');
  },


  updateStats: function ()
  {
    this.statsText.text = "0.0m";
  },


  handleEnd: function ()
  {
    if (this.gameOver) return;

    if (this.timeLeft == 0)
    {
      this.gameOver = true;
    }

    if (this.gameOver)
    {
      this.avatar.body.velocity.x = 0;
      this.avatar.animations.play('idle');

      this.statistic1 = "0.0m";

      // Need to check if this is a new record which it is if it's either
      // the first result ever OR better than the stored best result
      if (true)
      {
        this.isNewRecord = true;
      }

      BasicGame.Minigame.prototype.updateSave.call(this,"baku_games_swimming",0);
      BasicGame.Minigame.prototype.handleEnd.call(this);
    }
  },
};

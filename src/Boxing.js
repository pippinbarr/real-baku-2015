var PUNCH_SPEED = 8;


BasicGame.Minigame.Boxing = function (game)
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

BasicGame.Minigame.Boxing.prototype = {

  create: function ()
  {
    this.punchSound = this.add.audio('splash',0.25,false);


    this.eventTexts = this.cache.getJSON('texts').boxing;


    // GRAPHICS

    this.game.stage.backgroundColor = "#000000";


    // Background

    this.bg = this.game.add.sprite(0,0,'atlas','bg/bed_sink_bg.png');
    BasicGame.Minigame.prototype.scaleUp.call(this,this.bg);
    this.bg.visible = false;


    // Avatar

    this.avatar = this.game.add.sprite(0,0,'atlas','boxing/avatar/boxing_avatar_1.png');
    BasicGame.Minigame.prototype.scaleUp.call(this,this.avatar);

    this.avatar.anchor.x = 0.5;
    this.avatar.x = 12*12;
    this.avatar.y = 240;

    this.game.physics.enable(this.avatar, Phaser.Physics.ARCADE);
    this.avatar.body.velocity.x = 0;

    this.avatar.animations.add('idle',['boxing/avatar/boxing_avatar_1.png'],1,false);
    this.avatar.animations.add('sway',['boxing/avatar/boxing_avatar_3.png','boxing/avatar/boxing_avatar_2.png'],5,true);
    this.avatar.animations.add('right-jab',['boxing/avatar/boxing_avatar_4.png','boxing/avatar/boxing_avatar_2.png'],PUNCH_SPEED,false);
    this.avatar.animations.add('left-jab',['boxing/avatar/boxing_avatar_5.png','boxing/avatar/boxing_avatar_2.png'],PUNCH_SPEED,false);
    this.avatar.animations.add('right-uppercut',['boxing/avatar/boxing_avatar_6.png','boxing/avatar/boxing_avatar_7.png','boxing/avatar/boxing_avatar_2.png'],PUNCH_SPEED,false);
    this.avatar.animations.add('left-uppercut',['boxing/avatar/boxing_avatar_6.png','boxing/avatar/boxing_avatar_8.png','boxing/avatar/boxing_avatar_2.png'],PUNCH_SPEED,false);
    this.avatar.animations.add('right-bodyblow',['boxing/avatar/boxing_avatar_9.png','boxing/avatar/boxing_avatar_10.png','boxing/avatar/boxing_avatar_2.png'],PUNCH_SPEED,false);
    this.avatar.animations.add('left-bodyblow',['boxing/avatar/boxing_avatar_11.png','boxing/avatar/boxing_avatar_12.png','boxing/avatar/boxing_avatar_2.png'],PUNCH_SPEED,false);
    this.avatar.animations.play('idle');

    this.avatar.punches = ['right-jab','left-jab','right-uppercut','left-uppercut','right-bodyblow','left-bodyblow'];

    // Stats
    this.punches = 0;


    // Flags

    this.hasTimer = true;
    // this.nextState = 'HighJump';
    this.nextState = 'GameOver';


    BasicGame.Minigame.prototype.create.call(this);
  },


  update: function ()
  {
    BasicGame.Minigame.prototype.update.call(this);

    if (this.inputEnabled && this.input.activePointer.justReleased(30) &&
    (this.avatar.animations.currentAnim.name == 'sway' || this.avatar.animations.currentAnim.isFinished))
    {
      this.input.activePointer.reset();
      this.avatar.animations.play(this.avatar.punches[Math.floor(Math.random() * this.avatar.punches.length)]);
      this.punches++;

      this.punchSound.play();
    }
    else if (this.inputEnabled && this.avatar.animations.currentAnim.isFinished)
    {
      this.avatar.animations.play('sway');
    }

    if (this.punches != 0)
    {
      BasicGame.Minigame.prototype.setInstructionsVisible.call(this,false);
    }

    this.handleEnd();
    this.updateStats();
  },


  handleStart: function ()
  {
    this.avatar.animations.play('sway');
  },


  updateStats: function ()
  {
    var thrown = this.punches < 10 ? ' ' + this.punches : '' + this.punches;
    var landed = ' 0';
    this.statsText.text = this.eventTexts.thrown + ": " + thrown + "\n" + this.eventTexts.landed + ": " + landed;
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
      ga('send','event','Game','Sport','Boxing',Math.floor(this.punches));

      this.avatar.body.velocity.x = 0;
      this.avatar.animations.play('idle');

      this.statistic1 = '' + this.punches;
      this.statistic2 = '0';

      // Need to check if this is a new record which it is if it's either
      // the first result ever OR better than the stored best result

      BasicGame.Minigame.prototype.updateSave.call(this,"baku_games_boxing",this.punches);
      BasicGame.Minigame.prototype.handleEnd.call(this);
    }
  },
};

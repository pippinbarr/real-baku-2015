var GRAVITY = 500;
var ANIMATION_FRAME_POWER = 50;
var THROW_FRAME_RATE = 5;
var DRAG_X = 80;
var DRAG_Y = 40;

BasicGame.Minigame.ShotPut = function (game)
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

BasicGame.Minigame.ShotPut.prototype = {

  create: function ()
  {
    this.throwSound = this.add.audio('splash',0.25,false);
    bounceSound = this.add.audio('step',0.25,false);


    this.eventTexts = this.cache.getJSON('texts').shotput;


    // GRAPHICS

    this.game.stage.backgroundColor = "#000000";


    // Background

    // this.bg = this.game.add.sprite(0,0,'sink_bg');
    this.bg = this.game.add.sprite(0,0,'atlas','bg/bed_sink_bg.png');

    BasicGame.Minigame.prototype.scaleUp.call(this,this.bg);
    this.bg.visible = false;


    // Avatar

    this.game.physics.startSystem(Phaser.Physics.ARCADE);


    this.avatar = this.game.add.sprite(0,0,'atlas','shot_put/avatar/shot_put_avatar_1.png');
    BasicGame.Minigame.prototype.scaleUp.call(this,this.avatar);
    this.avatar.x = 2*12;
    this.avatar.y = 22*12;

    this.avatar.animations.add('idle-with-shot',['shot_put/avatar/shot_put_avatar_1.png'],30,false);
    this.avatar.animations.add('throw',Phaser.Animation.generateFrameNames('shot_put/avatar/shot_put_avatar_',7,8,'.png',0),5,false);
    var wind_up = this.avatar.animations.add('wind-up',Phaser.Animation.generateFrameNames('shot_put/avatar/shot_put_avatar_',2,6,'.png',0),THROW_FRAME_RATE,false);
    var wind_down = this.avatar.animations.add('wind-down',Phaser.Animation.generateFrameNames('shot_put/avatar/shot_put_avatar_',5,2,'.png',0),THROW_FRAME_RATE,false);
    this.avatar.animations.play('idle-with-shot');


    wind_up.enableUpdate = true;
    wind_up.onUpdate.add(function () { this.power = 0; },this);
    wind_up.onComplete.add(function () { this.avatar.animations.play('wind-down'); this.powerSign = -1; this.power = ANIMATION_FRAME_POWER; },this);

    wind_down.enableUpdate = true;
    wind_down.onUpdate.add(function () { this.power = ANIMATION_FRAME_POWER; },this);
    wind_down.onComplete.add(function () { this.avatar.animations.play('wind-up'); this.powerSign = 1; this.power = 0; },this);


    this.shotAnim = this.game.add.sprite(0,0,'atlas','shot_put/shot/shot_put_shot_1.png');
    BasicGame.Minigame.prototype.scaleUp.call(this,this.shotAnim);
    this.shotAnim.animations.frame = this.avatar.animations.frame;
    this.shotAnim.x = this.avatar.x;
    this.shotAnim.y = this.avatar.y;
    this.shotAnim.visible = false;

    this.shot = this.game.add.sprite(0,0,'atlas','shot_put/shot/shot_put_shot.png');
    BasicGame.Minigame.prototype.scaleUp.call(this,this.shot);
    this.game.physics.enable(this.shot, Phaser.Physics.ARCADE);
    this.shot.visible = false;
    this.shot.body.bounce.set(0.5);
    this.shot.body.collideWorldBounds = true;

    this.rightWall = this.game.add.sprite(this.game.width - 24,0,null);
    this.game.physics.enable(this.rightWall, Phaser.Physics.ARCADE);
    this.rightWall.anchor.x = 0; this.rightWall.anchor.y = 0;
    this.rightWall.body.setSize(24,this.game.height,0,0);
    this.rightWall.body.immovable = true;

    this.floorWall = this.game.add.sprite(0,this.avatar.y + this.avatar.height,null);
    this.game.physics.enable(this.floorWall, Phaser.Physics.ARCADE);
    this.floorWall.anchor.x = 0; this.floorWall.anchor.y = 0;
    this.floorWall.body.x = 0; this.floorWall.body.y = this.avatar.y + this.avatar
    this.floorWall.body.setSize(this.game.width,this.game.height - this.avatar.y - this.avatar.height,0,0);
    this.floorWall.body.immovable = true;


    // Stats

    this.distance = 0;
    this.bestDistance = -1000;
    this.power = 0;
    this.powerSign = 1;
    this.endGame = false;

    // Flags

    this.hasTimer = false;
    // this.nextState = 'Boxing';
    this.nextState = 'GameOver';
    this.shotStopped = false;


    BasicGame.Minigame.prototype.create.call(this);
  },


  update: function ()
  {
    BasicGame.Minigame.prototype.update.call(this);

    this.shotAnim.visible = this.avatar.visible;
    this.shotAnim.animations.frameName = 'shot_put/shot/shot_put_shot_' + this.avatar.animations.frameName.slice(32,33) + '.png';

    this.handleInput();
    this.handlePhysics();
    this.handleUI();
    this.handleEnd();
  },


  handleInput: function ()
  {
    if (!this.inputEnabled) return;

    if (this.avatar.animations.currentAnim.name == "wind-up" || this.avatar.animations.currentAnim.name == "wind-down")
    {
      this.power += (this.powerSign * ANIMATION_FRAME_POWER * (THROW_FRAME_RATE * this.game.time.elapsed/1000));
    }

    // Holding down the pointer
    if (this.input.activePointer.isDown)
    {
      // Wind up if standing and not already animating
      if (this.avatar.animations.frameName == 'shot_put/avatar/shot_put_avatar_1.png' && !this.avatar.animations.currentAnim.isPlaying)
      {
        this.power = 0;
        this.avatar.animations.play("wind-up");
        BasicGame.Minigame.prototype.setInstructionsVisible.call(this,false);
      }
    }
    // Just released the pointer
    else if (this.input.activePointer.isUp && (this.avatar.animations.currentAnim.name == "wind-up" || this.avatar.animations.currentAnim.name == "wind-down"))
    {
      this.throwSound.play();
      this.inputEnabled = false;

      this.shot.visible = true;

      this.shot.body.x = this.avatar.x + this.avatar.width - 0*12;
      this.shot.body.y = this.avatar.y + 0*12;

      this.shot.body.gravity.y = GRAVITY;

      this.shot.body.drag.x = 0;
      this.shot.body.drag.y = 0;

      // Oh this is very hacky I'm very sorry it was all I could come up with for the
      // texture atlas stuff sorry sorry
      var frameNumber = Number(this.avatar.animations.currentAnim.currentFrame.name.slice(32,33)) - 1;
      var throwPower = (frameNumber * ANIMATION_FRAME_POWER) + this.power;

      this.shot.body.velocity.x = throwPower;
      this.shot.body.velocity.y = -throwPower/2;

      this.avatar.animations.play("throw");
    }
  },


  handlePhysics: function ()
  {
    this.distance = (this.shot.x - (this.avatar.x + this.avatar.width - 2*12))/100;

    this.physics.arcade.collide(this.shot,this.rightWall,this.handleWallHit,this.processWallHit);
    this.physics.arcade.collide(this.shot,this.floorWall,this.handleWallHit,this.processWallHit);

    // Ball stops moving
    // Notice the irritation of gravity meaning you can't check for a zero y velocity
    if (this.shot.visible && Math.abs(this.shot.body.velocity.y) < 3 && this.shot.body.velocity.x == 0 && !this.shotStopped)
    {
      this.shot.body.velocity.x = 0;
      this.shot.body.velocity.y = 0;
      this.shotStopped = true;
      this.attemptTimer = this.time.events.add(Phaser.Timer.SECOND * 1, this.attemptComplete, this);
    }
  },


  handleUI: function ()
  {
    this.statsText.text = this.getShotPutDistanceString();
  },


  handleWallHit: function (ball,wall)
  {

  },


  processWallHit: function (shot,wall)
  {
    shot.body.drag.x = DRAG_X;
    shot.body.drag.y = DRAG_Y;

    if (shot.body.velocity.x != 0)
    {
      bounceSound.play();
    }
  },


  render: function ()
  {

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
      this.avatar.animations.play('idle');

      this.statistic1 = this.bestDistance.toFixed(2) + 'm';

      BasicGame.Minigame.prototype.updateSave.call(this,"baku_games_shot_put",this.bestDistance);
      BasicGame.Minigame.prototype.handleEnd.call(this);
    }
  },


  attemptComplete: function ()
  {
    ga('send','event','Game','Sport','ShotPut',Math.floor(this.distance));

    if (this.distance > this.bestDistance) this.bestDistance = this.distance;

    if (this.attempt == 1) this.timerText.text = this.attempt + ':' + this.getShotPutDistanceString();
    else this.timerText.text += '\n' + this.attempt + ':' + this.getShotPutDistanceString();

    this.attempt++;

    this.attemptTimer = this.time.events.add(Phaser.Timer.SECOND * 1, this.attemptNext, this);
  },


  attemptNext: function ()
  {
    if (this.attempt <= ATTEMPTS)
    {
      this.whistleSound.play();

      this.avatar.animations.play('idle-with-shot');

      this.inputEnabled = true;
      this.shotStopped = false;

      this.shot.visible = false;
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


  getShotPutDistanceString: function (distance)
  {
    if (this.shot.visible) return this.distance.toFixed(2) + 'm';
    else return "0.00m";
  },
};

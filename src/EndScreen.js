var BUTTON_MOVE_AMOUNT = 2;


BasicGame.EndScreen = function (game) {

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

BasicGame.EndScreen.prototype = {

  create: function () {

    bip = this.add.audio('bip',0.05,false);

    texts = this.cache.getJSON('texts').endscreen;

    this.game.stage.backgroundColor = "#32193a";

    this.logo = this.game.add.sprite(0,0,'atlas','end_screen/fidh_logo.png');
    this.logo.scale.set(12,12);
    this.logo.anchor.x = 0.5;
    this.logo.x = this.game.width/2;
    this.logo.y = 2*12;

    this.logoText1 = this.game.add.bitmapText(0,0, 'font', texts.fidh1,12 + texts.fidh1SizeAdjustment);
    this.logoText1.anchor.x = 0.5;
    this.logoText1.x = this.game.width/2;
    this.logoText1.y = this.logo.y + this.logo.height + 1*12;

    this.logoText2 = this.game.add.bitmapText(0,0, 'font', texts.fidh2,12 + texts.fidh2SizeAdjustment);
    this.logoText2.anchor.x = 0.5;
    this.logoText2.x = this.game.width/2;
    this.logoText2.y = this.logoText1.y + this.logoText1.height + 0.5*12;


    petitionButton = this.createButton(7.5*12,19*12,texts.petition,0x419845,30,12,texts.petitionSizeAdjustment);
    facebookButton = this.createButton(7.5*12,24*12,texts.facebook,0x0000CC,30,12,texts.facebookSizeAdjustment);
    twitterButton = this.createButton(7.5*12,29*12,texts.twitter,0x539CE6,30,12,texts.twitterSizeAdjustment);
    playAgainButton = this.createButton(7.5*12,34*12,texts.playagain,0xEFA12B,30,12,texts.playagainSizeAdjustment);



    facebookButton.visible = false;
    facebookButton.label.visible = false;
    twitterButton.visible = false;
    twitterButton.label.visible = false;
    petitionButton.visible = false;
    petitionButton.label.visible = false;
    playAgainButton.visible = false;
    playAgainButton.label.visible = false;


    this.time.events.add(Phaser.Timer.SECOND * 0.2, this.showPetition, this);
  },


  showPetition: function ()
  {
    petitionButton.visible = true;
    petitionButton.label.visible = true;
    this.time.events.add(Phaser.Timer.SECOND * 0.2, this.showFacebook, this);
  },


  showFacebook: function ()
  {
    facebookButton.visible = true;
    facebookButton.label.visible = true;
    this.time.events.add(Phaser.Timer.SECOND * 0.2, this.showTwitter, this);
  },


  showTwitter: function ()
  {
    twitterButton.visible = true;
    twitterButton.label.visible = true;
    this.time.events.add(Phaser.Timer.SECOND * 0.2, this.showPlayAgain, this);
  },


  showPlayAgain: function ()
  {
    playAgainButton.visible = true;
    playAgainButton.label.visible = true;
  },


  update: function ()
  {

  },


  createButton: function (x, y, text, tint, xScale, yScale,sizeAdjustment) {
    button = this.game.add.sprite(0,0,'atlas','ui/ui_button.png');
    button.tint = tint;
    button.scale.set(xScale ? xScale : 12, yScale ? yScale : 12);
    button.x = x;
    button.y = y;
    button.inputEnabled = true;
    button.input.useHandCursor = true;

    button.events.onInputUp.add(this.onUp);
    button.events.onInputDown.add(this.onDown);
    button.events.onInputOver.add(this.onOver);
    button.events.onInputOut.add(this.onOut);

    buttonLabel = this.game.add.bitmapText(0,0, 'font', text, 16 + sizeAdjustment);
    buttonLabel.tint = 0xFFFFFF;
    buttonLabel.anchor.x = 0.5;
    buttonLabel.anchor.y = 0.5;
    buttonLabel.x = button.x + button.width/2;
    buttonLabel.y = button.y + button.height/2;

    button.label = buttonLabel;

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


      if (b == twitterButton)
      {
        ga('send','event','Game','Share','Twitter');

        var twitterString = texts.twitterMessage;
        console.log(twitterString);

        if (b.game.device.desktop)
        {
          // For this one we need +s instead of spaces for some stupid internet reason
          twitterString.replace(' ','+');
          window.open('http://twitter.com/intent/tweet?text=' + encodeURIComponent(twitterString) + '&url=' + encodeURI(texts.shareURL),"_system");
        }
        else
        {
          nativeTwitter = window.open('twitter://post?message=' + encodeURIComponent(twitterString) + ' ' + encodeURI(texts.shareURL),"_self");
          if (!nativeTwitter)
          {
            window.open('http://twitter.com/intent/tweet?text=' + encodeURIComponent(twitterString) + '&url=' + encodeURI(texts.shareURL),"_system");
          }
        }
      }
      else if (b == facebookButton)
      {
        ga('send','event','Game','Share','Facebook');

        window.open('http://www.facebook.com/sharer/sharer.php?u=' + encodeURI(texts.shareURL),'_system');
      }
      else if (b == petitionButton)
      {
        ga('send','event','Game','Share','Petition');

        window.open(encodeURI(texts.petitionURL),'_self');
      }
      else if (b == playAgainButton)
      {
        b.game.state.start('Select');
      }
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

};

const config = {
  type: Phaser.AUTO,
  width: 3200,
  height: 340,
  zoom: 2,
  parent: 'game-container',
  pixelArt: true,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
    },
  },
};

//GLOBAL GAME OBJECT VARIABLES:
const game = new Phaser.Game(config);

let player;
let buffy;
let stars;
let bombs;
let bomb;
let bombCollider;
let shield;
let shieldUp = false;
// let lasers;
// let laserBolt;
// let Laser;
// let fireDelay = 100;
// let lastFired = 0;
let cursors;
let shieldCursor;
let githubButton;
let musicButton;
let pauseButton;
let difficulty;
let difficultyLEVEL;
let difficultyUP;
let difficultyDOWN;
let score = 0;
let scoreText;
let startText;
let winBubble;
let gameOverMessage;
let pausedMessage;
let speechBubble;
let instructions;
let instructionsPrompt;
let replayButton;
let gameOver = false;
let gameOverText;
let music;
let jumpSound;
let starSound;
let bombSound;
let fallSound;
let winSound;
let winMeow;
let startMeow;
let meowCalled = false;
let wonCalled = false;
let gamePaused = false;
let setDifficulty;

//SETTINGS
const cheatMode = false;
let flying = false;
let musicPaused = false;
let controlsWorking = false;
// const lasersEnabled = false;
let bombsEnabled = true;
let numBombs = 10;
const playerStart = 40; //play: 40, test end: 3000

if (cheatMode) {
  flying = true;
  bombsEnabled = false;
  controlsWorking = true;
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
/////////////          P   R   E   L   O   A   D        //////////////
//////////////////////////////////////////////////////////////////////

function preload() {
  this.load.image('tiles', 'assets/BadBuffy/mainTileset.png');
  this.load.image('decorations', 'assets/BadBuffy/erasedTileset.png');
  this.load.image('mountainsandclouds', 'assets/BadBuffy/mountainsandclouds.png');
  this.load.image('star', 'assets/basic/star.png');
  this.load.image('bomb', 'assets/basic/bomb.png');
  this.load.image('shield', 'assets/BadBuffy/shield.png');
  // this.load.image('blood', 'assets/BadBuffy/particle.png');
  // this.load.image('laser', 'assets/BadBuffy/laser.png');
  this.load.image('speechBubble', 'assets/BadBuffy/speechBubble.png');
  this.load.image('instructionsPrompt', 'assets/BadBuffy/instructionsPrompt.png');
  this.load.image('instructions', 'assets/BadBuffy/instructionsNOLASERS2.png');
  this.load.image('gameOver', 'assets/BadBuffy/gameOver.png')
  this.load.image('paused', 'assets/BadBuffy/pausedMessage.png')
  this.load.image('replayButton', 'assets/BadBuffy/replayButton.png');
  this.load.image('winBubble', 'assets/BadBuffy/winBubble.png');
  this.load.image('github', 'assets/BadBuffy/github.png');
  this.load.image('musicButton', 'assets/BadBuffy/musicButton.png');
  this.load.image('musicButtonEmpty', 'assets/BadBuffy/musicButtonEmpty.png');
  this.load.image('pauseButton', 'assets/BadBuffy/pauseButton.png');
  this.load.image('difficulty', 'assets/BadBuffy/difficulty.png');
  this.load.image('difficultyUP', 'assets/BadBuffy/difficultyUP.png');
  this.load.image('difficultyDOWN', 'assets/BadBuffy/difficultyDOWN.png');
  this.load.tilemapTiledJSON('map', 'assets/BadBuffy/MAP2.json');
  // this.load.spritesheet('dude', 'assets/basic/kel.png', {
  //   frameWidth: 32,
  //   frameHeight: 48,
  // });
  this.load.spritesheet('dude', 'assets/BadBuffy/kel2.png', {
    frameWidth: 16,
    frameHeight: 28,
  });
  this.load.spritesheet('buffy', 'assets/BadBuffy/buffy.png', {
    frameWidth: 43,
    frameHeight: 32,
  });
  this.load.spritesheet('startText', 'assets/BadBuffy/clickToStart2.png', {
    frameWidth: 351,
    frameHeight: 250,
  });
  this.load.audio('music', '/assets/BadBuffy/harvestMoon.mp3');
  this.load.audio('jump', 'assets/BadBuffy/littleJump.mp3');
  this.load.audio('collect', 'assets/BadBuffy/collect.mp3');
  this.load.audio('explode', 'assets/BadBuffy/explode.mp3');
  this.load.audio('fall', 'assets/BadBuffy/squeak.mp3');
  this.load.audio('win', 'assets/BadBuffy/win.mp3');
  this.load.audio('winMeow', 'assets/BadBuffy/happyMeow.mp3');
  this.load.audio('startMeow', 'assets/BadBuffy/basicMeow.mp3');
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////          C   R   E   A   T   E          ///////////////
//////////////////////////////////////////////////////////////////////

function create() {
  controlsWorking = false;
  //////////////////////////////////////////////////////////////////////
  // AUDIO
  //////////////////////////////////////////////////////////////////////
  music = this.sound.add('music', {
    loop: true,
    delay: 0,
  });
  // music.play();

  jumpSound = this.sound.add('jump');
  starSound = this.sound.add('collect');
  bombSound = this.sound.add('explode');
  bombSound.volume = 0.3;
  fallSound = this.sound.add('fall');
  fallSound.volume = 0.5;
  winSound = this.sound.add('win');
  winMeow = this.sound.add('winMeow');
  startMeow = this.sound.add('startMeow');

  //////////////////////////////////////////////////////////////////////
  // MAP
  //////////////////////////////////////////////////////////////////////

  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('mainTileset', 'tiles');
  const bgTiles = map.addTilesetImage(
    'mountainsandclouds',
    'mountainsandclouds'
  );
  const decorationTiles = map.addTilesetImage('erasedTileset', 'decorations');
  //^^^first arg is the name given to the tilesheet when importing it into Tiled
  //second arg is the key given to the asset in Phaser

  //////////////////////////////////////////////////////////////////////
  // LAYERS
  //////////////////////////////////////////////////////////////////////

  const BackgroundLayer = map.createStaticLayer(
    'BackgroundLayer',
    bgTiles,
    0,
    0
  );
  const DecorationLayer = map.createStaticLayer(
    'DecorationLayer',
    decorationTiles,
    0,
    0
  );
  const GroundLayer = map.createStaticLayer('GroundLayer', tileset, 0, 0);

  //////////////////////////////////////////////////////////////////////
  // PLAYER
  //////////////////////////////////////////////////////////////////////

  player = this.physics.add.sprite(playerStart, 265, 'dude').setScale(1.3); //0.8);
  //this.physics.add defaults to a dynamic body (vs static)

  player.setBounce(0.3); //will bounce slightly when landing
  player.body.setGravityY(400); //body property references its arcade physics body
  //if this ^^^ wasn't here it would default to 300, as seen on line 23
  // player.facingLeft = false;

  shield = this.physics.add.sprite(playerStart, 260, 'shield');
  shield.visible = false;

  /////////////////////////////////////////////////////////////////////
  // PLAYER ANIMATIONS
  //////////////////////////////////////////////////////////////////////

  this.anims.create({
    //animations created are available globally, belonging to the game objects themselves!
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
    //use frames 0,1,2,3 at 10 fps, and -1 repeat tells it to loop
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  /////////////////////////////////////////////////////////////////////
  // BUFFY
  //////////////////////////////////////////////////////////////////////
  buffy = this.physics.add.sprite(3170, 270, 'buffy');
  this.anims.create({
    key: 'curl',
    frames: this.anims.generateFrameNumbers('buffy', { start: 0, end: 1 }),
    frameRate: 2,
    repeat: -1,
  });

  //(note: no need for event listeners, the keyboard manager is built into Phaser)
  cursors = this.input.keyboard.createCursorKeys();
  shieldCursor = this.input.keyboard.addKeys('s');
  //populates the 'cursors' variable obj w/ 4 props: up, down, left, right
  //each directional property is an instance of a Key object
  //these will be polled in the update loop

  //////////////////////////////////////////////////////////////////////
  // STARS
  //////////////////////////////////////////////////////////////////////

  stars = this.physics.add.group({
    //add.group can take an obj for settings!
    key: 'star', //texture key is the star image
    repeat: 59, //repeating x times means x+1stars total, (x + default 1)
    setXY: { x: 12, y: 0, stepX: 49 },
    //first child will be born at 12, increasing across the x at intervals of 70px
  });

  stars.children.iterate(child => {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    child.setScale(0.5);
  }); //vary the bounciness of the stars until they finally settle

  //////////////////////////////////////////////////////////////////////
  // BOMBS
  //////////////////////////////////////////////////////////////////////

  bombs = this.physics.add.group();
  if (bombsEnabled) {
    for (let i = 0; i < numBombs; i++) {
      bomb = bombs.create(Phaser.Math.Between(200, 4500), 0, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-100, 100), 20);
      bomb.allowGravity = false;
    }
  }

  //////////////////////////////////////////////////////////////////////
  // LASERS
  //////////////////////////////////////////////////////////////////////

  //WIP: (taken from learndot workshop)

  // Laser = class extends Phaser.Physics.Arcade.Sprite {
  //   constructor(scene, x, y, spriteKey, facingLeft) {
  //     super(scene, x, y, spriteKey);
  //     // scene.add.existing(currentScene)
  //     // Store reference of scene passed to constructor
  //     this.scene = scene;
  //     // Add laser to scene and enable physics
  //     this.scene.physics.world.enable(this);
  //     this.scene.add.existing(this);

  //     // Set how fast the laser travels (pixels/ms)
  //     this.speed = Phaser.Math.GetSpeed(800, 1); // (distance in pixels, time (ms))

  //     // Important to not apply gravity to the laser bolt!
  //     this.body.setAllowGravity(false);

  //     // Our reset function will take care of initializing the remaining fields
  //     this.reset(x, y, facingLeft);
  //   }

  //   // Check which direction the player is facing and move the laserbolt in that direction as long as it lives
  //   update(time, delta) {
  //     this.lifespan -= delta;
  //     const moveDistance = this.speed * delta;
  //     if (this.facingLeft) {
  //       this.x -= moveDistance;
  //     } else {
  //       this.x += moveDistance;
  //     }
  //     // If this laser has run out of lifespan, we "kill it" by deactivating it.
  //     // We can then reuse this laser object
  //     if (this.lifespan <= 0) {
  //       this.setActive(false);
  //       this.setVisible(false);
  //     }
  //   }

  //   // Reset this laserbolt to start at a particular location and
  //   // fire in a particular direction.
  //   reset(x, y, facingLeft) {
  //     this.setActive(true);
  //     this.setVisible(true);
  //     this.lifespan = 900;
  //     this.facingLeft = facingLeft;
  //     this.setPosition(x, y);
  //   }
  // };

  // lasers = this.physics.add.group({
  //   classType: Laser,
  //   maxSize: 40,
  //   runChildUpdate: true,
  //   allowGravity: false,
  // });

  //////////////////////////////////////////////////////////////////////
  // MESSAGES & BUTTONS
  //////////////////////////////////////////////////////////////////////

  scoreText = this.add.text(15, 15, 'score: 0', {
    fontsize: '6',
    fill: '#000000',
  }); //font will default to Courier
  scoreText.setScrollFactor(0);

  speechBubble = this.physics.add
    .staticSprite(130, 200, 'speechBubble')
    .setScale(0.5);
  speechBubble.visible = false;

  instructionsPrompt = this.physics.add
    .staticSprite(150, 255, 'instructionsPrompt')
    .setScale(0.5);
  instructionsPrompt.visible = false;

  instructions = this.physics.add.staticSprite(330, 150, 'instructions');
  instructions.visible = false;
  instructions.setScrollFactor(0);

  startText = this.physics.add.staticSprite(240, 150, 'startText');
  this.anims.create({
    key: 'clickToStart',
    frames: this.anims.generateFrameNumbers('startText', { start: 0, end: 1 }),
    frameRate: 2,
    repeat: -1,
  });

  winBubble = this.physics.add
    .staticSprite(3070, 200, 'winBubble')
    .setScale(0.5);
  winBubble.visible = false;
  
  // gameOverMessage = this.physics.add.staticSprite(250, 250, 'gameOver')
  // gameOverMessage.allowGravity = false 
  
  pausedMessage = this.physics.add.staticSprite(250, 160, 'paused').setScale(0.5)
  pausedMessage.allowGravity = false 
  pausedMessage.visible = false

  replayButton = this.add.sprite(3120, 46, 'replayButton').setInteractive();
  replayButton.on('pointerdown', () => {
    let currentScene = this.scene;
    music.pause();
    currentScene.restart();
  });
  replayButton.visible = false;

  pauseButton = this.add.sprite(33, 42, 'pauseButton').setInteractive();
  pauseButton.on('pointerdown', () => {
    pause();
  });
  pauseButton.setScrollFactor(0);

  musicButton = this.add
    .sprite(65, 42, 'musicButton')
    .setScale(0.7)
    .setInteractive();
  musicButton.on('pointerdown', () => {
    if (!musicPaused) {
      music.pause();
      musicPaused = true;
      musicButton.visible = false;
      musicButtonEmpty.visible = true;
    } else if (musicPaused) {
      music.play();
      musicPaused = false;
      musicButton.visible = true;
      musicButtonEmpty.visible = false;
    }
  });
  musicButton.setScrollFactor(0);

  musicButtonEmpty = this.add
    .sprite(65, 42, 'musicButtonEmpty')
    .setScale(0.7)
    .setInteractive();
  musicButtonEmpty.on('pointerdown', () => {
    if (!musicPaused) {
      music.pause();
      musicPaused = true;
      musicButtonEmpty.visible = true;
      musicButton.visible = false;
    } else if (musicPaused) {
      music.play();
      musicPaused = false;
      musicButtonEmpty.visible = false;
      musicButton.visible = true;
    }
  });
  musicButtonEmpty.setScrollFactor(0);

  githubButton = this.add.sprite(455, 310, 'github').setInteractive();
  githubButton.on('pointerdown', () => {
    window.location.href = 'https://github.com/kirstenlindsmith/stackathon';
  });
  githubButton.setScrollFactor(0);

  difficulty = this.add.sprite(236, 258, 'difficulty');
  difficulty.setScrollFactor(0);

  difficultyTEXT = this.add.text(271, 247, numBombs, {
    fontsize: '4px',
    fill: '#ffffff',
  });
  difficultyTEXT.setScrollFactor(0);

  difficultyUP = this.add
    .sprite(306, 255, 'difficultyUP')
    .setScale(0.4)
    .setInteractive();
  difficultyUP.on('pointerdown', () => {
    increaseDifficulty();
  });
  difficultyUP.setScrollFactor(0);

  difficultyDOWN = this.add
    .sprite(334, 255, 'difficultyDOWN')
    .setScale(0.4)
    .setInteractive();
  difficultyDOWN.on('pointerdown', () => {
    decreaseDifficulty();
  });
  difficultyDOWN.setScrollFactor(0);

  difficulty.visible = false;
  difficultyTEXT.visible = false;
  difficultyUP.visible = false;
  difficultyDOWN.visible = false;

  //////////////////////////////////////////////////////////////////////
  // COLLISIONS
  //////////////////////////////////////////////////////////////////////

  map.setCollisionBetween(0, 923, true, 'GroundLayer');
  player.setCollideWorldBounds(true); //player can't leave the game area
  buffy.setCollideWorldBounds(true); //just in case
  this.physics.add.collider(player, GroundLayer);
  this.physics.add.collider(shield, GroundLayer);
  this.physics.add.collider(buffy, GroundLayer);
  this.physics.add.collider(stars, GroundLayer);
  if (bombsEnabled) this.physics.add.collider(bombs, GroundLayer);
  this.physics.add.overlap(player, stars, collectStar, null, this);
  // this.physics.add.overlap(bombs, lasers, shoot, null, this);

  //////////////////////////////////////////////////////////////////////
  // CAMERA
  //////////////////////////////////////////////////////////////////////
  this.cameras.main.setBounds(0, 0, 3200, 400);
  this.cameras.main.setSize(500, 500);
  this.cameras.main.startFollow(player);
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////          U   P   D   A   T   E          ///////////////
//////////////////////////////////////////////////////////////////////

function update(time, delta) {
  if(player.anims.currentFrame){
    console.log('CURRENT FRAME: ',player.anims.currentFrame.textureFrame)
    // console.log('TOTAL FRAMES: ', player.anims.getTotalFrames())
  }
  player.anims.play('turn');
  this.input.on(
    'pointerdown',
    event => {
      //on mouse click...
      if (!gamePaused) music.play();
      startText.visible = false;
      speechBubble.visible = true;
      controlsWorking = true;
      bombCollider = this.physics.add.collider(
        player,
        bombs,
        hitBomb,
        null,
        this
      ).name = 'bombCollider';
      this.time.addEvent({
        delay: 2000,
        callback: () => (instructionsPrompt.visible = true),
        callbackScope: this,
      });
      this.time.addEvent({
        delay: 6000,
        callback: () => (instructionsPrompt.visible = false),
        callbackScope: this,
      });
    },
    this
  );

  if (player.body.x > 40) {
    start();
  }
  if (player.body.x > 120) {
    meow();
  }

  shield.x = player.body.x + 11;
  shield.y = player.body.y + 16;

  difficultyTEXT.setText(numBombs);

  //DEATH CONDITIONS:
  if (gameOver) {
    gameOver = false; //else gameOver will be true on respawn
    controlsWorking = false;
    music.pause();
    player.setVelocity(0, 0);
    let currentScene = this.scene;
    gameOverText = this.add.text(player.x - 40, player.y - 40, 'GAME OVER', {
      fontsize: '40px',
      fill: '#ffffff',
    });
    this.time.addEvent({
      delay: 2000,
      callback: () =>
        this.add.text(player.x - 40, player.y - 60, 'restarting...', {
          fontsize: '10pt',
          fill: '#e256a1',
        }),
      callbackScope: this,
    });
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        controlsWorking = true;
        currentScene.restart();
      }, //restart the game
      callbackScope: this,
    });
  }
  if (player.body.y > 300) {
    //if the player falls
    shield.visible = false;
    controlsWorking = false;
    player.setVelocity(0, 0);
    gameOver = false;
    music.pause();
    const currentScene = this.scene;
    gameOverText = this.add.text(player.x - 40, player.y - 40, 'GAME OVER', {
      fontsize: '40pt',
      fill: '#ffffff',
    });
    this.time.addEvent({
      delay: 2000,
      callback: () =>
        this.add.text(player.x - 40, player.y - 60, 'restarting...', {
          fontsize: '10pt',
          fill: '#e256a1',
        }),
      callbackScope: this,
    });

    this.time.addEvent({
      delay: 3000,
      callback: () => {
        controlsWorking = true;
        currentScene.restart();
      }, //restart the game
      callbackScope: this,
    });
    player.visible = false; //vanish the player (as though they fell for real)
  }

  //WIN CONDITION:
  if (player.body.x > 3050) {
    win(this);
  }

  //CONTROLS:
  if (controlsWorking) {
    if (cursors.left.isDown) {
      player.setVelocityX(-100);
      player.anims.play('left', true, 3);
      player.play('left')
    } else if (cursors.right.isDown) {
      player.setVelocityX(100);
      player.anims.play('right', true, 5);
    } else {
      player.setVelocityX(0);
      player.anims.play('turn');
    }

    //////// flying mode:
    if (flying) {
      if (cursors.up.isDown) {
        player.setVelocityY(-330);
      }
      if (cursors.down.isDown) {
        player.setVelocityY(250);
      }
    } else {
      /////// regular jump settings:
      if (cursors.up.isDown && player.body.onFloor()) {
        player.setVelocityY(-400);
        jumpSound.play();
      }
    }

    if (cursors.shift.isDown) {
      instructions.visible = true;
      difficulty.visible = true;
      difficultyTEXT.visible = true;
      difficultyUP.visible = true;
      difficultyDOWN.visible = true;
    } else {
      instructions.visible = false;
      difficulty.visible = false;
      difficultyTEXT.visible = false;
      difficultyUP.visible = false;
      difficultyDOWN.visible = false;
    }

    if (shieldCursor.s.isDown) {
      shieldUp = true;
      shield.visible = true;
    } else {
      shieldUp = false;
      shield.visible = false;
    }

    //shoot
    // if (lasersEnabled) {
    //   if (cursors.space.isDown && time > lastFired) {
    //     let currentScene = this.scene;
    //     fireLaser(currentScene);
    //     lastFired = time + fireDelay;
    //   }
    // }
  }
  buffy.anims.play('curl', true);
  startText.anims.play('clickToStart', true);

  //landing sound:
  if (player.body.velocity.y > 100) {
    //only for big thuds
    player.falling = true;
  }
  if (player.body.onFloor() && player.falling) {
    player.falling = false;
    fallSound.play();
  }

  //Bomb rebirth settings:
  //(this way if a bomb falls off the map it will respawn)
  if (bombsEnabled) {
    if (bombs.children) {
      bombs.children.iterate(child => {
        if (child) {
          const bombHeight = child.y;
          if (bombHeight > 320) {
            child.disableBody(true, true);
            child.enableBody(
              true,
              child.x + Phaser.Math.Between(-100, 100),
              0,
              true,
              true
            );
            child.setVelocityX(Phaser.Math.Between(-200, 200));
          }
        }
      });
    }
  }

  if (stars.children) {
    stars.children.iterate(child => {
      if (child) {
        const starHeight = child.y;
        if (starHeight > 400) {
          child.disableBody(true, true);
          child.enableBody(true, child.x + 130, 0, true, true);
        }
      }
    });
  }
}

////////
////////////////
////////////////////////
////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////
////////////////////////
////////////////
////////

function start() {
  speechBubble.visible = false;
  instructionsPrompt.visible = false;
}

////////////////////////////////////////

function meow() {
  if (!meowCalled) {
    startMeow.play();
    meowCalled = true;
  }
}

////////////////////////////////////////

function pause() {
  if (!gamePaused) {
    gamePaused = true;
    pausedMessage.visible=true
    music.pause(); //pause music
    player.setVelocity(0, 0); //stop
    controlsWorking = false; //freeze
    if (bombsEnabled) {
      if (bombs.children) {
        bombs.children.iterate(child => {
          if (child) {
            child.disableBody(true, true); //remove all the bombs:
          }
        });
      }
    }
  } else {
    gamePaused = false;
    pausedMessage.visible=false
    music.play();
    if (bombsEnabled) {
      for (let i = 0; i < numBombs; i++) {
        bomb = bombs.create(Phaser.Math.Between(200, 4500), 0, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-100, 100), 20);
        bomb.allowGravity = false;
      }
    }
    controlsWorking = true;
  }
}

////////////////////////////////////////

function win(context) {
  if (bombsEnabled) {
    if (bombs.children) {
      bombs.children.iterate(child => {
        if (child) {
          child.disableBody(true, true); //remove all the bombs:
        }
      });
    }
  }

  music.pause();
  player.anims.play('turn');
  player.setVelocity(0, 0);
  controlsWorking = false;
  if (!wonCalled) {
    winMeow.play();
    winSound.play();
    wonCalled = true;
  }
  winBubble.visible = true;
  setTimeout(() => {
    replayButton.visible = true;
  }, 3000);
}

////////////////////////////////////////

function collectStar(player, star) {
  star.disableBody(true, true);
  //^^^disable physics body, set parent game obj inactive and invisible
  score += 1; //increase score
  scoreText.setText('score: ' + score); //change display text
  starSound.play();
}

////////////////////////////////////////

function hitBomb() {
  if (!shieldUp) {
    this.physics.pause(); //stop the game
    bombSound.play();
    player.setTint(0xff0000); //turn the player red
    player.anims.play('turn'); //make player face forward
    // bloodyDeath()
    gameOver = true;
  }
}

////////////////////////////////////////

function increaseDifficulty() {
  if (numBombs < 50) {
    numBombs++;
    if (bombsEnabled) {
      if (bombs.children) {
        bombs.children.iterate(child => {
          if (child) {
            child.disableBody(true, true); //remove all the bombs:
          }
        });
      }

      for (let i = 0; i < numBombs; i++) {
        bomb = bombs.create(Phaser.Math.Between(200, 4500), 0, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-100, 100), 20);
        bomb.allowGravity = false;
      }
    }
  }
}

function decreaseDifficulty() {
  if (numBombs > 0) {
    numBombs--;
    if (bombsEnabled) {
      if (bombs.children) {
        bombs.children.iterate(child => {
          if (child) {
            child.disableBody(true, true); //remove all the bombs:
          }
        });
      }

      for (let i = 0; i < numBombs; i++) {
        bomb = bombs.create(Phaser.Math.Between(200, 4500), 0, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-100, 100), 20);
        bomb.allowGravity = false;
      }
    }
  }
}

// function fireLaser(scene) {
//   // These are the offsets from the player's position that make it look like
//   // the laser starts from the gun in the player's hand
//   const offsetX = 56;
//   const offsetY = 14;
//   const laserX = player.x + (player.facingLeft ? -offsetX : offsetX);
//   const laserY = player.y + offsetY;

//   // Get the first available laser object that has been set to inactive
//   laserBolt = lasers.getFirstDead();
//   // Check if we can reuse an inactive laser in our pool of lasers
//   if (!laserBolt) {
//     // Create a laser bullet and scale the sprite down
//     laserBolt = new Laser(
//       scene,
//       laserX,
//       laserY,
//       'laserBolt',
//       player.facingLeft
//     ).setScale(0.25);
//     lasers.add(laserBolt);
//   }
//   laserBolt.reset(laserX, laserY, this.player.facingLeft);
// }

////////////////////////////////////////

// function shoot(bomb, laser) {
//   laser.setActive(false);
//   laser.setVisible(false);
//   bomb.disableBody(true, true);
//   bomb.enableBody(true, bomb.x + Phaser.Math.Between(-400, 400), 0, true, true);
//   bomb.setVelocityX(Phaser.Math.Between(-200, 200));
// }

////////////////////////////////////////

// function bloodyDeath(){
//   const blood = this.particles.add('blood')
//   const bleeder = blood.createEmitter({
//     speed: {min: -50, max: 50},
//     scale: {start: 0.2, end: 0.25},
//     alpha: {start: 1, end: 0},
//     lifespan: 2000 //in milliseconds (2 seconds)
//   })
//   bleeder.exploder(70, player.x, player.y)
//   player.visible = false
// }

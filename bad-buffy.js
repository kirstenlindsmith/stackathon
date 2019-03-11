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
let buffyBG;
let GroundLayer
let birds;
let trees;
let smallerTrees;
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
let settingsButton;
let settingsOpen;
let settingsMenu;
let difficultyLEVEL;
let difficultyUP;
let difficultyDOWN;
let flyingButton;
let birdsText;
let birdsUP;
let birdsDOWN;
let starsText;
let starsUP;
let starsDOWN;
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
// let gameStarted = false

//SETTINGS
const cheatMode = false;
let flying = false;
let musicPaused = false;
let controlsWorking = false;
// let lasersEnabled = false;
let starsEnabled = false;
let bombsEnabled = false;
let numBombs = 10;
let numBirds = 25;
let numStars = 60;
let starInterval = 49;
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
  this.load.tilemapTiledJSON('map', 'assets/BadBuffy/finalMap.json');
  this.load.image('tiles', 'assets/BadBuffy/mainTileset.png');
  this.load.image('decorations', 'assets/BadBuffy/erasedTileset.png');
  this.load.image(
    'mountainsandclouds',
    'assets/BadBuffy/mountainsandclouds.png'
  );
  this.load.image('tree', 'assets/BadBuffy/tallTree.png');
  this.load.image('smallerTree', 'assets/BadBuffy/mediumTree.png');
  this.load.image('star', 'assets/basic/star.png');
  this.load.image('bomb', 'assets/basic/bomb.png');
  this.load.image('shield', 'assets/BadBuffy/shield.png');
  // this.load.image('blood', 'assets/BadBuffy/particle.png');
  // this.load.image('laser', 'assets/BadBuffy/laser.png');
  this.load.image('speechBubble', 'assets/BadBuffy/speechBubble.png');
  this.load.image(
    'instructionsPrompt',
    'assets/BadBuffy/instructionsPrompt.png'
  );
  this.load.image('instructions', 'assets/BadBuffy/instructionsNOLASERS.png');
  this.load.image('gameOver', 'assets/BadBuffy/gameOver.png');
  this.load.image('paused', 'assets/BadBuffy/pausedMessage.png');
  this.load.image('replayButton', 'assets/BadBuffy/replayButton.png');
  this.load.image('winBubble', 'assets/BadBuffy/winBubble.png');
  this.load.image('buffyBG', 'assets/BadBuffy/bush.png');
  this.load.image('github', 'assets/BadBuffy/github.png');
  this.load.image('musicButton', 'assets/BadBuffy/musicButton.png');
  this.load.image('musicButtonEmpty', 'assets/BadBuffy/musicButtonEmpty.png');
  this.load.image('pauseButton', 'assets/BadBuffy/pauseButton.png');
  this.load.image('settingsButton', 'assets/BadBuffy/settings.png');
  this.load.image('settingsMenu', 'assets/BadBuffy/settingsMenu.png');
  this.load.image('flyingO', 'assets/BadBuffy/flyingO.png');
  this.load.image('flyingX', 'assets/BadBuffy/flyingX.png');
  this.load.image('difficultyUP', 'assets/BadBuffy/difficultyUP.png');
  this.load.image('difficultyDOWN', 'assets/BadBuffy/difficultyDOWN.png');
  this.load.image('birdsUP', 'assets/BadBuffy/birdsUP.png');
  this.load.image('birdsDOWN', 'assets/BadBuffy/birdsDOWN.png');
  this.load.image('starsUP', 'assets/BadBuffy/starsUP.png');
  this.load.image('starsDOWN', 'assets/BadBuffy/starsDOWN.png');

  // this.load.spritesheet('dude', 'assets/basic/kel.png', { //old sprite
  //   frameWidth: 32,
  //   frameHeight: 48,
  // });
  this.load.spritesheet('dude', 'assets/BadBuffy/kel2.png', {
    frameWidth: 16,
    frameHeight: 28,
  });
  this.load.spritesheet('buffy', 'assets/BadBuffy/meow.png', {
    frameWidth: 19,
    frameHeight: 21,
  });
  this.load.spritesheet('startText', 'assets/BadBuffy/clickToStart2.png', {
    frameWidth: 351,
    frameHeight: 250,
  });
  this.load.spritesheet('bird', 'assets/BadBuffy/bird.png', {
    frameWidth: 26,
    frameHeight: 25,
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
  bombsEnabled = false;
  //////////////////////////////////////////////////////////////////////
  // AUDIO
  //////////////////////////////////////////////////////////////////////
  music = this.sound.add('music', {
    loop: true,
    delay: 0,
  });

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
  GroundLayer = map.createStaticLayer('GroundLayer', tileset, 0, 0);

  //////////////////////////////////////////////////////////////////////
  // EXTRA TREES
  //////////////////////////////////////////////////////////////////////
  trees = this.physics.add.staticGroup({
    allowGravity: false,
  });
  smallerTrees = this.physics.add.staticGroup({
    allowGravity: false,
  });

  trees.create(3194, 257, 'tree').setScale(1.5);
  trees.create(3110, 257, 'tree').setScale(1.5);
  trees.create(2655, 258, 'tree').setScale(1.5);
  trees.create(2540, 210, 'tree').setScale(1.5);
  trees.create(2240, 258, 'tree').setScale(1.5);
  trees.create(1947, 242, 'tree').setScale(1.5);
  trees.create(1820, 258, 'tree').setScale(1.5);
  trees.create(1485, 258, 'tree').setScale(1.5);
  trees.create(1247, 226, 'tree').setScale(1.5);
  smallerTrees.create(1460, 261, 'smallerTree').setScale(1.5);
  smallerTrees.create(1150, 261, 'smallerTree').setScale(1.5);
  trees.create(985, 273, 'tree').setScale(1.5);
  smallerTrees.create(935, 277, 'smallerTree').setScale(1.5);
  trees.create(550, 258, 'tree').setScale(1.5);
  trees.create(249, 258, 'tree').setScale(1.5);
  smallerTrees.create(414, 213, 'smallerTree').setScale(1.5);

  //////////////////////////////////////////////////////////////////////
  // BIRDS
  //////////////////////////////////////////////////////////////////////

  birds = this.physics.add.group();

  for (let i = 0; i < numBirds; i++) {
    let bird = birds
      .create(Phaser.Math.Between(0, 3000), Phaser.Math.Between(20, 75), 'bird')
      .setScale(0.5);
    bird.body.allowGravity = false;
    bird.setVelocityX(Phaser.Math.Between(50, 60));
    bird.setDepth(0);
    bird.anims.msPerFrame = Phaser.Math.Between(7, 9);
  }

  this.anims.create({
    //animations created are available globally, belonging to the game objects themselves!
    key: 'fly',
    frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 3 }),
    frameRate: 7,
    repeat: -1,
    //use frames 0,1,2,3 at 10 fps, and -1 repeat tells it to loop
  });

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
  buffyBG = this.physics.add.staticSprite(3166, 270, 'buffyBG').setScale(1.5);

  buffy = this.physics.add.sprite(3166, 274, 'buffy');
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
    repeat: numStars - 1, //repeating x times means x+1stars total, (x + default 1)
    setXY: { x: 12, y: 0, stepX: starInterval },
    //first child will be born at 12, increasing across the x at intervals of 70px
  });

  if (!starsEnabled) {
    stars.children.iterate(child => {
      child.visible = false;
      child.body.allowGravity = false;
    });
  } else {
    stars.children.iterate(child => {
      child.body.allowGravity = true;
      child.visible = true;
    });
  }

  stars.children.iterate(child => {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    child.setScale(0.5);
  }); //vary the bounciness of the stars until they finally settle

  //////////////////////////////////////////////////////////////////////
  // BOMBS
  //////////////////////////////////////////////////////////////////////

  bombs = this.physics.add.group();
  if (bombsEnabled) {
    bombCollider = this.physics.add.collider(
      player,
      bombs,
      hitBomb,
      null,
      this
    ).name = 'bombCollider';
    this.physics.add.collider(bombs, GroundLayer);
    this.physics.add.collider(bombs, bombs);
    for (let i = 0; i < numBombs; i++) {
      bomb = bombs.create(Phaser.Math.Between(0, 3000), 0, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-100, 100), 20);
      bomb.allowGravity = false;
    }
  } else {
    bombCollider = this.physics.add.collider(
      player,
      bombs,
      null,
      null,
      this
    ).name = 'bombCollider';
    this.physics.add.collider(bombs, GroundLayer);
    this.physics.add.collider(bombs, bombs);
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

  scoreText = this.add.text(15, 30, 'score: 0', {
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

  instructions = this.physics.add.staticSprite(330, 200, 'instructions');
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
    .staticSprite(3078, 205, 'winBubble')
    .setScale(0.5);
  winBubble.visible = false;

  // gameOverMessage = this.physics.add.staticSprite(250, 250, 'gameOver')
  // gameOverMessage.allowGravity = false

  pausedMessage = this.physics.add
    .staticSprite(250, 160, 'paused')
    .setScale(0.5);
  pausedMessage.allowGravity = false;
  pausedMessage.visible = false;

  replayButton = this.add.sprite(3120, 46, 'replayButton').setInteractive();
  replayButton.on('pointerdown', () => {
    let currentScene = this.scene;
    music.pause();
    currentScene.restart();
  });
  replayButton.visible = false;

  pauseButton = this.add.sprite(33, 15, 'pauseButton').setInteractive();
  pauseButton.on('pointerdown', () => {
    pause();
  });
  pauseButton.setScrollFactor(0);

  musicButton = this.add
    .sprite(65, 15, 'musicButton')
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
    .sprite(65, 15, 'musicButtonEmpty')
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

  difficultyTEXT = this.add.text(125, 57, numBombs, {
    fontsize: '4px',
    fill: '#ffffff',
  });
  difficultyTEXT.setScrollFactor(0);

  difficultyUP = this.add
    .sprite(160, 65, 'difficultyUP')
    .setScale(0.4)
    .setInteractive();
  difficultyUP.on('pointerdown', () => {
    increaseDifficulty();
  });
  difficultyUP.setScrollFactor(0);

  difficultyDOWN = this.add
    .sprite(185, 65, 'difficultyDOWN')
    .setScale(0.4)
    .setInteractive();
  difficultyDOWN.on('pointerdown', () => {
    decreaseDifficulty();
  });
  difficultyDOWN.setScrollFactor(0);

  difficultyTEXT.visible = false;
  difficultyUP.visible = false;
  difficultyDOWN.visible = false;

  flyingX = this.add
    .sprite(137, 90, 'flyingX')
    .setScale(0.4)
    .setInteractive();
  flyingX.on('pointerdown', () => {
    flying = false;
    flyingX.visible = false;
    flyingO.visible = true;
  });
  flyingX.setScrollFactor(0);

  flyingO = this.add
    .sprite(137, 90, 'flyingO')
    .setScale(0.4)
    .setInteractive();
  flyingO.on('pointerdown', () => {
    flying = true;
    flyingO.visible = false;
    flyingX.visible = true;
  });
  flyingO.setScrollFactor(0);

  flyingO.visible = false;
  flyingX.visible = false;

  birdsText = this.add.text(75, 106, numBirds, {
    fontsize: '4px',
    fill: '#ffffff',
  });
  birdsText.setScrollFactor(0);
  birdsText.visible = false;

  birdsUP = this.add
    .sprite(110, 115, 'birdsUP')
    .setScale(0.4)
    .setInteractive();
  birdsUP.on('pointerdown', () => {
    increaseBirds();
  });
  birdsUP.setScrollFactor(0);
  birdsUP.visible = false;

  birdsDOWN = this.add
    .sprite(135, 115, 'birdsDOWN')
    .setScale(0.4)
    .setInteractive();
  birdsDOWN.on('pointerdown', () => {
    decreaseBirds();
  });
  birdsDOWN.setScrollFactor(0);
  birdsDOWN.visible = false;

  starsText = this.add.text(75, 129, numStars, {
    fontsize: '4px',
    fill: '#ffffff',
  });
  starsText.setScrollFactor(0);
  starsText.visible = false;

  starsUP = this.add
    .sprite(110, 137, 'starsUP')
    .setScale(0.4)
    .setInteractive();
  starsUP.on('pointerdown', () => {
    increaseStars();
  });
  starsUP.setScrollFactor(0);
  starsUP.visible = false;

  starsDOWN = this.add
    .sprite(135, 137, 'starsDOWN')
    .setScale(0.4)
    .setInteractive();
  starsDOWN.on('pointerdown', () => {
    decreaseStars();
  });
  starsDOWN.setScrollFactor(0);
  starsDOWN.visible = false;

  settingsMenu = this.add.sprite(70, 100, 'settingsMenu');
  settingsMenu.setScrollFactor(0);
  settingsMenu.visible = false;
  settingsMenu.setDepth(1);

  settingsButton = this.add.sprite(90, 15, 'settingsButton').setInteractive();
  settingsButton.on('pointerdown', () => {
    if (!settingsOpen) {
      settingsOpen = true;
      settingsMenu.visible = true;
      difficultyTEXT.visible = true;
      difficultyUP.visible = true;
      difficultyDOWN.visible = true;
      flyingO.visible = true;
      flyingX.visible = true;
      birdsText.visible = true;
      starsText.visible = true;
      birdsUP.visible = true;
      birdsDOWN.visible = true;
      starsUP.visible = true;
      starsDOWN.visible = true;
    } else {
      settingsOpen = false;
      settingsMenu.visible = false;
      difficultyTEXT.visible = false;
      difficultyUP.visible = false;
      difficultyDOWN.visible = false;
      flyingO.visible = false;
      flyingX.visible = false;
      birdsText.visible = false;
      starsText.visible = false;
      birdsUP.visible = false;
      birdsDOWN.visible = false;
      starsUP.visible = false;
      starsDOWN.visible = false;
    }
  });
  settingsButton.setScrollFactor(0)

  githubButton = this.add.sprite(450, 324, 'github').setInteractive();
  githubButton.on('pointerdown', () => {
    window.location.href = 'https://github.com/kirstenlindsmith/stackathon';
  });
  githubButton.setScrollFactor(0);

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
  if (bombsEnabled) {
    this.physics.add.collider(bombs, GroundLayer);
    this.physics.add.collider(bombs, bombs);
  }
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
  // if (player.anims.currentFrame) {
  //   console.log('CURRENT FRAME: ', player.anims.currentFrame.textureFrame);
  //   // console.log('TOTAL FRAMES: ', player.anims.getTotalFrames())
  // }
  player.anims.play('turn');
  this.input.on(
    'pointerdown',
    event => {
      //on mouse click...
      // if (!gameStarted){
        gameStarted = true
        if (!music.isPlaying) music.play();
        startText.visible = false;
        speechBubble.visible = true;
        controlsWorking = true;
        starsEnabled = true;
        stars.children.iterate(child => {
          child.body.allowGravity = true;
          child.visible = true;
        });
        bombsEnabled = true;
        bombCollider = this.physics.add.collider(
          player,
          bombs,
          hitBomb,
          null,
          this
        ).name = 'bombCollider';
        this.physics.add.collider(bombs, GroundLayer);
        this.physics.add.collider(bombs, bombs);
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
    //  }
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
  birdsText.setText(numBirds);
  starsText.setText(numStars);
  
  // if (!bombs.children.length){
  //   for (let i = 0; i < numBombs; i++) {
  //     bomb = bombs.create(Phaser.Math.Between(0, 3000), 0, 'bomb');
  //     bomb.setBounce(1);
  //     bomb.setCollideWorldBounds(true);
  //     bomb.setVelocity(Phaser.Math.Between(-100, 100), 20);
  //     bomb.allowGravity = false;
  //   }
  // }

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
      player.anims.play('left');
      player.play('left');
    } else if (cursors.right.isDown) {
      player.setVelocityX(100);
      player.anims.play('right');
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
    } else {
      instructions.visible = false;
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

  if (birds.children) {
    birds.children.iterate(child => {
      child.anims.play('fly', true);
    });
  }
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

  //Star rebirth settings: (for if they fall)
  if (starsEnabled) {
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

  //Bird rebirth settings: (for if they fly off the map)
  if (birds.children) {
    birds.children.iterate(child => {
      if (child) {
        const birdDistance = child.x;
        if (birdDistance > 3200) {
          child.disableBody(true, true);
          child.enableBody(true, 0, Phaser.Math.Between(20, 75), true, true);
          child.body.allowGravity = false;
          child.setVelocityX(Phaser.Math.Between(50, 60));
        }
      }
    });
  } //50/60,
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
    pausedMessage.visible = true;
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
    if (birds.children) {
      birds.children.iterate(child => {
        if (child) {
          child.disableBody(true, true); //and birds:
        }
      });
    }
  } else {
    gamePaused = false;
    pausedMessage.visible = false;
    music.play();
    if (bombsEnabled) {
      bombCollider = this.physics.add.collider(
        player,
        bombs,
        hitBomb,
        null,
        this
      ).name = 'bombCollider';
      this.physics.add.collider(bombs, GroundLayer);
      this.physics.add.collider(bombs, bombs);
      for (let i = 0; i < numBombs; i++) {
        bomb = bombs.create(Phaser.Math.Between(0, 3000), 0, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-100, 100), 20);
        bomb.allowGravity = false;
      }
    }
    for (let i = 0; i < numBirds; i++) {
      let bird = birds
        .create(
          Phaser.Math.Between(20, 3000),
          Phaser.Math.Between(20, 75),
          'bird'
        )
        .setScale(0.5);
      bird.body.allowGravity = false;
      bird.setVelocityX(100);
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
  if (!shieldUp && bombsEnabled) {
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
        // recreate them at approprite amount
        bomb = bombs.create(Phaser.Math.Between(0, 3000), 0, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-100, 100), 20);
        bomb.allowGravity = false;
      }
    }
  }
}

////////////////////////////////////////

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
        //recreate them at appropriate amount
        bomb = bombs.create(Phaser.Math.Between(0, 3000), 0, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-100, 100), 20);
        bomb.allowGravity = false;
      }
    }
  }
}

////////////////////////////////////////

function increaseBirds() {
  starsEnabled = true;
  if (numBirds < 99) {
    numBirds++;
    if (birds.children) {
      birds.children.iterate(child => {
        if (child) {
          child.disableBody(true, true); //remove all the birds:
        }
      });
    }

    for (let i = 0; i < numBirds; i++) {
      //recreate them at appropriate amount
      let bird = birds
        .create(
          Phaser.Math.Between(0, 3000),
          Phaser.Math.Between(20, 75),
          'bird'
        )
        .setScale(0.5);
      bird.body.allowGravity = false;
      bird.setVelocityX(Phaser.Math.Between(50, 60));
      bird.setDepth(0);
      bird.anims.msPerFrame = Phaser.Math.Between(7, 9);
    }
  }
}

////////////////////////////////////////

function decreaseBirds() {
  starsEnabled = true;
  if (numBirds > 0) {
    numBirds--;
    if (birds.children) {
      birds.children.iterate(child => {
        if (child) {
          child.disableBody(true, true); //remove all the birds:
        }
      });
    }

    for (let i = 0; i < numBirds; i++) {
      //recreate them at appropriate amount
      let bird = birds
        .create(
          Phaser.Math.Between(0, 3000),
          Phaser.Math.Between(20, 75),
          'bird'
        )
        .setScale(0.5);
      bird.body.allowGravity = false;
      bird.setVelocityX(Phaser.Math.Between(50, 60));
      bird.setDepth(0);
      bird.anims.msPerFrame = Phaser.Math.Between(7, 9);
    }
  }
}

////////////////////////////////////////

function increaseStars() {
  if (numStars < 99) {
    numStars++;
    starInterval--;
    if (stars.children) {
      stars.children.iterate(child => {
        if (child) {
          child.disableBody(true, true); //remove all the stars:
        }
      });
    }

    for (let i = 0; i <= numStars; i++) {
      let star = stars.create(0 + i * starInterval, 0, 'star'); //recreate them at appropriate amount
      star.setScale(0.5);
      star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    }
  }
}

////////////////////////////////////////

function decreaseStars() {
  if (numStars > 0) {
    numStars--;
    if (stars.children) {
      stars.children.iterate(child => {
        if (child) {
          child.disableBody(true, true); //remove all the stars:
        }
      });
    }
    for (let i = 0; i <= numStars; i++) {
      //recreate them at appropriate amount
      let star = stars.create(0 + i * starInterval, 0, 'star');
      star.setScale(0.5);
      star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    }
  }
}

////////////////////////////////////////

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

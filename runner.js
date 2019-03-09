
const config = {
  type: Phaser.AUTO,
  width: 3200,
  height: 320,
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
let cursors;
let score = 0;
let scoreText;
let startText;
let winBubble;
let speechBubble;
let gameOver = false;
let gameOverText;

let bombsEnabled = false

function preload() {
  this.load.setCORS('anonymous'); //required to load script tag from outside source

  this.load.image('tiles', 'assets/runner/mainTileset.png');
  this.load.image('mountainsandclouds', 'assets/runner/mountainsandclouds.png')
  this.load.image('coin', 'assets/runner/coin.png')
  this.load.image('star', 'assets/basic/star.png');
  this.load.image('bomb', 'assets/basic/bomb.png')
  this.load.image('speechBubble', 'assets/runner/speechBubble.png')
  this.load.image('winBubble', 'assets/runner/winBubble.png')
  this.load.tilemapTiledJSON('map', 'assets/runner/MAP2.json');
  this.load.spritesheet('dude', 'assets/basic/kel.png', {
    frameWidth: 32,
    frameHeight: 48,
  });
  this.load.spritesheet('buffy', 'assets/runner/buffy.png', {
    frameWidth: 43,
    frameHeight: 32,
  })
}

function create() {
  //////////////////////////////////////////////////////////////////////
  // MAP
  //////////////////////////////////////////////////////////////////////

  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('mainTileset', 'tiles');
  const bgTiles = map.addTilesetImage('mountainsandclouds', 'mountainsandclouds')
  //^^^first arg is the name given to the tilesheet when importing it into Tiled
  //second arg is the key given to the asset in Phaser

  //////////////////////////////////////////////////////////////////////
  // LAYERS
  //////////////////////////////////////////////////////////////////////

  const BackgroundLayer = map.createStaticLayer('BackgroundLayer', bgTiles, 0, 0);
  const GroundLayer = map.createStaticLayer('GroundLayer', tileset, 0, 0);

  // MoneyLayer = map.getObjectLayer('MoneyLayer')['objects']

  //////////////////////////////////////////////////////////////////////
  // PLAYER
  //////////////////////////////////////////////////////////////////////

  player = this.physics.add.sprite(20, 260, 'dude').setScale(0.8);
  //this.physics.add defaults to a dynamic body (vs static)

  player.setBounce(0.3); //will bounce slightly when landing
  player.body.setGravityY(400); //body property references its arcade physics body
  //if this ^^^ wasn't here it would default to 300, as seen on line 23

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
  buffy = this.physics.add.sprite(3170, 270, 'buffy')
  this.anims.create({
    //animations created are available globally, belonging to the game objects themselves!
    key: 'curl',
    frames: this.anims.generateFrameNumbers('buffy', { start: 0, end: 1 }),
    frameRate: 2,
    repeat: -1,
    //use frames 0,1,2,3 at 10 fps, and -1 repeat tells it to loop
  });

  //(note: no need for event listeners, the keyboard manager is built into Phaser)
  cursors = this.input.keyboard.createCursorKeys();
  //populates the cursors obj w/ 4 props: up, down, left, right
  //each directional property is an instance of a Key object
  //these will be polled in the update loop

  //////////////////////////////////////////////////////////////////////
  // STARS
  //////////////////////////////////////////////////////////////////////

  stars = this.physics.add.group({
    //add.group can take config obj for settings!
    key: 'star', //texture key is the star image
    repeat: 57, //repeating x times means x+1stars total, (x + default 1)
    setXY: { x: 12, y: 0, stepX: 50 },
    //first child will be born at 12, increasing across the x at intervals of 70px
  });

  stars.children.iterate(child => {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    child.setScale(0.5)
  }); //vary the bounciness of the stars until they finally settle <3

  //////////////////////////////////////////////////////////////////////
  // BOMBS
  //////////////////////////////////////////////////////////////////////

  if(bombsEnabled){
    bombs = this.physics.add.group(); //remember, default is dynamic body
    
    for(let i=0; i<20; i++){
      bomb = bombs.create(Phaser.Math.Between(200, 4500), 0, 'bomb')
      bomb.setBounce(1)
      bomb.setCollideWorldBounds(true)
      bomb.setVelocity(Phaser.Math.Between(-100, 100), 20)
      bomb.allowGravity = false
    }
  }

  //////////////////////////////////////////////////////////////////////
  // TEXT
  //////////////////////////////////////////////////////////////////////

  scoreText = this.add.text(15, 15, 'score: 0', {
    fontsize: '6',
    fill: '#000000',
  });//font will default to Courier
  scoreText.setScrollFactor(0)
  
  speechBubble = this.physics.add.staticSprite(100, 200, 'speechBubble').setScale(0.5);
  
  winBubble = this.physics.add.staticSprite(3070, 200, 'winBubble').setScale(0.5);
  winBubble.visible = false

  //////////////////////////////////////////////////////////////////////
  // COLLISIONS
  //////////////////////////////////////////////////////////////////////

  map.setCollisionBetween(0, 923, true, 'GroundLayer');
  player.setCollideWorldBounds(true); //player can't leave the game area
  buffy.setCollideWorldBounds(true)
  this.physics.add.collider(player, GroundLayer);
  this.physics.add.collider(buffy, GroundLayer);
  this.physics.add.collider(stars, GroundLayer);
  this.physics.add.collider(player, bombs, hitBomb, null, this);
  this.physics.add.overlap(player, stars, collectStar, null, this);
  if (bombsEnabled) this.physics.add.collider(bombs, GroundLayer);

  //////////////////////////////////////////////////////////////////////
  // CAMERA
  //////////////////////////////////////////////////////////////////////
  this.cameras.main.setBounds(0, 0, 3200, 400);
  this.cameras.main.setSize(500, 500);
  this.cameras.main.startFollow(player);

}

function update() {
  console.log('player x', player.body.x)
  if (player.body.x > 20){
    speechBubble.disableBody(true,true)
  }
  
  //DEATH CONDITIONS:
  if (gameOver) {
    gameOver=false
    const currentScene = this.scene
    gameOverText = this.add.text(player.x - 40, player.y - 40, 'GAME OVER', {
      fontsize: '40px',
      fill: '#ffffff',
    });
    this.time.addEvent({
      delay: 2000,
      callback: ()=> this.add.text(player.x - 40, player.y - 60, 'restarting...', {
        fontsize: '10pt',
        fill: '#ff0000',
      }),
      callbackScope: this
    })
    this.time.addEvent({
      delay: 3000,
      callback: ()=> currentScene.restart(), //restart the game
      callbackScope: this
    })
  }
  if (player.body.y > 280) { //if the player falls
    gameOver = false;
    const currentScene = this.scene
    gameOverText = this.add.text(player.x - 40, player.y - 40, 'GAME OVER', {
      fontsize: '40pt',
      fill: '#ffffff',
    });
    this.time.addEvent({
      delay: 2000,
      callback: ()=> this.add.text(player.x - 40, player.y - 60, 'restarting...', {
        fontsize: '10pt',
        fill: '#ff0000',
      }),
      callbackScope: this
    })
    
    this.time.addEvent({
      delay: 3000,
      callback: ()=> currentScene.restart(), //restart the game
      callbackScope: this
    })
    player.visible = false
  }
  
  //WIN CONDITION:
  if (player.body.x > 3050){
    winBubble.visible = true
  }
  
//CONTROLS:

  if (cursors.left.isDown) {
    player.setVelocityX(-100);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(100);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }
  
  buffy.anims.play('curl', true)

  // if (cursors.up.isDown && player.body.onFloor()) {
  //   player.setVelocityY(-330);
  // }

  // flying mode:
  if (cursors.up.isDown) {
    player.setVelocityY(-330);
  }

  if (cursors.down.isDown) {
    player.setVelocityY(250)
  }
  
  if (bombsEnabled){
    if(bombs.children){
      bombs.children.iterate(child=> {
        if (child){
          const bombHeight = child.y
          if (bombHeight > 281){
            child.disableBody(true,true)
            child.enableBody(true, child.x+(Phaser.Math.Between(-100, 100)), 0, true, true)
            child.setVelocityX(Phaser.Math.Between(-200, 200))
          }
        }
      })
    }
  }
  
  if(stars.children){
    stars.children.iterate(child=> {
      if (child){
        const starHeight = child.y
        if (starHeight > 400){
          child.disableBody(true,true)
          child.enableBody(true, child.x+130, 0, true, true)
        }
      }
    })
  }
  
  // if(bombs.children){ //RAIN OF INFINITE BOMBS
  //   bombs.children.iterate(child=> {
  //     if (child){
  //       const bombHeight = child.y
  //       if (bombHeight > 280){
  //         bombs.create(Phaser.Math.Between(200, 4500), 0, 'bomb')
  //       }
  //     }
  //   })
  // }
}

function collectStar(player, star) {
  star.disableBody(true, true);
  //^^^disable physics body, set parent game obj inactive and invisible
  score += 1; //increase score
  scoreText.setText('score: ' + score); //change display text
}

function hitBomb(player, bomb) {
  this.physics.pause(); //stop the game
  player.setTint(0xff0000); //turn the player red
  player.anims.play('turn'); //make him face forward
  gameOver = true; //what it says on the tin
}

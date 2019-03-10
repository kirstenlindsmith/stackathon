const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

//GLOBAL GAME OBJECT VARIABLES:
const game = new Phaser.Game(config);
let player;
let stars;
let bombs;
let platforms;
let ground;
let cursors;
let score = 0
let scoreText;
let gameOver = false
let gameOverText;

function preload() {
  // this.load.setCORS('anonymous'); //SOMETIMES required to load script tag from outside source

  this.load.image('sky', 'assets/basic/sky2.png');
  this.load.image('platform', 'assets/basic/platform2.png');
  this.load.image('ground', 'assets/basic/platform2Main.png')
  this.load.image('star', 'assets/basic/star.png');
  this.load.image('bomb', 'assets/basic/bomb.png');
  this.load.spritesheet('dude', 'assets/basic/kel.png', {
    frameWidth: 32,
    frameHeight: 48,
  });
}


function create() {
  //this.add.image creates a new game object an adds it to the display list
  //images are layered in the order they are created, so create background images first!
  this.add.image(0, 0, 'sky').setOrigin(0, 0); //setOrigin resets drawing position of the image to top left. otherwise, the image would need to be loaded like this.add.image(400, 300, 'sky') to center it correctly
  
  //////////////////////////////////////////////////////////////////////
  // PLATFORMS
  //////////////////////////////////////////////////////////////////////

  platforms = this.physics.add.staticGroup();
  ground = this.physics.add.staticGroup();
  //calls to this.physics reference the arcade physics system

  // platforms.create(400, 568, 'platform').setScale(2).refreshBody();
  //setScale is making it twice as big, to fill up the entire bottom of the screen
  //refreshBody is telling the physics world about the change to a static body
  ground.create(400,568, 'ground')

  platforms.create(600, 400, 'platform');
  platforms.create(50, 250, 'platform');
  platforms.create(750, 220, 'platform');

  //////////////////////////////////////////////////////////////////////
  // PLAYER
  //////////////////////////////////////////////////////////////////////
  
  player = this.physics.add.sprite(100, 450, 'dude');
  //this.physics.add defaults to a dynamic body (vs static)

  player.setBounce(0.3); //will bounce slightly when landing
  player.setCollideWorldBounds(true); //now he can't leave the page
  //player.body.setGravityY(300); //body property references its arcade physics body
  //if this ^^^ wasn't here it would default to 300, as seen on line 23

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

  //////////////////////////////////////////////////////////////////////
  // CONTROLS
  //////////////////////////////////////////////////////////////////////
  
  //(note: no need for event listeners, the keyboard manager is built into Phaser)
  cursors = this.input.keyboard.createCursorKeys();
  //populates the cursors obj w/ 4 props: up, down, left, right
  //each directional property is an instance of a Key object
  //these will be polled in the update loop
  
  //////////////////////////////////////////////////////////////////////
  // STARS
  //////////////////////////////////////////////////////////////////////
  
  stars = this.physics.add.group({ //add.group can take config obj for settings!
    key: 'star', //texture key is the star image
    repeat: 11, //repeating 11 times means 12 stars total, (11 + default 1)
    setXY: { x: 12, y: 0, stepX: 70 }
    //first child will be born at 12, increasing across the x at intervals of 70px
  })
  
  stars.children.iterate(child=> {
    child.setBounceY(Phaser.Math.FloatBetween(0.4,0.8))
  }) //vary the bounciness of the stars until they finally settle <3
  
  //////////////////////////////////////////////////////////////////////
  // BOMBS
  //////////////////////////////////////////////////////////////////////
  
  bombs = this.physics.add.group() //remember, default is dynamic body
  
  //////////////////////////////////////////////////////////////////////
  // SCORE TEXT
  //////////////////////////////////////////////////////////////////////
  
  scoreText = this.add.text(16, 16, 'score: 0', {fontsize: '32px', fill: '#ffffff'})
  //16x16 is the coords to display the text
  //'score: 0' is the default string
  //last is the styling (defaults font to Courier)
  
  //////////////////////////////////////////////////////////////////////
  // COLLISIONS
  //////////////////////////////////////////////////////////////////////
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(player, ground);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(stars, ground);
  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(bombs, ground);
  
  this.physics.add.overlap(player, stars, collectStar, null, this)
  this.physics.add.collider(player, bombs, hitBomb, null, this)
}

function update() {
  
  if (gameOver) {
    gameOver = this.add.text(player.x-40, player.y-40, 'GAME OVER', {fontsize: '40px', fill: '#000'})
    return;
  }  
  
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
  
  // flying mode:
  // if (cursors.up.isDown) {
  //   player.setVelocityY(-330);
  // }
  
  // if (cursors.down.isDown) {
  //   player.setVelocityY(250)
  // }
  
}

function collectStar(player, star){
  star.disableBody(true,true)
  //^^^disable physics body, set parent game obj inactive and invisible
  score += 10 //increase score
  scoreText.setText('score: ' + score) //change display text
  
  if (stars.countActive(true) === 0){//if you got all the stars
    stars.children.iterate(child=>{ //bring them all back!
      child.enableBody(true, child.x, 0, true, true)
    })
    
    const xCoordBirthPlaceOfBomb = (player.x < 400) ? Phaser.Math.Between(400,800) : Phaser.Math.Between(0,400)
    
    const bomb = bombs.create(xCoordBirthPlaceOfBomb, 16, 'bomb')
    bomb.setBounce(1) //FULL bounce
    bomb.setCollideWorldBounds(true) //make it bounce around within the world box
    bomb.setVelocity(Phaser.Math.Between(-200,200), 20)
  }
}

function hitBomb(player, bomb){
  this.physics.pause() //stop the game
  player.setTint(0xff0000) //turn the player red
  player.anims.play('turn') //make him face forward
  gameOver = true //what it says on the tin
}

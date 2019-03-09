let game;

const gameOptions = {
  bigCircleRadius: 250,
  // bigCircleRadius: 320,
  playerRadius: 25,
  playerSpeed: 1,
  worldGravity: 0.8,
  jumpForce: [12, 8, 4, 2], //first jump, and double jump
  spikeSize: [25, 50],
  closeToSpike: 10, //degrees
  farFromSpike: 25, //degrees
};

window.onload = function() {
  const gameConfig = {
    thpe: Phaser.CANVAS,
    width: 800,
    height: 800,
    scene: [playGame],
  };
  game = new Phaser.Game(gameConfig);
  window.focus();
  resize();
  window.addEventListener('resize', resize, false);
};
class playGame extends Phaser.Scene {
  constructor() {
    super('PlayGame');
  }
  preload() {
    this.load.image('sky', 'assets/circle/sky2.png');
    this.load.image('bigcircle', 'assets/circle/bigcircleEarth.png');
    this.load.image('bigcircle', 'assets/circle/bigcircle.png');
    // this.load.image('player', 'assets/circle/player.png');
    this.load.image('player', 'assets/circle/katamari1.png');
    this.load.image('spike', 'assets/circle/spikeEarth.png');
    this.load.image('mask', 'assets/circle/mask.png');
    this.load.image('particle', '/assets/circle/particle.png')
  }
  create() {
    this.gameOver = false
    this.add.image(0, 0, 'sky').setOrigin(0, 0);
    
    //WORLD
    this.bigCircle = this.add.sprite(
      game.config.width / 2,
      game.config.height / 2,
      'bigcircle'
    );
    this.bigCircle.displayWidth = gameOptions.bigCircleRadius * 2;
    this.bigCircle.displayHeight = gameOptions.bigCircleRadius * 2;

    //PLAYER
    this.player = this.add.sprite(
      game.config.width / 2,
      game.config.height / 2 -
        gameOptions.bigCircleRadius -
        gameOptions.playerRadius,
      'player'
    );
    this.player.displayWidth = gameOptions.playerRadius * 2;
    this.player.displayHeight = gameOptions.playerRadius * 2;
    this.player.currentAngle = -90;
    //starting angle of the player object
    this.player.jumpOffset = 0;
    //number of pixels added to player position when it jumps
    this.player.jumps = 0;
    this.player.jumpForce = 0;
    
    //SPIKE GROUP
    this.spikeGroup = this.add.group();
    
    //SPAWN SPIKES
    for (let i = 0; i < 6; i++) {
      const spike = this.add.sprite(0, 0, 'spike');
      spike.setOrigin(0, 0.5); //left and horizontal middle
      this.spikeGroup.add(spike);
      this.placeSpike(spike, Math.floor(i / 2));
      //place spike in the world quadrant index/2 rounded down
    }

    //JUMP INPUT
    this.input.on(
      'pointerdown',
      event => {
        //on mouse click...
        if (this.player.jumps < gameOptions.jumpForce.length) {
          //if player allowed to keep jumping...
          this.player.jumps++;
          this.player.jumpForce = gameOptions.jumpForce[this.player.jumps - 1];
          //match the jumpForce to the appropriate array position in the config
        }
      },
      this
    );

    //MASK
    //acts like fog to hide and show spikes smoothly
    this.maskImage = this.add.sprite(
      game.config.width / 2,
      game.config.height / 2,
      'mask'
    );
  }

  placeSpike(spike, quadrant) {
    let randomAngle = Phaser.Math.Between(quadrant * 90, (quadrant + 1) * 90);
    randomAngle = Phaser.Math.Angle.WrapDegrees(randomAngle);
    const randomAngleRadians = Phaser.Math.DegToRad(randomAngle);
    const spikeX =
      this.bigCircle.x +
      (gameOptions.bigCircleRadius - 4) * Math.cos(randomAngleRadians);
    const spikeY =
      this.bigCircle.y +
      (gameOptions.bigCircleRadius - 4) * Math.sin(randomAngleRadians);
    spike.x = spikeX;
    spike.y = spikeY;
    spike.quadrant = quadrant;
    spike.angle = randomAngle;

    //save the three spike vertices in custom properties (top, and both base points):
    spike.top = new Phaser.Math.Vector2(
      spikeX + gameOptions.spikeSize[1] * Math.cos(randomAngleRadians),
      spikeY + gameOptions.spikeSize[1] * Math.sin(randomAngleRadians)
    );
    spike.base1 = new Phaser.Math.Vector2(
      spikeX +
        (gameOptions.spikeSize[0] / 2) *
          Math.cos(randomAngleRadians + Math.PI / 2),
      spikeY +
        (gameOptions.spikeSize[0] / 2) *
          Math.sin(randomAngleRadians + Math.PI / 2)
    );
    spike.base2 = new Phaser.Math.Vector2(
      spikeX +
        (gameOptions.spikeSize[0] / 2) *
          Math.cos(randomAngleRadians - Math.PI / 2),
      spikeY +
        (gameOptions.spikeSize[0] / 2) *
          Math.sin(randomAngleRadians - Math.PI / 2)
    );
    spike.approaching = false;
  }

  update() { //executed for each animation frame
    
    if (!this.gameOver){ //if the game is running...
      
      if (this.player.jumps > 0) {
        //if the player is jumping...
        this.player.jumpOffset += this.player.jumpForce;
        //move the player relative to the force of the jump
        this.player.jumpForce -= gameOptions.worldGravity;
        //make sure jumpForce is constrained by gravity
  
        if (this.player.jumpOffset < 0) {
          //if player touched the ground...
          //reset all the jumping props
          this.player.jumpOffset = 0;
          this.player.jumps = 0;
          this.player.jumpForce = 0;
        }
      }
      //set the player's angle on the world based on position and speed:
      this.player.currentAngle = Phaser.Math.Angle.WrapDegrees(
        this.player.currentAngle + gameOptions.playerSpeed
      );
  
      //move the mask image according to player's position:
      this.maskImage.angle = this.player.currentAngle + 90;
  
      const radians = Phaser.Math.DegToRad(this.player.currentAngle);
      const distanceFromCenter =
        (gameOptions.bigCircleRadius * 2 + gameOptions.playerRadius * 2) / 2 +
        this.player.jumpOffset;
  
      //fancy trigonometry to position the player
      this.player.x = this.bigCircle.x + distanceFromCenter * Math.cos(radians);
      this.player.y = this.bigCircle.y + distanceFromCenter * Math.sin(radians);
  
      //number of revolutions the player has to move according to the planet and player size:
      const revolutions =
        (gameOptions.bigCircleRadius * 2) / (gameOptions.playerRadius * 2) + 1;
  
      this.player.angle = this.player.currentAngle * revolutions;
  
      // looping through each spike, as child of spikeGroup
      this.spikeGroup.children.iterate(function(spike) {
        // getting angle difference between the spike and the player
        var angleDiff = this.getAngleDifference(
          spike.angle,
          this.player.currentAngle
        );
  
        // if the player is NOT approaching the spike but it's close enough...
        if (!spike.approaching && angleDiff < gameOptions.closeToSpike) {
          // player is approaching the spike
          spike.approaching = true;
        }
  
        // if the player is approaching the spike...
        if (spike.approaching) {
          // check for collisions between the player and the two spike surfaces
          if (
            this.distToSegmentSquared(
              new Phaser.Math.Vector2(this.player.x, this.player.y),
              gameOptions.playerRadius,
              spike.top,
              spike.base1
            ) ||
            this.distToSegmentSquared(
              new Phaser.Math.Vector2(this.player.x, this.player.y),
              gameOptions.playerRadius,
              spike.top,
              spike.base2
            )
          ) {
            /////////GAME OVER EFFECTS///////////
            this.gameOver = true;
            this.cameras.main.shake(800,0.01)
            this.time.addEvent({ //wait...
              delay: 2000, //in milliseconds (2 seconds)
              callback: ()=> this.scene.start('PlayGame'), //restart the game
              callbackScope: this
            })
            //while we're waiting for that 2 seconds to pass...make the visual fx
            const particles = this.add.particles('particle')
            const particleEmitter = particles.createEmitter({
              speed: {min: -50, max: 50},
              scale: {start: 0.2, end: 0.25},
              alpha: {start: 1, end: 0},
              lifespan: 2000 //in milliseconds (2 seconds)
            })
            
            //use the emitter to create an explosion!
            particleEmitter.explode(70, this.player.x, this.player.y)
            //...of 70 particles, at the player's position
            
            //and hide the player...he died!
            this.player.visible = false
          }
  
          // if the player is getting too far from the spike...
          if (angleDiff > gameOptions.farFromSpike) {
            // recycle the spike and move it in a random position three quadrants further
            this.placeSpike(spike, (spike.quadrant + 3) % 4);
          }
        }
      }, this);
    }
  }
  
  getAngleDifference(angle1, angle2) {
    let angleDifference = angle1 - angle2;
    angleDifference +=
      angleDifference > 180 ? -360 : angleDifference < -180 ? 360 : 0;
    return Math.abs(angleDifference);
  }
  
  getDistance(position1, position2) {
    return (
      (position1.x - position2.x) * (position1.x - position2.x) +
      (position1.y - position2.y) * (position1.y - position2.y)
    );
  }
  
  //this function checks to see if the player is touching a spike's line segment:
  distToSegmentSquared(circleCenter, circleRadius, segmentStart, segmentEnd) {
    var segmentDistance = this.getDistance(segmentStart, segmentEnd);
    var t =
      ((circleCenter.x - segmentStart.x) * (segmentEnd.x - segmentStart.x) +
        (circleCenter.y - segmentStart.y) * (segmentEnd.y - segmentStart.y)) /
      segmentDistance;
    t = Math.max(0, Math.min(1, t));
    var tX = segmentStart.x + t * (segmentEnd.x - segmentStart.x);
    var tY = segmentStart.y + t * (segmentEnd.y - segmentStart.y);
    var tPoint = {
      x: tX,
      y: tY,
    };
    return this.getDistance(circleCenter, tPoint) < circleRadius * circleRadius;
  }
}

function resize() {
  var canvas = document.querySelector('canvas');
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = game.config.width / game.config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + 'px';
    canvas.style.height = windowWidth / gameRatio + 'px';
  } else {
    canvas.style.width = windowHeight * gameRatio + 'px';
    canvas.style.height = windowHeight + 'px';
  }
}

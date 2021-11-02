function Hotpoint(jsonObj) {
  this.info = jsonObj;
  this.radius = this.info.radius;
  this.fill = '';
  this.url = this.info.url;
  this.isInside = false;
  this.players = [];

  this.sprite = createSprite(this.info.left,  this.info.top,  this.info.radius, this.info.radius);
  this.sprite.draw = _ => { 
    ellipse(0, 0, this.info.radius, this.info.radius) 
  }
  
  if (this.info.type == 'circle') {
    this.sprite.setCollider("circle");
  }
    
  this.sprite.debug = true;
  this.sprite.visible = true;
    
  this.draw = function() {
    let myStations = newStations.filter(station => { return station.hotpoint == this });
    myStations = myStations.sort((s1, s2)  => { return s1.timestamp > s2.timestamp ? 1 : -1;});
    let players = myStations.map(station => { return station.player });

    for (let i = 0; i < players.length; i++) {
      if(configuration.luce) {
        this.showRing();
      }
    }

    if (this.info.type == 'circle') {
      noFill();
      if (configuration.isDebug) { 
        noStroke();
      } else {
        noStroke();
      }

      ellipse(this.info.left, this.info.top, this.info.radius);
    }

    hotPointsGroup.add(this.sprite);
  }

  this.showRing = function() {
    fill('white');
    ellipse(this.info.left, this.info.top, this.info.radius);
    this.sprite.shadowOffsetX = 3;
    this.sprite.shadowOffsetY = 3;
    this.sprite.shadowBlur = 2;
    this.sprite.shadowColor = "white";
  }
}

/* function Player(name, color, x, y) {
  this.radius = 18;
  this.name = name;
  this.socketId = '';
  this.tails = 5;
  this.x = x,
  this.y = y,
  this.isInside = false;
  this.hit = null;
  this.color = color;
  let tail = [];
  let tailLength = 70;
  this.positions = null;

  this.omino = createSprite(this.x, this.y, 10, 10);
  this.omino.setCollider("circle", 0, 0, 10);
  this.omino.debug = false;
  this.omino.visible = false;
  this.omino.color = this.color;

  console.log(this.omino.color);

  this.update = function(positions) {
    this.positions = positions;

    if (positions.x != 0 || positions.y != 0) {
      if (this.isMoving != true) {
        console.log("started moving");
        this.isMoving = true;

        // pause timer
        if(this.isOnMap) this.stopTimer();
      }
    } else {
      if (this.isMoving != false) {
        console.log("stopped moving");
        this.isMoving = false;

        // restart timer
        if(this.isOnMap) this.startTimer();
      }
    }
    
    if(!isInside(this)) {
      this.x = this.x + (positions.x * configuration.velocity);
      this.y = this.y + (positions.y * configuration.velocity);
    } else {
      this.x = this.x + (positions.x * configuration.velocity);
      this.y = this.y + (positions.y * configuration.velocity);
    }
  }

  this.draw = function() {
    drawPlayer(this.omino, this.x, this.y, this.positions.x, this.positions.y, this.treshFlip);

    for(let i = 0; i < tail.length - 1; i+=2){
      let diam = map(i, 0, tail.length,0,this.radius);
      let col =  map(i, 0, tail.length, 0, 100);
      fill(255, 10, 10, col);
      ellipse(tail[i], tail[i+1], diam, diam);
    }

    tail.push(this.omino.position.x, this.omino.position.y)
    if(tail.length > tailLength * 2){
      tail.splice(0, 2)
    }

    noStroke();

    fill(255, 10, 10, 200);
    ellipse(this.omino.position.x, this.omino.position.y, this.radius, this.radius);
    noFill();
  }

  console.log("idletime", this.idleTime );
  this.timer = new easytimer.Timer({target: { seconds: this.idleTime }});
  this.timer.addEventListener('targetAchieved', e => {
    console.log("timer ended");
    this.resetPositions();
  });

  this.resetTimer = function() {
    idleTime = 0;
  }

  this.startTimer = function() {
    console.log('timer resetttato');
    this.timer.reset();
    this.timer.start();
  }

  this.stopTimer = function() {
    console.log('timer stoppato');
    this.timer.stop();
  }

  this.resetPositions = function() {
    console.log("reset position", x, y);
    socket.emit('reset', { socketId: this.socketId });
    this.x = x;
    this.y = y;
  }
} */

function Omino(name, color, x, y, idleTime) {
  this.radius = 18;
  this.name = name;
  this.socketId = '';
  this.x = x;
  this.y = 1700;
  this.isInside = false;
  this.color = color;
  this.isMoving = false;
  this.timerResetted = false;
  this.positions = null;
  this.isReading = false;
  this.isOnMap = configuration.isDebug ? true : false; 
  this.idleTime = idleTime;
  this.isOutsideCanvas = true;
  this.showMe = false;

  this.idle = null;
  this.walking = null;
  this.flagging = null;

  // JOYSTICK TRESHOLDS //

  this.tresh = 0.06;
  this.treshFlip = 0.04;

  // TIMER //

  console.log("idletime", this.idleTime );
  this.timer = new easytimer.Timer({target: { seconds: this.idleTime }});
  
  this.timer.addEventListener('targetAchieved', e => {
    console.log("timer ended");
    this.resetPositions();
  });

  // SPRITE //

  this.omino = createSprite(50, 50, 10, 10);
  this.omino.setCollider("circle", 0, 0, 6);
  this.omino.debug = true;
  this.omino.visible = configuration.isDebug ? true : false;

  // ANIMATIONS //

  this.omino.scale = 1
  this.walking = new Animation(`assets/cursori_block/${this.name}/${this.name}_walk_1.png`, `assets/cursori_block/${this.name}/${this.name}_walk_2.png`, `assets/cursori_block/${this.name}/${this.name}_walk_3.png`, `assets/cursori_block/${this.name}/${this.name}_walk_2.png`);
  this.walking.frameDelay = 8;
  this.omino.addAnimation('walking', this.walking);

  this.flagging = new Animation(`assets/cursori_block/${this.name}/${this.name}_stop_1.png`, `assets/cursori_block/${this.name}/${this.name}_stop_2.png`);
  this.flagging.looping = false;
  this.omino.addAnimation('flagging', this.flagging);

  this.idle = loadImage(`assets/cursori_block/${this.name}/${this.name}_stop_1.png`);
  this.omino.addImage('idle', this.idle);

  this.omino.changeAnimation('idle');
  this.omino.animation.playing = false;
  
  this.update = function(positions) {
    if (this.showMe == true) {
      this.y -= 1;
      if (!this.omino.visible) this.omino.visible = true;
      this.omino.changeAnimation('walking');

      if (this.y <= y) {
        this.omino.changeAnimation('idle');
        this.showMe = false;
      }

      return;
    }

    this.positions = positions;

      if (positions.x != 0 || positions.y != 0) {
        // omino started
        if (this.isMoving != true && !this.isReading) {
          console.log("started moving");
          this.omino.changeAnimation('walking');
          this.omino.animation.play();
          this.isMoving = true;

          // pause timer
          if(this.isOnMap) {
            this.timerResetted = false;
            this.stopTimer();
          }

          // rotazione nel verso della camminata
          if (positions.x == 0) {
            if (positions.y < 0) {
              this.omino.rotation = 0;
            } else {
              this.omino.rotation = 180;
            }            
          } else if (positions.y == 0) {
            if (positions.x < 0) {
              this.omino.rotation = -90;
            } else {
              this.omino.rotation = 90;
            }  
          }
        }
      } else {
        // omino stopped
        if (this.isMoving != false) {
          if (this.isMoving != false) this.isMoving = false;

          this.omino.animation.stop();

          // go to idle animation
          if (this.omino.animation.getFrame() == 1) {
             this.omino.animation.nextFrame();
          } else if (this.omino.animation.getFrame() == 3) {
             this.omino.animation.nextFrame();
          }

          
          if (this.omino.getAnimationLabel() != "flagging") {
            this.omino.changeAnimation('idle');
            this.omino.animation.playing = false;
          }

          // restart timer
          if(this.isOnMap) this.startTimer();
        }
      }

    // move omino sprite on map (non se sto leggendo (non solo sono dentro l'hotpoint, ma sono sulla scheda per la lettura))
    if (!this.isReading) {
      if ((positions.x > this.tresh || positions.x < -this.tresh) ||  (positions.y > this.tresh || positions.y < -this.tresh)) {
        // if inside hotpoint go slow
        if(isInside(this)) {
          this.x = this.x + ((positions.x * configuration.velocity) / 3);
          this.y = this.y + ((positions.y * configuration.velocity) / 3);
        // if outside hotpoint go fast
        } else {
          this.x = this.x + (positions.x * configuration.velocity);
          this.y = this.y + (positions.y * configuration.velocity);
        }
      }
    }

    let hotpoint = justEntered(this)

    let exited = justExited(this)

    if(hotpoint) {
      this.omino.changeAnimation('flagging');
      socket.emit('direct', { socketId: this.socketId, url: hotpoint.url });
    }

    if(exited) {
      console.log("sono in exited");
      this.omino.changeAnimation('walking');
      socket.emit('exited', { socketId: this.socketId });

      if (this.timerResetted) {
        this.omino.changeAnimation('idle');
      }
    }
  }

  this.draw = function() {
    if (this.isOnMap == true) {
      drawOmino(this.omino, this.x, this.y, this.positions.x, this.positions.y, this.treshFlip);
    }
  }

  this.resetTimer = function() {
    this.idleTime = 0;
  }

  this.startTimer = function() {
    console.log('timer resettato');
    this.timer.reset();
    this.timer.start();
  }

  this.stopTimer = function() {
    console.log('timer stoppato');
    this.timer.stop();
  }

  this.resetPositions = () => {
    this.omino.visible = false;
    console.log("reset position", x, y);
    socket.emit('reset', { socketId: this.socketId });
    this.omino.changeAnimation('idle');
    this.timerResetted = false;
    this.isOutsideCanvas = true;
    this.omino.rotation = 0;
    this.x = x;
    this.y = 1920;
  }
}

function drawPlayer(omino, posX, posY) {
  playersGroup.add(omino);

  omino.position.x = posX;
  omino.position.y = posY;

  if(playersGroup) {
    omino.collide(playersGroup, function() {
      console.log('collided');
    });
  }

  if(playersGroup) {
    omino.collide(hotPointsGroup, function() {
      console.log('collided with hotpoint');
    });
  }
}

function drawOmino(omino, posX, posY, oldX, oldY, treshFlip) {
  playersGroup.add(omino);

  let oldPosX = omino.position.x;
  let oldPosY = omino.position.y

  omino.position.x = posX;
  omino.position.y = posY;

  var deltaX = posX - oldPosX;
  var deltaY = posY - oldPosY;
  var rad = Math.atan2(deltaY, deltaX);
  var deg = rad * (180 / Math.PI);

  

  if ((oldX >= 0 && oldX <= treshFlip) || (oldX <= 0 && oldX >= -treshFlip) && (oldY >= 0 && oldY <= treshFlip) || (oldY < 0 && oldY >= -treshFlip)) {
    //
  } else {
    omino.rotation = (deg) + 90;
  }

  if(playersGroup) {
    omino.collide(playersGroup, function() {
      console.log('collided');
    });
  }

  if(playersGroup) {
    omino.collide(hotPointsGroup, function() {
      console.log('collided with hotpoint');
    });
  }
}
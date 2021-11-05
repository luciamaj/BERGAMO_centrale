function Hotpoint(jsonObj) {
  this.info = jsonObj;
  this.radius = this.info.radius;
  this.fill = '';
  this.url = this.info.url;
  this.isInside = false;
  this.players = [];

  this.sprite = createSprite(this.info.left,  this.info.top,  this.info.radius, this.info.radius);
  this.sprite.scale = 0.5
  
  if (this.info.type == 'circle') {
    this.sprite.draw = _ => { 
      ellipse(0, 0, this.info.radius, this.info.radius) 
    }

    this.sprite.setCollider("circle");
  } else {
    this.idle = loadImage(`assets/punti/luce_grande.png`);
    this.sprite.addImage('idle', this.idle);
  
    this.sprite.changeAnimation('idle');
    this.sprite.animation.playing = false;

    this.sprite.setCollider("circle", 0, 0, 20);
  }
    
  this.sprite.debug = false;
  this.sprite.depth = 1;
  this.sprite.visible = false;
    
  this.draw = function() {
    noFill();
    this.sprite.visible = false;

    let myStations = newStations.filter(station => { return station.hotpoint == this });
    myStations = myStations.sort((s1, s2)  => { return s1.timestamp > s2.timestamp ? 1 : -1;});
    let players = myStations.map(station => { return station.player });

    for (let i = 0; i < players.length; i++) {
      if(this.info.type == 'circle') {
        this.showRing();
      } else {
        this.sprite.visible = true;
      }
    }

    if (configuration.points) {
      stroke('blue');
      strokeWeight(2);
      ellipse(this.info.left, this.info.top, this.info.radius);
      textSize(32);
      text(this.info.numero, this.info.left, this.info.top);
      fill(0, 102, 153);
      noStroke();
      noFill();
    }

    if (this.info.type == 'circle') {
      ellipse(this.info.left, this.info.top, this.info.radius);
    }

    hotPointsGroup.add(this.sprite);
  }

  this.showRing = function() {
    ellipse(this.info.left, this.info.top, this.info.radius);
    this.sprite.shadowOffsetX = 3;
    this.sprite.shadowOffsetY = 3;
    this.sprite.shadowBlur = 2;
  }
}

function Omino(name, color, x, y, idleTime) {
  this.radius = 18;
  this.name = name;
  this.socketId = '';
  this.x = x;
  this.y = y;
  this.isInside = false;
  this.color = color;
  this.isMoving = false;
  this.timerResetted = false;
  this.positions = null;
  this.isReading = false;
  this.isOnMap = configuration.isDebug ? true : false;
  this.idleTime = idleTime;
  this.showMe = false;

  this.idle = null;
  this.walking = null;
  this.flagging = null;

  // JOYSTICK TRESHOLDS //

  this.tresh = 0;
  this.treshFlip = 0.02;

  // TIMER //

  console.log("idletime", this.idleTime );
  this.timer = new easytimer.Timer({target: { seconds: this.idleTime }});
  
  this.timer.addEventListener('targetAchieved', e => {
    console.log("timer ended");
    this.reloaded();
    this.resetPositions();
  });

  // SPRITE //

  this.omino = createSprite(50, 50, 10, 10);
  this.omino.setCollider("circle", 0, 0, 6);
  this.omino.debug = false;
  this.omino.visible = false;

  this.omino.depth = 2;

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
      //TODO: mettere a posto camminata

      // this.y -= 1;
      if (!this.omino.visible) this.omino.visible = true;
      this.showMe = false;
      // this.omino.changeAnimation('walking');

      // if (this.y <= y) {
      //   this.omino.changeAnimation('idle');
      // }

      return;
    }

    this.positions = positions;

      if (positions.x != 0 || positions.y != 0) {
        // omino started
        if (this.isMoving != true && !this.isReading && this.isOnMap) {
          console.log(this.name, "started moving", this.isMoving, this.isReading, this.isOnMap);
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
    if (!this.isReading && this.isOnMap) {
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

    if(exited && this.isOnMap) {
      console.log("sono in exited");
      this.omino.changeAnimation('walking');
      socket.emit('exited', { socketId: this.socketId });

      if (this.timerResetted) {
        this.omino.changeAnimation('idle');
      }
    }
  }

  this.draw = function() {
    drawOmino(this.omino, this.x, this.y, this.positions.x, this.positions.y, this.treshFlip);
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

  this.reloaded = () => {
    console.log("sto inviando il reset", { socketId: this.socketId });
    socket.emit('reset', { socketId: this.socketId });
  }

  this.resetPositions = () => {
    this.omino.visible = false;
    this.omino.changeAnimation('idle');
    this.timerResetted = false;
    this.isOnMap = false;
    this.isMoving = false;
    this.isReading = false;
    this.omino.rotation = 0;
    this.x = x;
    this.y = y;
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
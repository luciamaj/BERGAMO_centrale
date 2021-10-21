//var joysticks = {"azure": {x: 0, y: 0, color: [231, 24, 55], baseX: 238, baseY: 2100}, "blue": {x: 0, y: 0, color:[73, 182, 117], baseX: 400, baseY: 2100}, "green": {x: 0, y: 0, color: [14, 75, 239], baseX: 600, baseY: 2100}, "orange": {x: 0, y: 0, color: [231, 24, 55], baseX: 800, baseY: 2100}, "pink": {x: 0, y: 0, color: [231, 24, 55], baseX: 900, baseY: 2100}, "purple": {x: 0, y: 0, color: [231, 24, 55], baseX: 1100, baseY: 2100}, "yellow": {x: 0, y: 0, color: [231, 24, 55], baseX: 1200, baseY: 2100}}

var joysticks = {"azure": {x: 0, y: 0, color: [231, 24, 55], baseX: 238, baseY: 1880}, "blue": {x: 0, y: 0, color:[73, 182, 117], baseX: 400, baseY: 1880}, "green": {x: 0, y: 0, color: [76, 235, 52], baseX: 600, baseY: 1880}, "orange": {x: 0, y: 0, color: [231, 24, 55], baseX: 800, baseY: 1880}, "red": {x: 0, y: 0, color: [231, 24, 55], baseX: 900, baseY: 1880}, "purple": {x: 0, y: 0, color: [231, 24, 55], baseX: 1100, baseY: 1880}, "yellow": {x: 0, y: 0, color: [231, 24, 55], baseX: 1300, baseY: 1880}}

var hasGP = false;
var repGP;
let treshJoystick = 0.3;
let sendedError = false;

function canGame() {
    return "getGamepads" in navigator;
}

// CHECK FOR GAMEPADS
window.onload = function() {
    if(canGame()) {
      $(window).on("gamepadconnected", function() {
          hasGP = true;
          console.log("connection event");
          repGP = window.setInterval(reportOnGamepad);
      });
  
      $(window).on("gamepaddisconnected", function() {
          console.log("disconnection event");
          window.clearInterval(repGP);
      });
  
      var checkGP = window.setInterval(function() {
          if(navigator.getGamepads()[0]) {
            if(!hasGP) $(window).trigger("gamepadconnected");
            window.clearInterval(checkGP);
          }
      }, 500);
    }

    // All'onload avviso il server
    socket.emit('canvas');
}

var applyDeadzone = function(number, threshold){
    let percentage = (Math.abs(number) - threshold) / (1 - threshold);
 
    if(percentage < 0) {
        percentage = 0;
    }
       
    return percentage * (number > 0 ? 1 : -1);
 }

//UPDATE VALUES OF JOYSTICKS
function reportOnGamepad() {
    let gamepad1;
    let gamepad2;
    // First arduino

    //if(navigator.getGamepads()[0].buttons[0].pressed == true) {
      //  console.log(navigator.getGamepads()[0].buttons[0]);
    //}

    // if(navigator.getGamepads()[0] != null && navigator.getGamepads()[1] != null) {
    if(navigator.getGamepads()[0] != null) {
      // if(navigator.getGamepads()[0].buttons.find(btn => btn.pressed === true)) {
      //   gamepad1 = navigator.getGamepads()[1];
      //   gamepad2 = navigator.getGamepads()[0];
      // } else {
      //   gamepad2 = navigator.getGamepads()[1];
      //   gamepad1 = navigator.getGamepads()[0];
      // }

      gamepad1 = navigator.getGamepads()[0];
      gamepad2 = navigator.getGamepads()[1];

      if(gamepad1) {
        joysticks['azure'].x = applyDeadzone(gamepad1.axes[0], treshJoystick);   
        joysticks['azure'].y = - applyDeadzone(gamepad1.axes[1], treshJoystick);

        joysticks['blue'].x = applyDeadzone(gamepad1.axes[2], treshJoystick);   
        joysticks['blue'].y = - applyDeadzone(gamepad1.axes[3], treshJoystick);

        joysticks['green'].x = applyDeadzone(gamepad1.axes[4], treshJoystick);   
        joysticks['green'].y = - applyDeadzone(gamepad1.axes[5], treshJoystick);
    
        joysticks['orange'].x = applyDeadzone(gamepad1.axes[6], treshJoystick);  
        joysticks['orange'].y = - applyDeadzone(gamepad1.axes[7], treshJoystick);  
      }
    }
  
    // Second arduino
    if(gamepad2) {
      joysticks['red'].x = applyDeadzone(gamepad2.axes[0], treshJoystick);
      joysticks['red'].y = - applyDeadzone(gamepad2.axes[1], treshJoystick);
  
      joysticks['yellow'].x = applyDeadzone(gamepad2.axes[2], treshJoystick);
      joysticks['yellow'].y = - applyDeadzone(gamepad2.axes[3], treshJoystick);
  
      joysticks['purple'].x = applyDeadzone(gamepad2.axes[4], treshJoystick);
      joysticks['purple'].y = - applyDeadzone(gamepad2.axes[5], treshJoystick);
    }

    if(gamepad1 == null || gamepad2 == null) {
      sendedError = true;
      let report1 = gamepad1 ? true : false;
      let report2 = gamepad2 ? true : false;
      socket.emit('joystick', {'j1': report1, 'j2': report2});
    } else {
      if (sendedError) {
        socket.emit('joystick', {'j1': true, 'j2': true});
        sendedError = false;
      }
    }
}
var joysticks = {"purple": {x: 0, y: 0, color: [231, 24, 55], baseX: 160, baseY: 1651}, "red": {x: 0, y: 0, color:[73, 182, 117], baseX: 354, baseY: 1783}, "orange": {x: 0, y: 0, color: [76, 235, 52], baseX: 504, baseY: 1840}, "yellow": {x: 0, y: 0, color: [231, 24, 55], baseX: 1154, baseY: 1789}, "green": {x: 0, y: 0, color: [231, 24, 55], baseX: 1423, baseY: 1650}, "blue": {x: 0, y: 0, color: [231, 24, 55], baseX: 1484, baseY: 1574}, "azure": {x: 0, y: 0, color: [231, 24, 55], baseX: 1574, baseY: 1494}}


if (configuration.isDebug) {
  var hasGP = false;
  var repGP;
  let treshJoystick = 0.6;
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
          joysticks['green'].x = applyDeadzone(gamepad1.axes[0], treshJoystick);   
          joysticks['green'].y = - applyDeadzone(gamepad1.axes[1], treshJoystick);

          joysticks['azure'].x = applyDeadzone(gamepad1.axes[2], treshJoystick);   
          joysticks['azure'].y = - applyDeadzone(gamepad1.axes[3], treshJoystick);

          joysticks['blue'].x = applyDeadzone(gamepad1.axes[4], treshJoystick);  
          joysticks['blue'].y = - applyDeadzone(gamepad1.axes[5], treshJoystick);
      
          joysticks['yellow'].x = applyDeadzone(gamepad1.axes[6], treshJoystick);  
          joysticks['yellow'].y = - applyDeadzone(gamepad1.axes[7], treshJoystick);  
        }
      }
    
      // Second arduino
      if(gamepad2) {
        joysticks['purple'].x = applyDeadzone(gamepad2.axes[0], treshJoystick);
        joysticks['purple'].y = - applyDeadzone(gamepad2.axes[1], treshJoystick);
    
        joysticks['red'].x = applyDeadzone(gamepad2.axes[2], treshJoystick);
        joysticks['red'].y = - applyDeadzone(gamepad2.axes[3], treshJoystick);
    
        joysticks['orange'].x = applyDeadzone(gamepad2.axes[4], treshJoystick);
        joysticks['orange'].y = - applyDeadzone(gamepad2.axes[5], treshJoystick);
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
} else {
  var hasGP = false;
  var repGP;
  let treshJoystick = 0.5;
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

      if(navigator.getGamepads()[0] != null && navigator.getGamepads()[1] != null) {
      //if(navigator.getGamepads()[0] != null) {
        if(navigator.getGamepads()[0].buttons.find(btn => btn.pressed === true)) {
          gamepad1 = navigator.getGamepads()[1];
          gamepad2 = navigator.getGamepads()[0];
        } else {
          gamepad2 = navigator.getGamepads()[1];
          gamepad1 = navigator.getGamepads()[0];
        }

        if(gamepad1) {
          joysticks['green'].x = applyDeadzone(gamepad1.axes[0], treshJoystick);   
          joysticks['green'].y = - applyDeadzone(gamepad1.axes[1], treshJoystick);

          joysticks['blue'].x = applyDeadzone(gamepad1.axes[2], treshJoystick);   
          joysticks['blue'].y = - applyDeadzone(gamepad1.axes[3], treshJoystick);

          joysticks['azure'].x = applyDeadzone(gamepad1.axes[4], treshJoystick);   
          joysticks['azure'].y = - applyDeadzone(gamepad1.axes[5], treshJoystick);
      
          joysticks['yellow'].x = applyDeadzone(gamepad1.axes[6], treshJoystick);  
          joysticks['yellow'].y = - applyDeadzone(gamepad1.axes[7], treshJoystick);  
        }
      }
    
      // Second arduino
      if(gamepad2) {
        joysticks['purple'].x = applyDeadzone(gamepad2.axes[0], treshJoystick);
        joysticks['purple'].y = - applyDeadzone(gamepad2.axes[1], treshJoystick);
    
        joysticks['red'].x = applyDeadzone(gamepad2.axes[2], treshJoystick);
        joysticks['red'].y = - applyDeadzone(gamepad2.axes[3], treshJoystick);
    
        joysticks['orange'].x = applyDeadzone(gamepad2.axes[4], treshJoystick);
        joysticks['orange'].y = - applyDeadzone(gamepad2.axes[5], treshJoystick);
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
}
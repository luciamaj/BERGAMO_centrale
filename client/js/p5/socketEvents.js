let socket = io.connect(configuration.serverUrl);
let data;
var playersOnCanvas = [];

socket.on('dati-canvas', d => {
    data = d;
    console.log("THE DATA", data);
    socket.emit('data', data);
    console.log();
    update();
});

socket.on('canvas-onload', dataRecieved => {
    console.log('canvas retransimmed', dataRecieved);
    if (dataRecieved) {
        console.log('quello che ho ricevuto', dataRecieved);
        data = dataRecieved;
        update();
    }
});

socket.on('logo-server', function(data) {
    console.log('logo server', data);

    console.log("logo", data);
    updateStatus(data, false, true);
});

socket.on('approfondimento-server', function(data) {
    console.log("approfondimento-server", data);

    updateStatus(data, true, true);
});

socket.on('mouseClick-server', function(data) {
    updateTimer(data);
});

socket.on('showME-server', function(data) {
    console.log('showME-server', data);
    updateStatus(data, false, true);
    playStartAnimation(data);
});

function emitUrl(info) {
  socket.emit('direct', info);
}
  
function update() {
    console.log('PLAYERS ON CANVAS', playersOnCanvas)

    let { periferiche } = data;
    let { colors } = data;

    console.log("THE COLORS", colors);
    console.log("periferiche", periferiche);

    periferiche.map((p, i) => {
        if (p != '') {
            console.log('peri', p);
            var playerToAdd = playersArray.find(player => player.name == colors[i]);
    
            if (playerToAdd) {
                console.log("playerToAdd", playerToAdd);
    
                playerToAdd.socketId = p;
                if(!(playersOnCanvas.includes(playerToAdd))) {
                    playersOnCanvas.push(playerToAdd);
    
                    playerToAdd.reloaded();
                }
            }
        }
    });
}

function playStartAnimation(data) {
    let playerToChangeIndex = playersArray.findIndex(player => player.name == data.data.color);
	
	if (playerToChangeIndex != -1) {
        let playerToChange = playersArray[playerToChangeIndex];
		playerToChange.showMe = true;
        playersArray[playerToChangeIndex] = playerToChange;
	}
}

function updateStatus(data, isReading, isOnMap) {
    let playerToChangeIndex = playersArray.findIndex(player => player.name == data.data.color);
    console.log("THE PLAYER TO CHANGE", playersArray, data, playerToChangeIndex);
	
	if (playerToChangeIndex != -1) {
        let playerToChange = playersArray[playerToChangeIndex];
		console.log("THE PLAYER TO CHANGE", "playerToChange", playerToChange, "data", data, "isReading", isReading, "isOnMap", isOnMap);

		playerToChange.isReading = isReading;
		playerToChange.isOnMap = isOnMap;

		playersArray[playerToChangeIndex] = playerToChange;
	}
}

function updateTimer(data) { 
    let playerToChangeIndex = playersArray.findIndex(player => player.name == data.data.color);
	
	if (playerToChangeIndex != -1) {
        let playerToChange = playersArray[playerToChangeIndex];
		playerToChange.startTimer();
	}
}

if (performance.getEntriesByType("navigation")[0].type.toString() === "reload") {
    console.log(socket);
    // NOTE: send reset position to periferiche when page is refreshed. 
    //socket.emit('refresh');
}
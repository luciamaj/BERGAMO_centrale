var _perifericheDebug = [];
var _canvasDebug = false;
var _joyestickDebug = null;

function setPerifericheDebug(array) {
    _perifericheDebug = array;
}

function setCanvasDebug(data) {
    _canvasDebug = data;
}

function setJoystickDebug(data) {
    _joyestickDebug = data;
}

function getPerifericheDebug() {
    return _perifericheDebug;
}

function getCanvasDebug() {
    return _canvasDebug;
}

function getJoystickDebug() {
    return _joyestickDebug;
}

exports.setPerifericheDebug = setPerifericheDebug;
exports.setCanvasDebug = setCanvasDebug;
exports.setJoystickDebug = setJoystickDebug;

exports.getPerifericheDebug = getPerifericheDebug;
exports.getCanvasDebug = getCanvasDebug;
exports.getJoystickDebug = getJoystickDebug;
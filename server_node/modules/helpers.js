var _perifericheDebug = [];
var _canvasDebug = false;
var _canvasDataDebug = null;

function setPerifericheDebug(array) {
    _perifericheDebug = array;
}

function setCanvasDebug(data) {
    _canvasDebug = data;
}

function setCanvasDataDebug(data) {
    _canvasDataDebug = data;
}

function getPerifericheDebug() {
    return _perifericheDebug;
}

function getCanvasDebug() {
    return _canvasDebug;
}

function getCanvasDataDebug() {
    return _canvasDataDebug;
}

exports.setPerifericheDebug = setPerifericheDebug;
exports.setCanvasDebug = setCanvasDebug;
exports.setCanvasDataDebug = setCanvasDataDebug;

exports.getPerifericheDebug = getPerifericheDebug;
exports.getCanvasDebug = getCanvasDebug;
exports.getCanvasDataDebug = getCanvasDataDebug;
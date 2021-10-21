if(configuration.isDebug) {
    function printMousePos(event) {
        console.warn("clientX: " + event.clientX +
        " - clientY: " + event.clientY);
    }
    
    document.addEventListener("click", printMousePos);
}
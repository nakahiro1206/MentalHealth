// height, width
const SCREEN_WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const SCREEN_HEIGHT = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

// wrapper
const wrapper = document.getElementById("wrapper");
const WRAPPER_WIDTH = wrapper.clientWidth;
const WRAPPER_HEIGHT = wrapper.clientHeight;
const WRAPPER_LEFT = wrapper.getBoundingClientRect().left;
const WRAPPER_TOP = wrapper.getBoundingClientRect().top;

// canvas which draws ball
const canvas = document.getElementById("canvas");
const g = canvas.getContext("2d"); // ctx means context
canvas.width = WRAPPER_WIDTH; canvas.height = WRAPPER_HEIGHT;
canvas.style.zIndex = 0;
// canvas drag
const canvasDrag = document.getElementById("canvas_drag");
const gDrag = canvas.getContext("2d"); // ctx means context
canvasDrag.width = WRAPPER_WIDTH; canvasDrag.height = WRAPPER_HEIGHT;
canvasDrag.style.zIndex = 1;
// button
const button = document.getElementById("start_btn");
const exit_button = document.getElementById("exit_btn");

canvasDrag.addEventListener("mousedown",(event)=>{
    const X = Math.floor(event.clientX-WRAPPER_LEFT); const Y = Math.floor(event.clientY-WRAPPER_TOP);
    console.log(X, Y);
});

var fabricCanvas = new fabric.Canvas(canvas);
const checkbox = document.querySelector('#checkbox')
let initialPos, bounds, rect, dragging = false, freeDrawing = checkbox.checked
const options = {
    drawRect: drawRect.checked,
    onlyOne: onlyOne.checked,
    rectProps: {
        stroke: 'red', 
        strokeWidth: 1, 
        fill: ''
    }
}
function onMouseDown(e) {
    dragging = true;
    if (!freeDrawing) {
    return
    }
    initialPos = { ...e.pointer }
        bounds = {}
    if(options.drawRect){
    rect = new fabric.Rect({
        left: initialPos.x,
        top: initialPos.y,
        width: 0, height: 0,
        ...options.rectProps
    });
        fabricCanvas.add(rect)        
    }
}
function update(pointer) {
    if (initialPos.x > pointer.x) {
    bounds.x = Math.max(0, pointer.x)
    bounds.width = initialPos.x - bounds.x
    } else {
    bounds.x = initialPos.x
    bounds.width = pointer.x - initialPos.x
    }
    if (initialPos.y > pointer.y) {
    bounds.y = Math.max(0, pointer.y)
    bounds.height = initialPos.y - bounds.y
    } else {
    bounds.height = pointer.y - initialPos.y
    bounds.y = initialPos.y
    }
    if(options.drawRect){
    rect.left = bounds.x
    rect.top = bounds.y
    rect.width = bounds.width
    rect.height = bounds.height
    rect.dirty = true
    fabricCanvas.requestRenderAllBound()
    }
}
function onMouseMove(e) {
    if (!dragging || !freeDrawing) {
    return
    }
    requestAnimationFrame(() => update(e.pointer))
}
function onMouseUp(e) {
    dragging = false;
    if (!freeDrawing) {return}
    if (options.drawRect && rect && (rect.width == 0 || rect.height === 0)) {
    fabricCanvas.remove(rect)
    }
    if(!options.drawRect||!rect){
    rect = new fabric.Rect({
        ...bounds, left: bounds.x, top: bounds.y,
        ...options.rectProps
    });
        fabricCanvas.add(rect)  
    rect.dirty = true
    fabricCanvas.requestRenderAllBound()
    }
    rect.setCoords() // important! 
    options.onlyOne && uninstall()
}
function install() {
    freeDrawing = true; dragging = false; rect = null
    checkbox.checked = true
    fabricCanvas.on('mouse:down', onMouseDown);
    fabricCanvas.on('mouse:move', onMouseMove);
    fabricCanvas.on('mouse:up', onMouseUp);
}
function uninstall() {
    freeDrawing = false; dragging = false; rect = null
    checkbox.checked = false
    fabricCanvas.off('mouse:down', onMouseDown);
    fabricCanvas.off('mouse:move', onMouseMove);
    fabricCanvas.off('mouse:up', onMouseUp);
}

// the following is OOT - it's just for the controls above
checkbox.addEventListener('change', e =>
    e.currentTarget.checked ? install() : uninstall()
)
document.querySelector('#drawRect').addEventListener('change', e =>{
    options.drawRect = e.currentTarget.checked
})
    document.querySelector('#onlyOne').addEventListener('change', e =>{
    options.onlyOne = e.currentTarget.checked
})
freeDrawing && install()
document.querySelector('#changeCanvasPosition').addEventListener('click', () => {
    const el = document.querySelector(`.wrapper`)
    el.style.marginTop = Math.trunc(Math.random() * 300) + 'px'
    el.style.marginLeft = Math.trunc(Math.random() * 200) + 'px'
})

// height, width
const SCREEN_WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const SCREEN_HEIGHT = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const WRAPPER_WIDTH = document.getElementById("wrapper").clientWidth;
const WRAPPER_HEIGHT = document.getElementById("wrapper").clientHeight;

// wrapper
const wrapper = document.getElementById("wrapper");
// button
const exit_button = document.getElementById("exit_btn");


/*起動処理*/
window.addEventListener("DOMContentLoaded", function(){
	// canvas.width = WRAPPER_WIDTH; canvas.height = WRAPPER_HEIGHT;
    const watchFace = document.getElementsByClassName("watch-face")[0];
    const circles = document.getElementsByClassName("circle");
    wrapper.addEventListener("mousedown", ()=>{
        console.log("Mousedown");
        watchFace.style= "animation: pulse 4s cubic-bezier(0.5, 0, 0.5, 1) alternate infinite;";
        for(let i=0;i<6;i++){
            const c = circles[i];
            c.style=`animation: circle-${i+1} 4s ease alternate infinite;`
        }
    });
    wrapper.addEventListener("mouseup", ()=>{
        console.log("mouseup");
        watchFace.style= "";
        for(let i=0;i<6;i++){
            const c = circles[i];
            c.style="";
        }
    });
});
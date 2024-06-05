// height, width
const SCREEN_WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const SCREEN_HEIGHT = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const WRAPPER_WIDTH = document.getElementById("wrapper").clientWidth;
const WRAPPER_HEIGHT = document.getElementById("wrapper").clientHeight;

// wrapper
const wrapper = document.getElementById("wrapper");
// button
const exit_button = document.getElementById("exit_btn");

function vibe(bool){
    if(bool){
        vibePattern = [100, 900, 100, 900, 100, 900, 100, 900, 100, 900, 100, 900, 100, 900, 100, 900, 100, 900, 100,900];
        navigator.vibrate(vibePattern);
    }
    else{window.navigator.vibrate(0);}
}

/*起動処理*/
window.addEventListener("DOMContentLoaded", function(){
	// canvas.width = WRAPPER_WIDTH; canvas.height = WRAPPER_HEIGHT;
    const watchFace = document.getElementsByClassName("watch-face")[0];
    const circles = document.getElementsByClassName("circle");
    wrapper.addEventListener("touchstart", ()=>{
        console.log("Mousedown");
        watchFace.style= "animation: pulse 20s cubic-bezier(0.5, 0, 0.5, 1) normal infinite;";
        for(let i=0;i<6;i++){
            const c = circles[i];
            c.style=`animation: circle-${i+1} 20s ease normal infinite;`
        }
        vibe(true);
    });
    wrapper.addEventListener("touchend", ()=>{
        console.log("mouseup");
        watchFace.style= "";
        for(let i=0;i<6;i++){
            const c = circles[i];
            c.style="";
        }
        vibe(false);
    });
});
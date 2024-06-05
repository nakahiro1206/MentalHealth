// wrapper
const wrapper = document.getElementById("wrapper");
const wrapper_height = wrapper.clientHeight;
const wrapper_width = wrapper.clientWidth;
const WRAPPER_LEFT = wrapper.getBoundingClientRect().left;
const WRAPPER_TOP = wrapper.getBoundingClientRect().top;
const instruction = document.querySelector("#instruction");
const instructionWrapper = document.querySelector(".instruction");

const Engine = Matter.Engine;
const Render = Matter.Render;
const Mouse = Matter.Mouse;
const engine = Engine.create();
const Bodies = Matter.Bodies;
const World = Matter.World;
const world = engine.world;
const Runner = Matter.Runner;

const CircleArray = new Array();
const radius = 15;
const circle_num = 30;
// Bodies.rectangle(x-center, y-center, width, height)
class Circle {
    constructor(radius, centerX, centerY, id){
        this.w = radius * 2; this.h = radius*2;
        this.scale =1; this.opacity = 1;
        this.centerX = centerX; this.centerY = centerY;
        // at first, top: -40, left:80
        // this.body=Matter.Bodies.rectangle(this.centerX, this.centerY, this.w, this.h, {restitution: 0.5,friction: 0});
        this.body=Matter.Bodies.circle(this.centerX, this.centerY, radius, {restitution: 0.5,friction: 0,});
        this.elem=document.querySelector(`#${id}`);
        this.elem.style.height = `${this.h}px`;
        this.elem.style.width = `${this.w}px`;
        this.elem.style.left = `${centerX - this.w/2}px`; this.elem.style.top = `${centerY - this.h/2}px`;
    }
    render() {
        const {x, y} = this.body.position;
        if(x>wrapper_width){Matter.Body.setPosition(this.body,{x: wrapper_width,y: y});}
        else if(x<0){Matter.Body.setPosition(this.body,{x: wrapper_width,y: y});}
        if(y>wrapper_height){Matter.Body.setPosition(this.body,{x: x,y: wrapper_height});}
        else if(y<0){Matter.Body.setPosition(this.body,{x: x,y: 0});}
        this.elem.style.top = `${y - this.h / 2}px`;
        this.elem.style.left = `${x - this.w / 2}px`;
        this.elem.style.transform = `rotate(${this.body.angle}rad) scale(${this.scale}, ${this.scale})`;
        this.elem.style.opacity = this.opacity;
    };
};

let startTime = -1;
let state = 0; // 0: moving, 1: stop
const Ratio = new Array(circle_num);
const inflate_time = 4000;
const vibrate_time = 7000;
const deflate_time = 8000;
const inflate_ratio = Math.sqrt(3 * wrapper_height * wrapper_width / radius /radius / 4 /circle_num);
for(let i=0;i<circle_num;i++){
    Ratio[i] = Math.random()*inflate_ratio;
}

function myRender() {
    Matter.Engine.update(engine);
    if(state==0){
        // return to initial state
        instruction.innerHTML = "画面を長押し";
        CircleArray.forEach((e)=>{
            e.elem.style.background = null;
            const scale = 1/ e.scale;
            Matter.Body.scale(e.body, scale,scale);
            e.scale = 1;
            e.render();
        });
    }
    else{
        const progressTime = new Date().getTime() - startTime;
        if(progressTime < inflate_time){
            CircleArray.forEach((e, i)=>{
                // Matter.Body.scale(e.body, inflate[i], inflate[i]);
                // e.scale *= inflate[i];
                const ratio = 1+ (Ratio[i]-1)/inflate_time * progressTime;
                const ratioBefore = e.scale;
                Matter.Body.scale(e.body, ratio/ratioBefore, ratio/ratioBefore);
                e.scale = ratio;
                e.render();
            });
        }
        else if(progressTime < inflate_time + vibrate_time){
            const procedure = (progressTime - inflate_time)%2000;
            if(instruction.innerHTML != "息を止めて"){instruction.innerHTML = "息を止めて";}
            const scaleInstruction = 1 - 0.2 * Math.min(procedure, 2000-procedure) / 2000;
            instruction.style.transform = `scale(${scaleInstruction}, ${scaleInstruction})`;
            CircleArray.forEach((e, i)=>{
                const arg = 360 * (progressTime - inflate_time) / vibrate_time;
                e.elem.style.background = `radial-gradient(circle at center, #a9ceec 50%, rgba(0, 0, 0, 0) 100%), conic-gradient(#4169E1 ${arg}deg, #a9ceec ${arg}deg 360deg)`;
                e.render();
            });
        }
        else if(progressTime < inflate_time + vibrate_time + deflate_time){
            if(instruction.innerHTML != "息を吐いて"){instruction.innerHTML = "息を吐いて";}
            CircleArray.forEach((e, i)=>{
                // Matter.Body.scale(e.body, deflate[i], deflate[i]);
                // e.scale *= deflate[i];
                const ratio = Ratio[i] - (Ratio[i]-1)/deflate_time * (progressTime - inflate_time -vibrate_time);
                const ratioBefore = e.scale;
                Matter.Body.scale(e.body, ratio/ratioBefore, ratio/ratioBefore);
                e.scale = ratio;
                e.render();
            });
        }
        else{
            // return to initial state
            instruction.innerHTML = "画面を長押し";
            CircleArray.forEach((e, i)=>{
                e.elem.style.background = null;
                const scale = 1/ e.scale;
                Matter.Body.scale(e.body, scale,scale);
                e.scale = 1;
                e.render();
            });
            for(let i=0;i<circle_num;i++){
                Ratio[i] = Math.random()*inflate_ratio;
            }
            startTime = new Date().getTime();
        }
    }
    requestAnimationFrame(myRender);
}

// boundaries.
const bottom = Bodies.rectangle(wrapper_width/2, wrapper_height+50, wrapper_width+200, 100, {isStatic: true,});
const Top = Bodies.rectangle(wrapper_width/2, -50, wrapper_width+200, 100, {isStatic: true,});
const left = Bodies.rectangle(-50, wrapper_height/2 + 50, 100, (wrapper_height+100)*2, {isStatic: true,});
const right = Bodies.rectangle(wrapper_width+50, wrapper_height/2 + 50, 100, (wrapper_height+100)*2, {isStatic: true,});
World.add(world, [bottom, Top, left, right]);
// World.add(world, [bottom,left, right]);
engine.gravity.y=0;

for(let i=0;i<circle_num;i++){
    const node = document.createElement("div");
    const id = `l${i}`;
    node.setAttribute("id",id);
    node.setAttribute("class","letter");
    // node.style.backgroundColor = "#a9ceec";
    // node.style.backgroundColor = `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`;
    wrapper.appendChild(node);
    const x = radius + Math.random()*(wrapper_width-radius*2);
    const y = radius + Math.random()*(wrapper_height-radius*2);
    const circle = new Circle(radius, x, y, id);
    CircleArray.push(circle);
    World.add(world, circle.body);
}
wrapper.addEventListener("touchstart", (event)=>{
    state=1;
    instruction.innerHTML = "息を吸って";
    for(let i=0;i<circle_num;i++){
        Ratio[i] = Math.random()*inflate_ratio;
    }
    startTime = new Date().getTime();
});
wrapper.addEventListener("touchend", (event)=>{
    // alert(0);
    state=0;
    startTime = -1;
});

myRender();
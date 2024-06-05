const Engine = Matter.Engine;
const Render = Matter.Render;
const Mouse = Matter.Mouse;
const engine = Engine.create();
const Bodies = Matter.Bodies;
const World = Matter.World;
const world = engine.world;

const wrapper = document.getElementById("wrapper");
const wrapper_height = wrapper.clientHeight;
const wrapper_width = wrapper.clientWidth;
const canvas = document.getElementById("canvas");
canvas.width = wrapper_width;
canvas.height = wrapper_height;

const LetterBoxArray = new Array();
// Bodies.rectangle(x-center, y-center, width, height)
class LetterBox {
    constructor(radius, centerX, centerY, id){
        this.w = radius * 2; this.h = radius*2;
        this.centerX = centerX; this.centerY = centerY;
        // at first, top: -40, left:80
        // this.body=Matter.Bodies.rectangle(this.centerX, this.centerY, this.w, this.h, {restitution: 0.5,friction: 0});
        this.body=Matter.Bodies.circle(this.centerX, this.centerY, radius, {restitution: 0.5,friction: 0});
        this.elem=document.querySelector(`#${id}`);
        this.elem.style.height = `${this.h}px`;
        this.elem.style.width = `${this.w}px`;
        this.elem.style.left = `${centerX - this.w/2}px`; this.elem.style.top = `${centerY - this.h/2}px`;
        console.log(this.elem);
    }
    render() {
        const {x, y} = this.body.position;
        this.elem.style.top = `${y - this.h / 2}px`;
        this.elem.style.left = `${x - this.w / 2}px`;
        this.elem.style.transform = `rotate(${this.body.angle}rad)`;
    };
};

const vec = {x: 0, y: 0 };
window.addEventListener("deviceorientation", function(e){
	vec.x = Math.floor(e.gamma / 20);	// x方向の移動量: そのままでは大きい為、小さくする
	vec.y =  Math.floor(e.beta / 20);		// y方向の移動量: そのままでは大きい為、小さくする.
}, false);

// const mouse = Mouse.create(canvas);
// Render.mouse = mouse;
// const mouseConstraint = Matter.MouseConstraint.create(engine, {
//     // mouse: Render.mouse,
//     element: document.body,
// });
// World.add(world, mouseConstraint);

// boundaries.
const bottom = Bodies.rectangle(wrapper_width/2, wrapper_height+50, wrapper_width, 100, {isStatic: true,});
const Top = Bodies.rectangle(wrapper_width/2, -50, wrapper_width, 100, {isStatic: true,});
const left = Bodies.rectangle(-50, wrapper_height/2, 100, wrapper_height, {isStatic: true,});
const right = Bodies.rectangle(wrapper_width+50, wrapper_height/2, 100, wrapper_height, {isStatic: true,});
World.add(world, [bottom, Top, left, right]);

// Matter.Runner.run(engine)
// Render.run(render);
function myRender() {
    LetterBoxArray.forEach((e)=>{e.render();});
    engine.gravity.x=vec.x+1;
    engine.gravity.y=vec.y+1;
    Matter.Engine.update(engine);
    requestAnimationFrame(myRender);
}


window.addEventListener("DOMContentLoaded",()=>{
    engine.gravity.y=0;
    const Text = "今日はデバッグするところがめちゃくちゃ多くて疲れました。";
    let centerY=50;
    let centerX=50;
    for(let i=0;i<Text.length;i++){
        const letter = Text[i];
        const node = document.createElement("div");
        const id = `l${i}`;
        node.setAttribute("id",id);
        node.setAttribute("class","letter");
        node.innerHTML = `<h3>${letter}</h3>`;
        wrapper.appendChild(node);
        const radius = 20;
        // radius centerX centerY
        const box = new LetterBox(radius,centerX,centerY,id);
        centerX+=50;
        if(centerX>=wrapper_width-radius){
            centerX = 50;
            centerY+=50;
        }
        LetterBoxArray.push(box);
        World.add(world, box.body);
    }
    myRender();
})
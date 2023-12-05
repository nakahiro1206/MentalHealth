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
        this.scale=1;
        this.centerX = centerX; this.centerY = centerY;
        // at first, top: -40, left:80
        // this.body=Matter.Bodies.rectangle(this.centerX, this.centerY, this.w, this.h, {restitution: 0.5,friction: 0});
        this.body=Matter.Bodies.circle(this.centerX, this.centerY, radius, {restitution: 0.5,friction: 0});
        //set velocity & argvelocity
        Matter.Body.setAngularVelocity(this.body, Math.random()-0.5);
        Matter.Body.setVelocity(this.body, {x: (Math.random()-0.5)*20, y:(Math.random()-0.5)*20});
        // div
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
        this.elem.style.transform = `rotate(${this.body.angle}rad) scale(${this.scale}, ${this.scale})`;
    };
};

const vec = {x: 0, y: 0 };
window.addEventListener("deviceorientation", function(e){
	vec.x = Math.floor(e.gamma / 50);	// x方向の移動量: そのままでは大きい為、小さくする
	vec.y =  Math.floor(e.beta / 50);		// y方向の移動量: そのままでは大きい為、小さくする.
}, false);

// boundaries.
const bottom = Bodies.rectangle(wrapper_width/2, wrapper_height+50, wrapper_width+200, 100, {isStatic: true,});
const Top = Bodies.rectangle(wrapper_width/2, -50, wrapper_width+200, 100, {isStatic: true,});
const left = Bodies.rectangle(-50, wrapper_height/2, 100, wrapper_height+200, {isStatic: true,});
const right = Bodies.rectangle(wrapper_width+50, wrapper_height/2, 100, wrapper_height+200, {isStatic: true,});
World.add(world, [bottom, Top, left, right]);

// Matter.Runner.run(engine)
// Render.run(render);
function myRender() {
    LetterBoxArray.forEach((e)=>{
        const radius = 15 * e.scale;
        const {x, y} = e.body.position;
        if(x<=radius || x>= wrapper_width-radius || y<=radius || y>= wrapper_height-radius){
            if(e.scale>=0.05){
                e.scale *= 0.9;
                Matter.Body.scale(e.body, 0.9, 0.9);
            }
        }
        e.render();
    });
    engine.gravity.x=vec.x;
    engine.gravity.y=vec.y;
    Matter.Engine.update(engine);
    requestAnimationFrame(myRender);
}


window.addEventListener("DOMContentLoaded",()=>{
    engine.gravity.y=0;
    const radius = 15;
    let centerY=radius;
    let centerX=radius;
    for(let i=0;i<Text.length;i++){
        const letter = Text[i];
        if(letter=='\n'){
			centerY+=radius*2;
			centerX = radius;
			continue;
		}
        const node = document.createElement("div");
        const id = `l${i}`;
        node.setAttribute("id",id);
        node.setAttribute("class","letter");
        node.innerHTML = `<h3>${letter}</h3>`;
        wrapper.appendChild(node);
        // radius centerX centerY
        const box = new LetterBox(radius,centerX,centerY,id);
        centerX+=radius*2;
        if(centerX>=wrapper_width-radius){
            centerX = radius;
            centerY+=radius*2;
        }
        LetterBoxArray.push(box);
        World.add(world, box.body);
    }
    myRender();
})
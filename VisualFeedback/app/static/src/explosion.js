// wrapper
const wrapper = document.getElementById("wrapper");
const wrapper_height = wrapper.clientHeight;
const wrapper_width = wrapper.clientWidth;
const WRAPPER_LEFT = wrapper.getBoundingClientRect().left;
const WRAPPER_TOP = wrapper.getBoundingClientRect().top;

const canvas = document.getElementById("canvas");
canvas.width = wrapper_width;
canvas.height = wrapper_height;

const Engine = Matter.Engine;
const Render = Matter.Render;
const Mouse = Matter.Mouse;
const engine = Engine.create();
const Bodies = Matter.Bodies;
const World = Matter.World;
const world = engine.world;


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
		this.elem.style.opacity = 1;
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
    Matter.Engine.update(engine);
    requestAnimationFrame(myRender);
}


window.addEventListener("DOMContentLoaded",()=>{
    // engine.gravity.y=0;
    // const Text = "今日はデバッグするところがめちゃくちゃ多くて疲れました。";
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
	wrapper.addEventListener("click", (event)=>{
		const clickX = Math.floor(event.clientX-WRAPPER_LEFT); const clickY = Math.floor(event.clientY-WRAPPER_TOP);
		LetterBoxArray.forEach((e)=>{
			const {x, y} = e.body.position;
			const dx = x - clickX; const dy = y - clickY;
			const dist = dx**2 + dy**2;
			const expRadius = 100;
			if(dist<=expRadius **2){
				const sqrtDist = Math.sqrt(dist);
				const v = Matter.Body.getVelocity(e.body);
				const vx = v.x; const vy = v.y;
				const varg = Matter.Body.getAngularVelocity(e.body);
				const diff ={x: 15*dx/sqrtDist, y: 15*dy/sqrtDist, arg:Math.random()-0.5, opacity:(expRadius**2-dist)/expRadius**2};
				Matter.Body.setAngularVelocity(e.body, varg + diff.arg);
				Matter.Body.setVelocity(e.body, {x: vx+diff.x, y:vy+diff.y});
				let opacity = e.elem.style.opacity;
				// console.log(e.elem.style.opacity);
				if(opacity<diff.opacity){
					opacity=0;
				}
				else{opacity = opacity - diff.opacity;}
				e.elem.style.opacity = opacity;
			} 
		});
	});
    myRender();
})
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

// const render = Render.create({
//     canvas: canvas,
//     engine: engine,
//     options: {
//         wireframes: false, 
//         width: wrapper_width, 
//         height: wrapper_height,
//         background: 'rgba(255, 0, 0, 0.5)'
//     }
// })

const LetterBoxArray = new Array();
// Bodies.rectangle(x-center, y-center, width, height)
class LetterBox {
    constructor(width, height, centerX, centerY, id){
        this.w = width; this.h = height;
        this.centerX = centerX; this.centerY = centerY;
        // at first, top: -40, left:80
        this.body=Matter.Bodies.rectangle(this.centerX, this.centerY, this.w, this.h, {restitution: 1,friction: 0});
        this.elem=document.querySelector(`#${id}`);
        this.elem.style.height = `${height}px`; this.elem.style.width = `${width}px`;
        this.elem.style.left = `${centerX - width/2}px`; this.elem.style.top = `${centerY - height/2}px`;
        console.log(this.elem);
    }
    render() {
        const {x, y} = this.body.position;
        this.elem.style.top = `${y - this.h / 2}px`;
        this.elem.style.left = `${x - this.w / 2}px`;
        this.elem.style.transform = `rotate(${this.body.angle}rad)`;
    };
};

// const mouse = Mouse.create(canvas);
// Render.mouse = mouse;
const mouseConstraint = Matter.MouseConstraint.create(engine, {
    // mouse: Render.mouse,
    element: document.body,
});
World.add(world, mouseConstraint);

// boundaries.
const bottom = Bodies.rectangle(wrapper_width/2, wrapper_height+5, wrapper_width, 10, {isStatic: true,});
const Top = Bodies.rectangle(wrapper_width/2, -5, wrapper_width, 10, {isStatic: true,});
const left = Bodies.rectangle(-5, wrapper_height/2, 10, wrapper_height, {isStatic: true,});
const right = Bodies.rectangle(wrapper_width+5, wrapper_height/2, 10, wrapper_height, {isStatic: true,});
World.add(world, [bottom, Top, left, right]);

// Matter.Runner.run(engine)
// Render.run(render);
function myRender() {
    LetterBoxArray.forEach((e)=>{e.render();});
    // box.render();
    // box2.render();
    Matter.Engine.update(engine);
    requestAnimationFrame(myRender);
}


window.addEventListener("DOMContentLoaded",()=>{
    engine.gravity.x=1;
    const text = "Hello";
    for(let i=0;i<text.length;i++){
        const letter = text[i];
        const node = document.createElement("div");
        const id = `l${i}`;
        node.setAttribute("id",id);
        node.setAttribute("class","letter");
        node.innerHTML = `<h1>${letter}</h1>`;
        wrapper.appendChild(node);
        const box = new LetterBox(50,50,50 * i + 50,50,id);
        LetterBoxArray.push(box);
        World.add(world, box.body);
    }
    // const box = new LetterBox(140,80,150,0,"l1");
    // const box2 = new LetterBox(140,80,150,100,"l2");
    // World.add(world, [box.body, box2.body, bottom, Top, left, right]);
    myRender();
})
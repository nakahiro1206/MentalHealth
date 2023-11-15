function LoadSimulation(){

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
    const Runner = Matter.Runner;


    const CircleArray = new Array();
    // Bodies.rectangle(x-center, y-center, width, height)
    class Circle {
        constructor(radius, centerX, centerY){
            this.w = radius * 2; this.h = radius*2;
            this.centerX = centerX; this.centerY = centerY;
            // at first, top: -40, left:80
            // this.body=Matter.Bodies.rectangle(this.centerX, this.centerY, this.w, this.h, {restitution: 0.5,friction: 0});
            this.body=Matter.Bodies.circle(this.centerX, this.centerY, radius, {
                restitution: 0.5,friction: 0,
                render: {fillStyle: 'lightblue'},
            });
        }
    };

    // boundaries.
    const bottom = Bodies.rectangle(wrapper_width/2, wrapper_height+50, wrapper_width, 100, {isStatic: true,});
    // const Top = Bodies.rectangle(wrapper_width/2, -50, wrapper_width, 100, {isStatic: true,});
    const left = Bodies.rectangle(-50, wrapper_height/2, 100, wrapper_height, {isStatic: true,});
    const right = Bodies.rectangle(wrapper_width+50, wrapper_height/2, 100, wrapper_height, {isStatic: true,});
    // World.add(world, [bottom, Top, left, right]);
    World.add(world, [bottom,left, right]);


    const render = Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            width: wrapper_width,
            height: wrapper_height,
            wireframes: false,
            background: 'rgba(0,0,0,0)',
        }
    });

    const radius = 15;
    const circle_num = 40;
    for(let i=0;i<circle_num;i++){
        const x = radius + Math.random()*(wrapper_width-radius*2);
        const y = radius + Math.random()*(wrapper_height-radius*2);
        const circle = new Circle(radius, x, y);
        CircleArray.push(circle);
        World.add(world, circle.body);
    }
    wrapper.addEventListener("touchstart", (event)=>{
        CircleArray.forEach((e)=>{
            const scale = Math.random()*3;
            Matter.Body.scale(e.body, scale,scale);
        });
    });
    wrapper.addEventListener("touchend", (event)=>{});
    Render.run(render);
    // create runner
    const runner = Runner.create();
    Runner.run(runner, engine);
}

window.addEventListener("DOMContentLoaded",()=>{
    let startX = 0;
    let startY = 0;
    function TouchStart(event){
        event.preventDefault();
        startX = event.touches[0].pageX;
        startY = event.touches[0].pageY;
    }
    function TouchEnd(event){
        event.preventDefault();
        // const endX = event.changedTouches[0].pageX;
        // const endY = event.changedTouches[0].pageY;
        // if(endX < startX){
        //     if((startX - endX) > Math.abs(endY - startY)){
                document.querySelector("#snap-item-1").classList.add("hidden");
                document.querySelector("#snap-item-2").classList.remove("hidden");
                LoadSimulation();
                window.removeEventListener("touchstart",TouchStart);
                window.removeEventListener("click", TouchEnd);
        //     }
        // }
    }
    window.addEventListener("touchstart",TouchStart);
    window.addEventListener("click",TouchEnd);
})
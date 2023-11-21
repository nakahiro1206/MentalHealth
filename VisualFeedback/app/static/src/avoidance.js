function LoadSimulation(){
    // wrapper
    const wrapper = document.getElementById("wrapper");
    const wrapper_height = wrapper.clientHeight;
    const wrapper_width = wrapper.clientWidth;
    const WRAPPER_LEFT = wrapper.getBoundingClientRect().left;
    const WRAPPER_TOP = wrapper.getBoundingClientRect().top;
    const instruction = document.querySelector("#instruction");

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
    const circle_num = 40;
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
            // if(x>wrapper_width){Matter.Body.setPosition(this.body,{x: wrapper_width,y: y});}
            // else if(x<0){Matter.Body.setPosition(this.body,{x: wrapper_width,y: y});}
            // if(y>wrapper_height){Matter.Body.setPosition(this.body,{x: x,y: wrapper_height});}
            // else if(y<0){Matter.Body.setPosition(this.body,{x: x,y: 0});}
            if(y<this.scale * radius){this.elem.style.display="none";}
            else{this.elem.style.display="block";}
            this.elem.style.top = `${y - this.h / 2}px`;
            this.elem.style.left = `${x - this.w / 2}px`;
            this.elem.style.transform = `rotate(${this.body.angle}rad) scale(${this.scale}, ${this.scale})`;
            this.elem.style.opacity = this.opacity;
        };
    };

    let state = 0;
    const inflate = new Array(circle_num);
    const deflate = new Array(circle_num);
    const inflate_time = 240;
    const vibrate_time = 420;
    const deflate_time = 480;
    for(let i=0;i<circle_num;i++){
        const ratio = Math.random()*4
        inflate[i] = Math.pow( ratio, 1/240);
        deflate[i] = Math.pow( 1/ratio, 1/480);
    }
    
    function myRender() {
        Matter.Engine.update(engine);
        if(state==0){
            // alert(0)
            CircleArray.forEach((e)=>{
                const scale = 1/ e.scale;
                Matter.Body.scale(e.body, scale,scale);
                e.scale = 1;
                e.render();
            });
            for(let i=0;i<circle_num;i++){
                const ratio = Math.random()*4
                inflate[i] = Math.pow( ratio, 1/240);
                deflate[i] = Math.pow( 1/ratio, 1/480);
            }
        }
        else if(state < inflate_time){
            CircleArray.forEach((e, i)=>{
                // const scale = Math.random()*6;
                Matter.Body.scale(e.body, inflate[i], inflate[i]);
                e.scale *= inflate[i];
                e.render();
            });
        }
        else if(state < inflate_time + vibrate_time){
            const procedure = (state - inflate_time)%120;
            const opacity = 1 - Math.min(procedure, 120-procedure) / 120;
            console.log(opacity);
            CircleArray.forEach((e, i)=>{
                e.opacity = opacity;
                e.render();
            });
        }
        else if(state < inflate_time + vibrate_time + deflate_time){
            CircleArray.forEach((e, i)=>{
                // const scale = Math.random()*6;
                Matter.Body.scale(e.body, deflate[i], deflate[i]);
                e.scale *= deflate[i];
                e.render();
            });
        }
        else{state = -1;}
        state++;
        requestAnimationFrame(myRender);
    }

    // boundaries.
    const bottom = Bodies.rectangle(wrapper_width/2, wrapper_height+50, wrapper_width+200, 100, {isStatic: true,});
    // const top = Bodies.rectangle(wrapper_width/2, -50, wrapper_width+200, 100, {isStatic: true,});
    const left = Bodies.rectangle(-50, wrapper_height/2 + 50, 100, (wrapper_height+100)*2, {isStatic: true,});
    const right = Bodies.rectangle(wrapper_width+50, wrapper_height/2 + 50, 100, (wrapper_height+100)*2, {isStatic: true,});
    // World.add(world, [bottom, top, left, right]);
    World.add(world, [bottom,left, right]);
    // engine.gravity.y=0;

    for(let i=0;i<circle_num;i++){
        const node = document.createElement("div");
        const id = `l${i}`;
        node.setAttribute("id",id);
        node.setAttribute("class","letter");
        node.style.backgroundColor = `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`;
        wrapper.appendChild(node);
        const x = radius + Math.random()*(wrapper_width-radius*2);
        const y = radius + Math.random()*(wrapper_height-radius*2);
        const circle = new Circle(radius, x, y, id);
        CircleArray.push(circle);
        World.add(world, circle.body);
    }
    wrapper.addEventListener("mousedown", (event)=>{
        state=1;
    });
    wrapper.addEventListener("mouseup", (event)=>{
        // alert(0);
        state=0;
    });

    myRender();
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
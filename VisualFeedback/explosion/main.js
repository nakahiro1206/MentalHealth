// height, width
const SCREEN_WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const SCREEN_HEIGHT = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
console.log(SCREEN_HEIGHT * SCREEN_WIDTH);

// wrapper
const wrapper = document.getElementById("wrapper");
// canvas which draws ball
const canvas = document.getElementById("canvas");
const g = canvas.getContext("2d"); // ctx means context
// particles_wrapper
const particles_wrapper = document.getElementById("particles_wrapper");
// start menu
const start_canvas = document.getElementById("start_canvas");
const start_g = start_canvas.getContext("2d");
// button
const start_button = document.getElementById("start_btn");
const exit_button = document.getElementById("exit_btn");

// particles array
const particles =Array();
/*ボールクラス*/
class Particle{
	constructor(div, x, y, color){
		this.div = div;
		this.x = x;	// x座標
		this.y = y;	// y座標
		this.color = color;// color: [read, green, blue, alpha]
		// color info.
	}
};

function DrawText(){
	// 背景.
	// g.fillStyle = "white";
	// g.fillRect(0, 0, canvas.width, canvas.height);
	
	const text = "Alice's Adventure in Wonderland\nNightmare before Christmas";
	g.fillStyle = "green"; g.font = '50px Roboto medium';
	const fontSize = 50; const lineHeight = 1.5;
	const lines = text.split("\n");
	for(let i=0; i<lines.length; i++ ){
		const line = lines[i] ;
		let addY=fontSize;
		if (i!=0){addY += fontSize * lineHeight * i ;}
		g.fillText( line, 100, 100 + addY, SCREEN_WIDTH-100) ;
	}
	// g.fillText(text, 50, 50);
}

/*起動処理*/
window.addEventListener("load", function(){
	// wrapper
	wrapper.style.position="relative";
	// start menu
	start_canvas.width=SCREEN_WIDTH;start_canvas.height=SCREEN_HEIGHT;
	start_canvas.style.position="absolute";
	start_canvas.style.zIndex = 2;
	// start_button
	start_button.style.display = "block";

	// canvas
	canvas.width = SCREEN_WIDTH; canvas.height = SCREEN_HEIGHT;
	canvas.style.position="absolute";
	canvas.style.zIndex = 1;

	// particle wrapper div
	particles_wrapper.style.width = SCREEN_WIDTH+"px";
	particles_wrapper.style.height = SCREEN_HEIGHT+"px";
	particles_wrapper.style.position="absolute";
	particles_wrapper.style.zIndex = 0;

	start_g.fillStyle = "rgba(0, 0, 0, 0.4)";
	start_g.fillRect(0, 0, canvas.width, canvas.height);
	// start_canvas.style.backgroundColor = "black";
	start_g.fillStyle = "skyblue";
	start_g.fillRect(50, 50, 200, 100);

	DrawText();

	// click event.
	start_button.addEventListener("click", function() {
		start_button.style.display="none";
		start_g.clearRect(0, 0, start_canvas.width, start_canvas.height);
		start_canvas.style.display ="none";

		const img = g.getImageData(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
		for(let i=0;i<SCREEN_HEIGHT;i++){
			for(let j=0;j<SCREEN_WIDTH;j++){
				// i represents height, j width. 0 ~ 255.
				const index = (j + i * SCREEN_WIDTH)*4;
				const [red,green,blue,alpha]=img.data.slice(index, index + 4);
				if(alpha!=0){
					// if color is not transparent.
					// generate ball
					const particle = document.createElement("div");
					particle.setAttribute("class", "particle");
					particle.style.backgroundColor = `rgba(${red}, ${green}, ${blue}, ${alpha/255})`;
					particle.style.top = i + "px"; particle.style.left = j + "px";
					particle.style.position = "absolute";
					particles_wrapper.appendChild(particle);
					particles.push(new Particle(particle, j, i, [red,green,blue,alpha]));
				}		
			}
		}
		g.clearRect(0, 0, canvas.width, canvas.height);
		canvas.style.display="none";

		particles_wrapper.addEventListener("click",function(event){
			const clientX = event.clientX; const clientY = event.clientY;
			// console.log(clientX, clientY);
			const explosionRadius = 50;
			let length = particles.length;
			for(let i=0;i<length;i++){
				const particle = particles[i];
				if((clientX-particle.x)**2 + (clientY-particle.y)**2 < explosionRadius**2){
					// explosion effect.
					particle.div.addEventListener('transitionend', function() {
						particle.div.remove();
					});

					function rand(min, max) {return Math.random() * ((max-min) + 1) + min;}
					const diffX = Math.floor(rand(80, 150) * Math.cos(Math.random()* 2 * Math.PI));
      				const diffY = Math.floor(rand(80, 150) * Math.sin(Math.random()* 2 * Math.PI));
					if(i%100==0)console.log(`translateX( ${diffX} px) translateY( ${diffY} px)`);
					particle.div.style.transform = `translateX(${diffX}px) translateY(${diffY}px)`;
					particle.div.style.opacity = "0";
					particle.div.style.transition="all 1s ease";
					// particle.div.remove();
					particles.splice(i,1);
					length--;i--;
				}
			};
		});
		// mainLoop();
		// 先に実行されるっぽい. let で終了コードを準備.
		// console.log("exit animation");
		// exit button.
	});
});
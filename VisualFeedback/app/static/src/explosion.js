// height, width
const SCREEN_WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const SCREEN_HEIGHT = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const WRAPPER_WIDTH = document.getElementById("wrapper").clientWidth;
const WRAPPER_HEIGHT = document.getElementById("wrapper").clientHeight;
const WRAPPER_LEFT = document.getElementById("wrapper").getBoundingClientRect().left;
const WRAPPER_TOP = document.getElementById("wrapper").getBoundingClientRect().top;
console.log(SCREEN_HEIGHT * SCREEN_WIDTH);

// wrapper
const wrapper = document.getElementById("wrapper");
// canvas which draws ball
const canvas = document.getElementById("canvas");
const g = canvas.getContext("2d"); // ctx means context
// particles_wrapper
const particles_wrapper = document.getElementById("particles_wrapper");
// button
const start_button = document.getElementById("start_btn");
const exit_button = document.getElementById("exit_btn");

// particles array
const particles ={};
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
	g.fillStyle = "black"; 
	g.font = '20px Roboto medium';
	const fontSize = 20; const lineHeight = 1.5;
	const lines = Text.split("\n");

	let TextY=fontSize;
	for(let i=0; i<lines.length; i++){
		let TextX=0;
		const line = lines[i];
		if (i!=0){TextY += fontSize * lineHeight;}
		for(let j=0;j<line.length;j++){
			const value = line[j];
			console.log(value);
			const textWidth = g.measureText(value).width;
			if(TextX + textWidth > WRAPPER_WIDTH){
				TextY += fontSize * lineHeight;
				TextX = 0;
			}
			console.log([value, TextX, TextY]);
			g.fillText(value, TextX, TextY);
			TextX += textWidth;
		}
	}
}

function rand(min, max) {return Math.random() * ((max-min) + 1) + min;}

/*起動処理*/
window.addEventListener("load", function(){
	// wrapper
	wrapper.style.position="relative";

	// canvas
	canvas.width = WRAPPER_WIDTH; canvas.height = WRAPPER_HEIGHT;
	// canvas.style.position="absolute";
	canvas.style.zIndex = 1;

	// particle wrapper div
	particles_wrapper.style.width = WRAPPER_WIDTH+"px";
	particles_wrapper.style.height = WRAPPER_HEIGHT+"px";
	// particles_wrapper.style.position="absolute";
	particles_wrapper.style.zIndex = 0;

	DrawText();

	// click event.
	start_button.addEventListener("click", function() {
		const img = g.getImageData(0,0,WRAPPER_WIDTH,WRAPPER_HEIGHT);
		for(let i=0;i<WRAPPER_HEIGHT;i++){
			for(let j=0;j<WRAPPER_WIDTH;j++){
				// i represents height, j width. 0 ~ 255.
				const index = (j + i * WRAPPER_WIDTH)*4;
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
					particles[i *WRAPPER_WIDTH + j] =new Particle(particle, j, i, [red,green,blue,alpha]);
				}		
			}
		}
		g.clearRect(0, 0, canvas.width, canvas.height);
		canvas.style.display="none";
		particles_wrapper.style.display="block";

		particles_wrapper.addEventListener("click",function(event){
			let length = Object.keys(particles).length;
			const X = Math.floor(event.clientX-WRAPPER_LEFT); const Y = Math.floor(event.clientY-WRAPPER_TOP);
			const explosionRadius = Math.floor(Math.min(WRAPPER_HEIGHT, WRAPPER_WIDTH) / 5);
			console.log(explosionRadius **2);
			console.log(Object.keys(particles).length);
			const randArray =Array();
			for(let i =Y-explosionRadius;i<Y+explosionRadius;i++){
				for(let j =X-explosionRadius;j<X+explosionRadius;j++){
					if(i<0 || i>=WRAPPER_HEIGHT){continue;}
					if(j<0 || j>=WRAPPER_WIDTH){continue;}
					if((Y-i)**2 +(X-j)**2 >=explosionRadius **2){continue;}
					randArray.push([i, j]);
				}
			}
			for(let i = (randArray.length - 1); 0 < i; i--){
				const r = Math.floor(Math.random() * (i + 1));
				const tmp = randArray[i];
				randArray[i] = randArray[r];
				randArray[r] = tmp;
			}
			// for(let i =Y-explosionRadius;i<Y+explosionRadius;i++){
			// 	for(let j =X-explosionRadius;j<X+explosionRadius;j++){
			// 		if(i<0 || i>=WRAPPER_HEIGHT){continue;}
			// 		if(j<0 || j>=WRAPPER_WIDTH){continue;}
			// 		if((Y-i)**2 +(X-j)**2 >=explosionRadius **2){continue;}
			for(let r=0;r<randArray.length;r++){
					const [i, j] = randArray[r];
					const index = i* WRAPPER_WIDTH + j;
					if(index in particles){
						const particle = particles[index];
						// explosion effect.
						// particle.div.addEventListener('transitionend', function() {
						// 	particle.div.remove();
						// });
						// setTimeout(()=>{
						// 別のレイヤーで表現しよう.
						const diffX = Math.floor(rand(80, 150) * Math.cos(Math.random()* 2 * Math.PI));
						const diffY = Math.floor(rand(80, 150) * Math.sin(Math.random()* 2 * Math.PI));
						particle.div.classList.add("opaque");
						particle.div.style.transform = `translateX(${diffX}px) translateY(${diffY}px)`;//  scaleX(5) scaleY(5)`;
						// delete particles[index]
						// },0);})(particle);
					}
				}
			// }
			console.log(length - Object.keys(particles).length);
			if(length==0){
				console.log("end");
			}
		});
		// mainLoop();
		// 先に実行されるっぽい. let で終了コードを準備.
		// console.log("exit animation");
		// exit button.
	});
});
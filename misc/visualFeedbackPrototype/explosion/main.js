// height, width
const SCREEN_WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const SCREEN_HEIGHT = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

// wrapper
const wrapper = document.getElementById("wrapper");

const WRAPPER_WIDTH = wrapper.clientWidth;
const WRAPPER_HEIGHT = wrapper.clientHeight;
const WRAPPER_LEFT = wrapper.getBoundingClientRect().left;
const WRAPPER_TOP = wrapper.getBoundingClientRect().top;

// canvas which draws ball
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d"); // ctx means context
// canvas for explosion
const canvasExp = document.getElementById("canvas_exp");
const ctxExp = canvasExp.getContext("2d");

function DrawText(){
	ctx.fillStyle = "white"; 
	ctx.font = '20px Roboto medium';
	const fontSize = 20; const lineHeight = 1.5;
	const lines = Text.split("\n");

	let TextY=fontSize;
	for(let i=0; i<lines.length; i++){
		let TextX=0;
		const line = lines[i];
		if (i!=0){TextY += fontSize * lineHeight;}
		for(let j=0;j<line.length;j++){
			const value = line[j];
			const textWidth = ctx.measureText(value).width;
			if(TextX + textWidth > WRAPPER_WIDTH){
				TextY += fontSize * lineHeight;
				TextX = 0;
			}
			ctx.fillText(value, TextX, TextY);
			TextX += textWidth;
		}
	}
}

function rand(min, max) {return Math.random() * ((max-min) + 1) + min;}

const expArray = new Array();
class expParticle{
	constructor(x, y, vx, vy, color){
		this.x = x;	// x座標
		this.y = y;	// y座標
		this.vx = vx;
		this.vy = vy;
		this.color = color;// rgba(r, g, b, a)
	}
};

/*起動処理*/
window.addEventListener("load", function(){
	// canvas
	canvas.width = WRAPPER_WIDTH; canvas.height = WRAPPER_HEIGHT;
	canvas.style.zIndex = 1;
	// canvas for explosion
	canvasExp.width = WRAPPER_WIDTH; canvasExp.height = WRAPPER_HEIGHT;
	canvasExp.style.zIndex = 0;

	DrawText();
	wrapper.addEventListener("click", (event)=>{
		const X = Math.floor(event.clientX-WRAPPER_LEFT); const Y = Math.floor(event.clientY-WRAPPER_TOP);
		let Color = "#";
		for(let i = 0; i < 6; i++) {
			Color += (16*Math.random() | 0).toString(16);
		}
		for(let i=0;i<100;i++){
			const VX = rand(80, 150) * Math.cos(Math.random()* 2 * Math.PI);
			const VY = rand(80, 150) * Math.sin(Math.random()* 2 * Math.PI);
			expArray.push(new expParticle(X, Y, VX, VY, Color));
		}
	});

	requestAnimationFrame(render);
	function render() {
		const radius=3;
		ctxExp.fillStyle = '#00000010';
		ctxExp.fillRect(0, 0, WRAPPER_WIDTH, WRAPPER_HEIGHT);
		for(let i=0;i<expArray.length;i++){
			const value = expArray[i];
			value.x = value.x + value.vx * 0.05;
			value.y = value.y + value.vy * 0.05;
			value.vx *=0.9; value.vy *=0.9;
			if(Math.abs(value.vx) <1 && Math.abs(value.vy)<1){
				expArray.splice(i,1); i--;
				continue;
			}
			ctx.beginPath();
			ctx.arc(Math.floor(value.x), Math.floor(value.y), radius, 0, Math.PI*2, false);
			ctx.clearRect(value.x-radius,value.y-radius, radius * 2, radius * 2);

			ctxExp.beginPath();
			ctxExp.fillStyle = value.color;
			ctxExp.arc(Math.floor(value.x), Math.floor(value.y), radius, 0, Math.PI*2, false);
			ctxExp.fill();
		};
		requestAnimationFrame(render);
	}
});
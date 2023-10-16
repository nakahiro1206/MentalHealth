// height, width
const SCREEN_WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const SCREEN_HEIGHT = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
console.log(SCREEN_HEIGHT * SCREEN_WIDTH);

// wrapper
const wrapper = document.getElementById("wrapper");
// canvas which draws ball
const canvas = document.getElementById("canvas");
const g = canvas.getContext("2d"); // ctx means context
// dead canvas which draw fixed ball
const dead_canvas = document.getElementById("canvas_dead");
const dead_g = dead_canvas.getContext("2d"); // ctx means context
// start menu
const start_canvas = document.getElementById("start_canvas");
const start_g = start_canvas.getContext("2d");
// button
const button = document.getElementById("btn");
const exit_button = document.getElementById("exit_btn");

// orientation
const vec = {x: 0, y: 0 };
window.addEventListener("deviceorientation", function(e){
	vec.x = e.gamma / 10;	// x方向の移動量: そのままでは大きい為、小さくする
	vec.y = e.beta / 10;		// y方向の移動量:         〃
}, false);

// balls array
const balls =Array();
/*ボールクラス*/
class Ball{
	constructor(x, y, r, ink, color){
		this.x = x;	// x座標
		this.y = y;	// y座標
		this.r = r;	// 半径
		this.ink = ink; // 進める量.
		this.color = color;// color: [read, green, blue, alpha]
		// color info.
	}
	draw(){
		// ink=0で終了.
		if(this.ink==0){return false;}
		const tmpX = this.x; const tmpY = this.y;
		// 枠外判定.
		if(this.x + vec.x <= SCREEN_WIDTH - this.r){
			if(this.x + vec.x >= this.r){
				this.x += vec.x;
			}else{this.x = this.r;}
		}else{this.x = SCREEN_WIDTH - this.r;}
		// 枠外判定.
		if(this.y + vec.y <= SCREEN_HEIGHT - this.r){
			if(this.y + vec.y >= this.r){
				this.y += vec.y;
			}else{this.y = this.r;}
		}else{this.y = SCREEN_HEIGHT - this.r;}

		// ink を距離に比例して減らす.
		const diffX = this.x - tmpX; const diffY = this.y - tmpY;
		this.ink -= Math.sqrt(diffX*diffX + diffY*diffY) / 10;
		if(this.ink < 0){this.ink = 0;};

		// 円を描画（塗りつぶし円）
		g.beginPath();
		const [red, green, blue, alpha] = this.color;
		g.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
		g.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		g.fill();
		return true;
	};
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
		g.fillText( line, 100, 100 + addY ) ;
	}
	// g.fillText(text, 50, 50);
}

function DrawBalls(){
	// frameごとに速度減衰; 時間爆発的に; activeなframe, activeなink ballだけ動かす. dead canvasとか作る;
	// 粒子を一つにして、それに軌跡を与える方が自然かも.
	// ボールを描く
	let cnt=0;
	balls.forEach(element => {
		const flag = element.draw();
		if(flag == false){
			cnt++;
		}
	});
	if(cnt == balls.length){
		return false;
	}
	return true;
}

/*ゲームループ*/
let requestID;
function mainLoop(){
	const flag = DrawBalls();
	// console.log("DrawBall end");
	// console.log(flag);
	// 再帰呼び出し
	if(flag == true){
		requestID = requestAnimationFrame(mainLoop);
	}
	else{
		cancelAnimationFrame(requestID);
		exit_button.style.display="block";
	}
}

/*起動処理*/
window.addEventListener("load", function(){
	// wrapper
	wrapper.style.position="relative";
	// start menu
	start_canvas.width=SCREEN_WIDTH;start_canvas.height=SCREEN_HEIGHT;
	start_canvas.style.position="absolute";
	start_canvas.style.zIndex = 2;

	// canvas
	canvas.width = SCREEN_WIDTH; canvas.height = SCREEN_HEIGHT;
	canvas.style.position="absolute";
	canvas.style.zIndex = 1;

	// canvas
	dead_canvas.width = SCREEN_WIDTH; canvas.height = SCREEN_HEIGHT;
	dead_canvas.style.position="absolute";
	dead_canvas.style.zIndex = 0;

	start_g.fillStyle = "rgba(0, 0, 0, 0.4)";
	start_g.fillRect(0, 0, canvas.width, canvas.height);
	// start_canvas.style.backgroundColor = "black";
	start_g.fillStyle = "skyblue";
	start_g.fillRect(50, 50, 200, 100);

	DrawText();

	// click event.
	button.addEventListener("click", function() {
		button.style.display="none";
		start_g.clearRect(0, 0, start_canvas.width, start_canvas.height);

		const img = g.getImageData(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
		for(let i=0;i<SCREEN_HEIGHT;i++){
			for(let j=0;j<SCREEN_WIDTH;j++){
				// i represents height, j width. 0 ~ 255.
				const index = (j + i * SCREEN_WIDTH)*4;
				const [red,green,blue,alpha]=img.data.slice(index, index + 4);
				if(alpha!=0){
					// if color is not transparent.
					// generate ball
					// sin wave.
					const ink = 10 + 10 * Math.sin(i+j);
					balls.push(new Ball(j, i, 1, ink, [red,green,blue,alpha]));	
				}		
			}
		}
		DrawBalls();
		mainLoop();
		// 先に実行されるっぽい. let で終了コードを準備.
		console.log("exit animation");
		// exit button.
	});
});
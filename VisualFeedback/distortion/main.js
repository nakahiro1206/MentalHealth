// height, width
const SCREEN_WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const SCREEN_HEIGHT = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

// wrapper
const wrapper = document.getElementById("wrapper");
// canvas which draws ball
const canvas = document.getElementById("canvas");
const g = canvas.getContext("2d"); // ctx means context
// start menu
const start_canvas = document.getElementById("start_canvas");
const start_g = start_canvas.getContext("2d");
// button
const button = document.getElementById("btn");

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
	constructor(x, y, r, v){
		this.x = x;	// x座標
		this.y = y;	// y座標
		this.r = r;	// 半径
		this.v = v; // 速度.
		// color info.
	}
	draw(){
		// 位置を計算
		const vecX = vec.x * this.v;
		const vecY = vec.y * this.v;
		this.v -= Math.sqrt(vecX * vecX + vecY * vecY) * 0.001;
		if(this.v < 0){this.v = 0;};
		if(this.x + vecX <= SCREEN_WIDTH - this.r){
			if(this.x + vecX >= this.r){
				this.x += vecX;
			}else{this.x = this.r;}
		}else{this.x = SCREEN_WIDTH - this.r;}

		if(this.y + vecY <= SCREEN_HEIGHT - this.r){
			if(this.y + vecY >= this.r){
				this.y += vecY;
			}else{this.y = this.r;}
		}else{this.y = SCREEN_HEIGHT - this.r;}
		// 円を描画（塗りつぶし円）
		g.beginPath();
		g.fillStyle = "black";
		g.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		g.fill();
	};
};

function DrawBalls(){
	// frameごとに速度減衰; 時間爆発的に; activeなframe, activeなink ballだけ動かす. dead canvasとか作る;
	// 粒子を一つにして、それに軌跡を与える方が自然かも.
	// 画面クリア
	g.fillStyle = "#ddd";
	g.fillRect(0, 0, canvas.width, canvas.height);

	// ボールを描く
	balls.forEach(element => {
		element.draw();
	});
}

/*ゲームループ*/
function mainLoop(){
	DrawBalls();
	// 再帰呼び出し
	requestAnimationFrame(mainLoop);
}

/*起動処理*/
window.addEventListener("load", function(){
	// wrapper
	wrapper.style.position="relative";
	// start menu
	start_canvas.width=SCREEN_WIDTH;start_canvas.height=SCREEN_HEIGHT;
	start_canvas.style.position="absolute";
	start_canvas.style.zIndex = 1;

	// canvas
	canvas.width = SCREEN_WIDTH; canvas.height = SCREEN_HEIGHT;
	canvas.style.position="absolute";
	canvas.style.zIndex = 0;

	start_g.fillStyle = "rgba(0, 0, 0, 0.4)";
	start_g.fillRect(0, 0, canvas.width, canvas.height);
	// start_canvas.style.backgroundColor = "black";
	start_g.fillStyle = "skyblue";
	start_g.fillRect(50, 50, 200, 100);

	// generate balls
	for(let i =0;i<10;i++){
		balls.push(new Ball(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 20, 0.1*i));
	}
	DrawBalls();
	// text
	g.font = '50px Roboto medium';
	g.fillText('Artis', 50, 50);
	const img = g.getImageData(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
	for(let i=0;i<SCREEN_HEIGHT;i++){
		for(let j=0;j<SCREEN_WIDTH;j++){
			// i represents height, j width. 0 ~ 255.
			// alpha
			let alpha = img.data[3 + j * 4 + i * SCREEN_WIDTH * 4];
			// red
			let red = img.data[j * 4 + i * SCREEN_WIDTH * 4];
			// green
			let green = img.data[1 + j * 4 + i * SCREEN_WIDTH * 4];
			// blue
			let blue = img.data[2 + j * 4 + i * SCREEN_WIDTH * 4];
			if(red==0 && green==0 && blue==0){
				// generate ball
				balls.push(new Ball(j, i, 5, 0.1));	
			}		
		}
	}
	DrawBalls();

	// click event.
	button.addEventListener("click", function() {
		button.style.display="none";
		start_g.clearRect(0, 0, start_canvas.width, start_canvas.height);
		mainLoop();
	});
});
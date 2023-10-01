// const SCREEN_WIDTH = window.outerWidth; // 480;
// const SCREEN_HEIGHT = window.outerHeight;

const SCREEN_WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const SCREEN_HEIGHT = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

/*グローバル変数*/
// var canvas = null;		// キャンバス
var g = null;				// コンテキスト
var vec = {x: 0, y: 0 };	// 加速度センサー値格納用
var ball = null;			// 表示するボール
var balls =Array();
/*加速度センサーの値を取得*/
window.addEventListener("deviceorientation", function(e){
	vec.x = e.gamma / 10;	// x方向の移動量: そのままでは大きい為、小さくする
	vec.y = e.beta / 10;		// y方向の移動量:         〃
}, false);

/*ボールクラス*/
class Ball{
	constructor(x, y, r, v){
		this.x = x;	// x座標
		this.y = y;	// y座標
		this.r = r;	// 半径
		this.v = v; // 速度.
	}
	draw(){
		// 位置を計算
		let vecX = vec.x * this.v;
		let vecY = vec.y * this.v;
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
		g.fillStyle = "orange";
		g.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		g.fill();
	};
};

function DrawBalls(){
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
	const wrapper = document.getElementById("wrapper");
	wrapper.style.position="relative";
	// start menu
	const start_canvas = document.getElementById("start_canvas");
	start_canvas.width=SCREEN_WIDTH;start_canvas.height=SCREEN_HEIGHT;
	start_canvas.style.position="absolute";
	start_canvas.style.zIndex = 1;
	const start_g = start_canvas.getContext("2d");
	// canvas
	const canvas = document.getElementById("canvas");
	canvas.width = SCREEN_WIDTH; canvas.height = SCREEN_HEIGHT;
	canvas.style.position="absolute";
	canvas.style.zIndex = 0;
	g = canvas.getContext("2d"); // ctx means context

	start_g.fillStyle = "rgba(0, 0, 0, 0.4)";
	start_g.fillRect(0, 0, canvas.width, canvas.height);
	// start_canvas.style.backgroundColor = "black";
	start_g.fillStyle = "skyblue";
	const rectX = 50; const rectY = 50;
	const rectWidth = 200; const rectHeight = 100;
	start_g.fillRect(50, 50, 200, 100);
	// start_canvas.addEventListener("click", function(event) {
	// 	var rect = start_canvas.getBoundingClientRect();
	// 	var clickX = event.clientX - rect.left;
	// 	var clickY = event.clientY - rect.top;
	// 	if (clickX >= rectX && clickX <= rectX + rectWidth &&
	// 		clickY >= rectY && clickY <= rectY + rectHeight) {
	// 		start_g.clearRect(0, 0, start_canvas.width, start_canvas.height);
	// 	}
	// });

	const button = document.getElementById("btn");

	// ボールを生成
	for(let i =0;i<10;i++){
		balls.push(new Ball(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 20, 0.1*i));
	}
	DrawBalls();

	button.addEventListener("click", function() {
		button.style.display="none";
		start_g.clearRect(0, 0, start_canvas.width, start_canvas.height);
		mainLoop();
	});
});


window.addEventListener("click", function(){

	// ボールを一つ生成
	for(let i =0;i<10;i++){
		balls.push(new Ball(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 20, 0.1*i));
	}
	DrawBalls();
	// メインループ実行
	// mainLoop();
});
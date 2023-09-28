// const SCREEN_WIDTH = 480;		// キャンバス幅（ピクセル）
const SCREEN_WIDTH = window.outerWidth;
const SCREEN_HEIGHT = window.outerHeight;// 480;	// キャンバス高さ（ピクセル）

/*
 * グローバル変数
 */
var canvas = null;		// キャンバス
var g = null;				// コンテキスト
var vec = {x: 0, y: 0 };	// 加速度センサー値格納用
var ball = null;			// 表示するボール
var balls =Array();

/*
 * ボールクラス
 */
class Ball{
	constructor(x, y, r){
		this.x = x;	// x座標
		this.y = y;	// y座標
		this.r = r;	// 半径
	}
	draw(){
		// 位置を計算
		if((this.x + vec.x <= SCREEN_WIDTH) && (this.x + vec.x >= 0)){
			this.x += vec.x;
		}else{this.x -= vec.x;}
		// this.y += vec.y;
		if((this.y + vec.y <= SCREEN_HEIGHT) && (this.y + vec.y >= 0)){
			this.y += vec.y;
		}else{this.y -= vec.y;}
		// 円を描画（塗りつぶし円）
		g.beginPath();
		g.fillStyle = "orange";
		g.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		g.fill();
	};
};

/*
 * ゲームループ
 */
function mainLoop(){
	// 画面クリア
	g.fillStyle = "#ddd";
	g.fillRect(0, 0, canvas.width, canvas.height);

	// ボールを描く
	ball.draw();
	balls.forEach(element => {
		element.draw();
	});

	// 再帰呼び出し
	requestAnimationFrame(mainLoop);
}

/*
 * 加速度センサーの値を取得
 */
window.addEventListener("deviceorientation", function(e){
	vec.x = e.gamma / 10;	// x方向の移動量: そのままでは大きい為、小さくする
	vec.y = e.beta / 10;		// y方向の移動量:         〃
}, false);

/*
 * 起動処理
 */
window.addEventListener("load", function(){
	// キャンバス情報取得
	canvas = document.getElementById("canvas");
	g = canvas.getContext("2d");

	// キャンバスサイズ設定
	canvas.width = SCREEN_WIDTH;
	canvas.height = SCREEN_HEIGHT;

	// ボールを一つ生成
	ball = new Ball(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 20);
	for(let i =0;i<10;i++){
		balls.push(new Ball(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 20+10*i));
	}
	// メインループ実行
	mainLoop();
});
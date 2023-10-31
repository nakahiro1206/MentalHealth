// height, width
const SCREEN_WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const SCREEN_HEIGHT = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const WRAPPER_WIDTH = document.getElementById("wrapper").clientWidth;
const WRAPPER_HEIGHT = document.getElementById("wrapper").clientHeight;

// canvas which draws ball
const canvas = document.getElementById("canvas");
const g = canvas.getContext("2d"); // ctx means context
// wrapper
const wrapper = document.getElementById("wrapper");
// button
const button = document.getElementById("start_btn");
const exit_button = document.getElementById("exit_btn");

// orientation
const vec = {x: 0, y: 0 };
window.addEventListener("deviceorientation", function(e){
	vec.x = e.gamma / 20;	// x方向の移動量: そのままでは大きい為、小さくする
	vec.y = e.beta / 20;		// y方向の移動量: そのままでは大きい為、小さくする.
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
		this.ink -= Math.sqrt(diffX*diffX + diffY*diffY);
		if(this.ink < 0){this.ink = 0;};

		// 円を描画（塗りつぶし円）
		const [red, green, blue, alpha] = this.color;
		g.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
		g.beginPath();
		g.fillRect(this.x, this.y, 1, 1);
		return true;
	};
};

function DrawText(){
	g.fillStyle = "black"; 
	g.font = '20px Roboto medium';
	const fontSize = 20; const lineHeight = 1;
	const lines = Text.split("\n");

	let TextY=fontSize;
	for(let i=0; i<lines.length; i++){
		let TextX=0;
		const line = lines[i];
		if (i!=0){TextY += fontSize * lineHeight;}
		for(let j=0;j<line.length;j++){
			const value = line[j];
			const textWidth = g.measureText(value).width;
			if(TextX + textWidth > WRAPPER_WIDTH){
				TextY += fontSize * lineHeight;
				TextX = 0;
			}
			console.log([value, TextX, TextY, textWidth, WRAPPER_WIDTH]);
			g.fillText(value, TextX, TextY);
			TextX += textWidth;
		}
	}
}

function DrawBalls(){
	const drawLimit = 5000;
	// frameごとに速度減衰; 時間爆発的に; activeなframe, activeなink ballだけ動かす. dead canvasとか作る;
	// 粒子を一つにして、それに軌跡を与える方が自然かも.
	// ボールを描く
	let cnt=0;
	for(let i=0;i<drawLimit;i++){
		const index = Math.floor(Math.random()*(balls.length));
		const flag = balls[index].draw();
		if(flag==false){
			cnt++;
		}
	}
	if(cnt > 0){
		return false;
	}
	return true;
}

/*ゲームループ*/
let requestID;
function mainLoop(){
	const flag = DrawBalls();
	// 再帰呼び出し
	if(flag == true){
		requestID = requestAnimationFrame(mainLoop);
	}
	else{
		cancelAnimationFrame(requestID);
	}
}

/*起動処理*/
window.addEventListener("load", function(){
	canvas.width = WRAPPER_WIDTH; canvas.height = WRAPPER_HEIGHT;
	DrawText();
	// click event.
	button.addEventListener("click", function() {
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
					const ink = 100 + 100 * Math.sin((i+j)/100);
					balls.push(new Ball(j, i, 1, ink, [red,green,blue,alpha]));	
				}		
			}
		}
		// DrawBalls(balls.length);
		mainLoop();
	});
});
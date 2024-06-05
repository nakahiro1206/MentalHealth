// height, width
const SCREEN_WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const SCREEN_HEIGHT = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const WRAPPER_WIDTH = document.getElementById("wrapper").clientWidth;
const WRAPPER_HEIGHT = document.getElementById("wrapper").clientHeight;

// canvas which draws ball
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d"); // ctx means context
// wrapper
const wrapper = document.getElementById("wrapper");
// button
const button = document.getElementById("start_btn");
const exit_button = document.getElementById("exit_btn");

// orientation
const vec = {x: 0, y: 0 };
window.addEventListener("deviceorientation", function(e){
	vec.x = Math.floor(e.gamma / 20);	// x方向の移動量: そのままでは大きい為、小さくする
	vec.y =  Math.floor(e.beta / 20);		// y方向の移動量: そのままでは大きい為、小さくする.
}, false);

// balls array
const balls =Array();
/*ボールクラス*/
class Ball{
	constructor(x, y, ink, color){
		this.x = x;	// x座標
		this.y = y;	// y座標
		this.ink = ink; // 進める量.
		this.color = color;// color: [read, green, blue, alpha]
		// color info.
	}
	draw(){
		// ink=0で終了.
		if(this.ink==0){return false;}
		const tmpX = this.x; const tmpY = this.y;
		// 枠外判定.
		if(this.x + vec.x <= SCREEN_WIDTH - 1){
			if(this.x + vec.x >= 0){
				this.x += vec.x;
			}else{this.x = 0;}
		}else{this.x = SCREEN_WIDTH - 1;}
		// 枠外判定.
		if(this.y + vec.y <= SCREEN_HEIGHT - 1){
			if(this.y + vec.y >= 0){
				this.y += vec.y;
			}else{this.y = 0;}
		}else{this.y = SCREEN_HEIGHT - 1;}

		// ink を距離に比例して減らす.
		const diffX = this.x - tmpX; const diffY = this.y - tmpY;
		this.ink -= Math.sqrt(diffX*diffX + diffY*diffY);
		if(this.ink < 0){this.ink = 0;};

		// 円を描画（塗りつぶし円）
		// const [red, green, blue, alpha] = this.color;
		// ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
		// ctx.beginPath();
		ctx.clearRect(Math.floor(this.x), Math.floor(this.y), 1, 1);
		ctx.fillRect(Math.floor(this.x), Math.floor(this.y), 1, 1);
		return true;
	};
};

function DrawBalls(){
	const drawLimit = balls.length;// 5000;
	if(colorCounter >=128){
		ctx.fillStyle = `rgba(1,1,1, ${(colorCounter -127)/128})`;
	}else{
		ctx.fillStyle = `rgba(1,1,1, ${(128-colorCounter)/128})`;
	}
	let cnt=0;
	vec.x = Math.floor(Math.random() + 0.5) * (Math.floor(Math.random() + 0.7)*2-1);
	vec.y = Math.floor(Math.random() + 0.5) * (Math.floor(Math.random() + 0.9)*2-1);
	for(let i=0;i<drawLimit;i++){
		const index = i; // Math.floor(Math.random()*(balls.length));
		const flag = balls[index].draw();
		if(flag==false){
			// ink==0でfalse
			cnt++;
		}
	}
	if(cnt == drawLimit){
		return false;
	}
	return true;
}

/*ゲームループ*/
let requestID;
let colorCounter=0;// max 256;
function mainLoop(){
	const flag = DrawBalls();
	// 再帰呼び出し
	if(flag == true){
		colorCounter = (colorCounter + 1)%256;
		requestID = requestAnimationFrame(mainLoop);
	}
	else{
		cancelAnimationFrame(requestID);
	}
}

function render(){
	const radius =1;
	ctx.fillStyle = '#00000010';
	ctx.fillRect(0, 0, WRAPPER_WIDTH, WRAPPER_HEIGHT);
	vec.x = Math.random();
	vec.y = Math.random();
	for(let i=0;i<balls.length;i++){
		const value = balls[i];
		value.x = value.x + vec.x;
		value.y = value.y + vec.y;
		// value.vx *=0.9; value.vy *=0.9;
		// if(Math.abs(value.vx) <1 && Math.abs(value.vy)<1){
		// 	balls.splice(i,1); i--;
		// 	continue;
		// }
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.arc(Math.floor(value.x), Math.floor(value.y), radius, 0, Math.PI*2, false);
		ctx.fill();
	};
	requestAnimationFrame(render);
}

function DrawText(){
	ctx.fillStyle = "white"; 
	ctx.font = '20px Roboto medium';
	const fontSize = 20; const lineHeight = 1;
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

/*起動処理*/
window.addEventListener("load", function(){
	canvas.width = WRAPPER_WIDTH; canvas.height = WRAPPER_HEIGHT;
	DrawText();
	// click event.
	button.addEventListener("click", function() {
		const img = ctx.getImageData(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
		for(let i=0;i<SCREEN_HEIGHT;i++){
			for(let j=0;j<SCREEN_WIDTH;j++){
				// i represents height, j width. 0 ~ 255.
				const index = (j + i * SCREEN_WIDTH)*4;
				const [red,green,blue,alpha]=img.data.slice(index, index + 4);
				if(alpha!=0){
					// if color is not transparent.
					// generate ball
					// sin wave.
					const ink = 100 + 200 * Math.random();
					balls.push(new Ball(j, i, ink, [red,green,blue,alpha]));	
				}		
			}
		}
		// mainLoop();
		console.log(balls.length)
		requestAnimationFrame(render);
	});
});
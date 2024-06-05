/**
 * canvasJs
 */
const canvas = document.getElementById("canvas");
const SCREEN_WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const SCREEN_HEIGHT = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
canvas.width =  SCREEN_WIDTH; canvas.height = SCREEN_HEIGHT;
const context = canvas.getContext("2d");
const clearButton = document.getElementById("clear");
let isDragging = false;
let lastPosition = { x: null, y: null };

/**
 * 描画処理
 */
function draw(x, y) {
  if (!isDragging) {
    return;
  }

  // 線端の形状, 太さ, 色
  context.lineCap = "round";
  context.lineWidth = 3;
  context.strokeStyle = "black";

  if (lastPosition.x === null || lastPosition.y === null) {
    context.moveTo(x, y);
  } else {
    context.moveTo(lastPosition.x, lastPosition.y);
  }
  context.lineTo(x, y);
  context.stroke();

  // 座標保持
  lastPosition.x = x;
  lastPosition.y = y;
}

/**
 * 描画の開始
 */
function dragStart(event) {
  context.beginPath();
  isDragging = true;
}

/**
 * 描画の終了
 */
function dragEnd(event) {
  context.closePath();
  isDragging = false;

  // 座標リセット
  lastPosition.x = null;
  lastPosition.y = null;
}

/**
 * 描画の削除
 */
function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * イベント定義
 */
function init() {
  // PC用
  canvas.addEventListener("mousedown", dragStart);
  canvas.addEventListener("mouseup", dragEnd);
  canvas.addEventListener("mouseout", dragEnd);
  canvas.addEventListener("mousemove", (e) => {
    draw(
      e.layerX - canvas.getBoundingClientRect().left,
      e.layerY - canvas.getBoundingClientRect().top
    );
  });
  // SP用
  canvas.addEventListener("touchstart", dragStart);
  canvas.addEventListener("touchcancel", dragEnd);
  canvas.addEventListener("touchend", dragEnd);
  canvas.addEventListener("touchmove", (e) => {
    // 描きづらいのでスワイプさせない
    e.preventDefault();

    let x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    let y = e.touches[0].clientY - canvas.getBoundingClientRect().top;

    draw(x, y);
  });
  // リセット
  clearButton.addEventListener("click", clear);
}

init();
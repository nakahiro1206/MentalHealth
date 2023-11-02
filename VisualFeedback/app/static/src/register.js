function Alert(){
// iframe要素を取得
var iframeElem = document.getElementsByTagName('iframe');

// iframeで読み込まれているページからdocumentオブジェクトを取得
var iframeDocument = iframeElem[0].contentDocument || iframeElem[0].contentWindow.document;

// iframeで読み込まれているページからp要素を取得
var pElem = iframeDocument.getElementsByTagName('p')[0];

// p要素のHTMLをアラートで表示
alert(pElem.outerHTML);
}
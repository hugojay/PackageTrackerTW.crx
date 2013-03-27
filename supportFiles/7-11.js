function process(){
	var result = '<iframe src="http://eservice.7-11.com.tw/E-Tracking/search.aspx" width="800" height="480"></iframe>';
	$("body>form>:text").focus();
	$("body").append("<div id='helper'>取件編號/交貨便代號已複製，請 Ctrl+P 貼上查詢</div>");
	$("#helper").css({
		position : "absolute",
		top : 0,
		left : 0,
		width : "100%",
		padding : "10px 0",
		"font-size" : "13pt",
		"text-align" : "center",
		background : "#FFC",
	}).hide().fadeIn().delay(2222).fadeOut();
	document.execCommand("Copy");
	return result;
}
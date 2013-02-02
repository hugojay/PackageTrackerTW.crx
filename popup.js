$(document).ready(function(){
	$("form").submit(function(e){
		e.preventDefault();
		$.ajax({
			url: "http://postserv.post.gov.tw/webpost/CSController?cmd=POS4001_3&_SYS_ID=D&_MENU_ID=189&_ACTIVE_ID=190&MAILNO=" + $(":text").val(),
			dataType: "html",
			cache: false,
			beforeSend: function(){
				$("body").removeClass("result");
				$("#content").html("LOADING");
			},
			success: function(result){
				if(result){
					$("body").addClass("result");
					var head = result.match(/<head.*>/),
					    headstart = result.indexOf(head) + head.toString().length,
					    headend = result.indexOf("</head>"),
					    start = result.indexOf("<!-- ##################主要內容################# BEGIN -->"),
					    end = result.indexOf("<!-- ##################主要內容################# END -->");
					result = process(result.substring(headstart, headend)) + result.substring(start, end);
					$("#content").html(result);
				}else{
					$("#content").html("LOAD FAILED");
				}
			},
			error: function(xhr){
				$("#content").html("CONNECT ERROR\n" + xhr);
			}
		});

	});
});

function process(result){
	// <script src="/webpost/js/common.js"></script>
	//var patt = /<script .*src=".*".*><\/script>/g;
	var patt1 = "<script .*src=\"";
	var patt2 = "\"><\\/script>";
	var patt = new RegExp(patt1 + ".*" + patt2, "g");
	var matches = result.match(patt);
	var splities = result.split(patt);
	if(matches != null){
		for(var i in matches){
			var start = matches[i].match(new RegExp(patt1)).toString().length,
				end = matches[i].indexOf(matches[i].match(new RegExp(patt2))[0]),
				url = "http://postserv.post.gov.tw/" + matches[i].substring(start, end);
			$.getScript(url);
		}
		return splities.join("");
	}else
		return result;
}
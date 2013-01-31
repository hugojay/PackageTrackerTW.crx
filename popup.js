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
					var start = result.indexOf("<!-- ##################主要內容################# BEGIN -->");
					var end = result.indexOf("<!-- ##################主要內容################# END -->");
					result = process(result.substring(start, end));
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
	//var patt = /<script>str_trim\('.*?('\);*<\/script>)/g;
	var patt1 = "<script>str_trim\\('";
	var patt2 = "\\);*<\\/script>"; // ');</script>
	var patt = new RegExp(patt1 + ".*?(" + patt2 + ")", "g");
	var matches = result.match(patt);
	var splities = result.split(patt);
	if(matches != null){
		for(var i in matches){
			matches[i] = matches[i].replace(new RegExp(patt1, "g"), "").replace(new RegExp(patt2, "g"), "");
			splities[i] = splities[i] + matches[i];
		}
		return splities.join("");
	}else
		return result;
}
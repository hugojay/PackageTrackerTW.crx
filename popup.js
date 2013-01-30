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
					if(end < 0) end = result.length;
					$("#content").html(result.substring(start, end));
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


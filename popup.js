$(document).ready(function(event){
	var supportList = [], lengthList = [];
	$.ajax({
		url : "supportList.json",
		dataType : "json",
		success: function(data){
			$.each(data, function(i, v){
				$.each(v.length, function(index, value){
					supportList.push({
						length : value,
						id : v.type,
						title : v.title,
						url : v.url
					});
					if($.inArray(value, lengthList) < 0){
						lengthList.push(value);
					}
				});
			});
			console.log(supportList)
		},
		error : function(){
			$("body").text("Cannot load file supportList.json, try to reinstall.");
		}
	});
	if(typeof window.localStorage['number'] != "undefined"){
		$(":text").val(window.localStorage['number']);
	}
	$(":text").keyup(function(e){
		// 檢查
		var number = $(":text").val(), yourList = [];
		$("form>span").empty();
		if(number.length > 0){
			if($.inArray(number.length, lengthList) >= 0){
				$(supportList).each(function(i, v){
					if(number.length == v.length){
						yourList.push({
							url : v.url + number,
							title : v.title
						});
					}
				});
				if(yourList.length == 1){
					// 唯一可能
					$("form>span").html("<input type='hidden' id='type' value='" + yourList[0].url + "' />" + yourList[0].title);
				}else{
					// 多種可能，造下拉選單
					$("form>span").html(function(){
						var options = "";
						$(yourList).each(function(i, v){
							options += "<option value='" + v.url + "'>" + v.title + "</option>";
						});
						return "<select id='type'>" + options + "</select>";
					});
				}
			}
		}
	});
	$("form").submit(function(e){
		e.preventDefault();
        $(":text").triggerHandler("keyup");
		/*// these code should work in the future (currently not work on Chrome 25.0.1364.172 m)
		//ref: https://code.google.com/p/chromium/issues/detail?id=158004
		chrome.permissions.request({origins: ["http://google.com"]}, function(granted) {
			// The callback argument will be true if the user granted the permissions.
			if (granted) {
				console.log("yes");
			} else {
				console.log("no");
			}
		});
		*/
		if($("#type").size() > 0){
			url = $("#type").val();
		}else{
			$("#content").text("郵局郵件號碼為14或20碼、宅急便託運單號碼為10或12碼、宅配通為12碼。");
			$(":text").focus();
			return false;
		}
		if($("body>a").size()){
			$("body>a").attr("href", url);
		}else{
			$("#content").before("<a href='" + url + "'>開啟原網頁</a>").css("min-width", "290px");
		}
		$.ajax({
			url: url,
			dataType: "html",
			cache: false,
			beforeSend: function(){
				$("body").removeClass("result result-post");
				$("#content").text("LOADING");
			},
			success: function(result){
				if(result){
					$("body").addClass("result");
					switch(type){
						case "post":
							var start = result.indexOf("<!-- ##################主要內容################# BEGIN -->"),
							    end = result.indexOf("<!-- ##################主要內容################# END -->");
							result = process(result.substring(start, end));
							$("body").addClass("result-post");
							break;
						case "tcat":
							var start = result.indexOf("<table cellspacing=\"1\" cellpadding=\"2\" width=\"560\" border=\"0\">"),
							    end = start + result.substr(start).indexOf("</table>") + 8;
							result = linkremove(result.substring(start, end));
							break;
					}
					$("#content").html(result);
					window.localStorage['number'] = number;
				}else{
					$("#content").text("LOAD FAILED");
				}
			},
			error: function(xhr){
				$("#content").text("CONNECT ERROR");
				console.log(xhr);
			}
		});
		$("body>form>a").bind("click", function(){
			chrome.tabs.create({url: $(this).attr("href")});
		});
	});
});

// 過濾惱人的 <script>
function process(result){
	//var patt = /<script>str_trim\('.*?'\);?<\/script>/g;
	var patt1 = "<script>.+?\\('",
		patt2 = "'\\);?<\\/script>", // ');</script>
		patt = new RegExp(patt1 + ".*?" + patt2, "g"),
		matches = result.match(patt),
		splities = result.split(patt), func;
	if(matches != null){
		for(var i in matches){
			func = matches[i].substr(8, 4);
			matches[i] = matches[i].replace(new RegExp(patt1), "").replace(new RegExp(patt2), "");
			switch(func){
				case "str_":
					matches[i] = str_trim(matches[i]);
					break;
				case "disp":
					matches[i] = dispFormatDateTimeEng(matches[i]);
					break;
			}
			splities[i] = splities[i] + matches[i];
		}
		return splities.join("");
	}else
		return result;
}
// 偉大的去空白
function str_trim(text){
	return text.replace(/　| /g, "");
}
// dispFormatDateTimeEng('20130201070616')
function dispFormatDateTimeEng(text){
	return text.substr(0,4) + "/" + text.substr(4,2) + "/" + text.substr(6,2)+' '+ text.substr(8,2)+':'+ text.substr(10,2);
}
function linkremove(text){
	return text.replace(/href=/gi, "nohref=");
}
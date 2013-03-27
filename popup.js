$(document).ready(function(){
	var supportList = [], lengthList = [];
	$.ajax({
		url : "supportList.json",
		dataType : "json",
		success: function(data){
			$.each(data, function(i, v){
				$.each(v.length, function(ii, value){
					supportList.push({
						length : value,
						type : v.type,
						title : v.title,
						url : v.url,
						js : v.js
					});
					if($.inArray(value, lengthList) < 0){
						lengthList.push(value);
					}
				});
			});
			// load last session if exists
			if(typeof window.localStorage['number'] != "undefined"){
				$(":text").val(window.localStorage['number']).triggerHandler("keyup");
				$("#type").val(window.localStorage['type']);
			}
		},
		error : function(){
			$("body").text("Cannot load file supportList.json, try to reinstall.");
		}
	});
	$(":text").keyup(function(e){
		// check and determine
		var number = $(":text").val(), yourList = [], yourListStr = "";
		if(number.length == 0 || $.inArray(number.length, lengthList) < 0){
			$("form>span").empty().data("yourListStr", "");
		}else{
			$(supportList).each(function(i, v){
				if(number.length == v.length){
					yourList.push({
						index : i,
						title : v.title
					});
					yourListStr += v.type;
				}
			});
			// change option(s) only if if there is any changes
			if($("form>span").data("yourListStr") != yourListStr){
				if(yourList.length == 1){
					// 唯一可能
					$("form>span").html("<input type='hidden' id='type' value='" + yourList[0].index + "' />" + yourList[0].title);
				}else{
					// 多種可能，造下拉選單
					$("form>span").html(function(){
						var options = "";
						$(yourList).each(function(i, v){
							options += "<option value='" + v.index + "'>" + v.title + "</option>";
						});
						return "<select id='type'>" + options + "</select>";
					});
				}
				$("form>span").data("yourListStr", yourListStr);
			}
		}
	});
	$("form").submit(function(e){
		e.preventDefault();
		$(":text").triggerHandler("keyup");
		if($("#type").size() > 0){
			var number = $(":text").val(),
				index = $("#type").val() * 1,
				url = supportList[index].url + number,
				loadJS = supportList[index].js, loadedJS = 0,
				loadQuery = function(){
					if(++loadedJS == loadJS.length){
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
									window.localStorage['number'] = number;
									window.localStorage['type'] = index;
									$("body").addClass("result");
									$("#content").html(process(result));
								}else{
									$("#content").text("LOAD FAILED");
								}
							},
							error: function(xhr){
								$("#content").text("CONNECT ERROR");
								console.log(xhr);
							}
						});
					}
				};
			if($("body>form>a").size()){
				$("body>form>a").attr("href", url);
			}else{
				$("body>form").append("<a href='" + url + "'>開啟原網頁</a>").css("min-width", "290px");
			}
			// Load *.js which contain "process" function first
			$.each(loadJS, function(i, v){
				loadScript("supportFiles/" + v, loadQuery);
			});
		}else{
			// Incorrect input
			$("#content").text("郵局郵件號碼為14或20碼、宅急便託運單號碼為10或12碼、宅配通為12碼。");
			$("body>a").remove();
			$(":text").focus();
		}
	});

	$("body>form").on("click", "a", function(){
		chrome.tabs.create({url: $(this).attr("href")});
	});
	function loadScript(url, callback){
		var script = document.createElement("script")
		script.type = "text/javascript";

		script.onload = function(){
			callback();
		};

		script.src = url;
		document.getElementsByTagName("head")[0].appendChild(script);
	}
});

// default process function. Would be replaced by supportFiles/*.js
function process(result){
	return result;
}
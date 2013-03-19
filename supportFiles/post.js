function process(result){
	var start = result.indexOf("<!-- ##################主要內容################# BEGIN -->"),
		end = result.indexOf("<!-- ##################主要內容################# END -->");
	$("body").addClass("result-post");
	return filter(result.substring(start, end));
}
// 過濾惱人的 <script>
function filter(result){
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
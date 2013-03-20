function process(result){
	var start = result.indexOf("<table width=\"100%\" border=\"0\" cellspacing=\"1\" cellpadding=\"1\">"),
		end = start + result.substr(start).indexOf("</table>") + 8;
	return result.substring(start, end);
}
function process(result){
	var start = result.indexOf("<table cellspacing=\"1\" cellpadding=\"2\" width=\"560\" border=\"0\">"),
		end = start + result.substr(start).indexOf("</table>") + 8;
	return linkremove(result.substring(start, end));
}
function linkremove(text){
	return text.replace(/href=/gi, "nohref=");
}
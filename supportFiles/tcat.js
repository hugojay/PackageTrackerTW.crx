function process(result){
	var start = result.indexOf("<table cellpadding=\"0\" cellspacing=\"0\" class=\"tablelist\">"),
		end = start + result.substr(start).indexOf("</table>") + 8;
	return linkremove(result.substring(start, end));
}
function linkremove(text){
	return text.replace(/href=/gi, "nohref=");
}
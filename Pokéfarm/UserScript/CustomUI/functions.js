function getPFQPage(conditional) {
  var url = window.location.href, start = url.indexOf('.com/') + 5, page;
  switch (conditional === undefined) {
    case true:
	    switch (url.indexOf('/', start)) {
	      case -1:
	  return url.substring(start, url.length);
	 default:
	  return url.substring(start, url.indexOf('/', start));
	} break;
   case false:
	switch (url.indexOf('/', start)) {
	 case -1:
	  return (url.substring(start, url.length) === conditional);
	 default:
	  return (url.substring(start, url.indexOf('/', start)) === conditional);
	} break;
 }
}

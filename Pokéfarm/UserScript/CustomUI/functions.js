function getPFQPage(conditional) {
	var url = window.location.href, start = url.indexOf('.com/') + 5, page;
		switch (conditional === undefined) {
			case true:
				switch (url.indexOf('/', start)) {
					case -1:
						return url.substring(start, url.length);
					default:
						return url.substring(start, url.indexOf('/', start));
				}
				break;
			case false:
				switch (url.indexOf('/', start)) {
					case -1:
						return (url.substring(start, url.length) === conditional);
					default:
						return (url.substring(start, url.indexOf('/', start)) === conditional);
				}
				break;
		}
}

function insertHubButton() {
	var loc = document.querySelector('#head-avatar').querySelector('.tooltip_content');
	var index = loc.childElementCount - 2;
	
	var button = document.createElement('a');
	button.setAttribute('href', '#');
	button.innerText = 'CustomUI Hub';
	button.onclick = function() {
		var html = GM_getResourceText('CustomUIHubHTML');
  		document.querySelector('#core').classList.add('scrolllock');
  		document.querySelector('body').insertAdjacentHTML('beforeend', html);
	}
	
	loc.insertBefore(button, loc.childNodes[index]);
	
	var isLoaded = setInterval(function() {
		if (document.querySelector('#close')) {
			document.querySelector('#close').onclick = function() {
				document.querySelector('#core').classList.remove('scrolllock');
			}
			clearInterval(isLoaded);
		}
	}, 500);
	
	/*var isLoaded = setInterval(function() {
		if (document.querySelector('#close')) {
			document.querySelector('#close').onclick = function() {
				document.querySelector('#core').classList.remove('scrolllock');	
			}
			clearInt(isLoaded);
		}
	}, 500);
	
	function clearInt(interval) {
		
	}*/
}

function Dialog(title, element) {
	Dialog.disableScroll();
	var d = this;
	var a = $('<div></div>');
	a.addClass('dialog');
	var b = $('<div></div>');
	b.appendTo(a);
	var c = $('<div></div>');
	c.appendTo(b);
	b = $('<div></div>');
	b.appendTo(c);
	$('<h3></h3>').text(title).appendTo(b);
	var e = $('<div></div>');
	e.html(element).appendTo(b);

	var f = $('<button></button>').attr('type', 'button');
	f.text('Cancel');
	f.click(function() { $('.dialog').remove(); Dialog.enableScroll(); });
	f.css({'float': 'right', 'margin': '0 0 0 8px'});
	f.attr('data-cancelbutton', '1');
	f.appendTo(e);

	d.dialog = a;
	a.appendTo(document.body);
}

Dialog.disableScroll = function() {
	var d = $("#core");
	$(".dialog").css("position", "fixed");
	if (!d.hasClass("scrolllock")) {
		var a = Math.min(d[0].scrollHeight - window.innerHeight, document.documentElement.scrollTop || document.body.scrollTop);
		d.addClass("scrolllock");
		d.css("top", -a + "px");
		d.data("scroll", a);
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	}
};

Dialog.enableScroll = function() {
  var d = $(".dialog");
	if (d.length) {
		d.eq(d.length - 1).css("position", "");
	} else {
		d = $("#core");
		var a = d.data("scroll") || 0;
		d.removeClass("scrolllock");
		document.body.scrollTop = document.documentElement.scrollTop = a;
	}
};

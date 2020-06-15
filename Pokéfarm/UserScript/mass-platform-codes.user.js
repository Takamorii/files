// ==UserScript==
// @name         Mass Platform Codes
// @namespace    http://www.pokefarm.com/user/Hayashi_Rin
// @downloadURL  https://github.com/Takamorii/files/raw/master/Pok%C3%A9farm/UserScript/mass-platform-codes.user.js
// @version      1.0
// @description  Will add one later.
// @author       Hayashi Rin
// @match        https://pokefarm.com/fields
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @updateURL    https://github.com/Takamorii/files/raw/master/Pok%C3%A9farm/UserScript/mass-platform-codes.user.js
// @connect      github.com
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
/* eslint-disable */

var $ = window.jQuery;
waitForKeyElements('[data-menu="bulkmove"]', activateUserScript);

function activateUserScript() {
 var private = $('#field_field[data-mode="private"]');
 var codestuffs = $('<div id="message"></div><button id="reg">Regular</button><button id="shi">Shiny</button><button id="alb">Albino</button><button id="mel">Melanistic</button><button id="del">Delta</button>');
 GM_addStyle('#message { min-width: 600px; min-height: 24px; padding-top: 2px; }');
 if(private) {
  var data = getMonData();
  var button = $('<label hr-data-menu="bulkdisplay"></label').text('Mass Display Codes');
  button.click(function() {
   Dialog('Mass Display Codes', codestuffs)
   $('#message').text('Click on a button to copy the corresponding platform codes to the clipboard!');
   $('#reg').click(function() { copyCodes('regular', data['regular']) } );
   $('#shi').click(function() { copyCodes('shiny', data['shiny']) } );
   $('#alb').click(function() { copyCodes('albino', data['albino']) } );
   $('#mel').click(function() { copyCodes('melanistic', data['melan']) } );
   $('#del').click(function() { copyCodes('delta', data['delta']) } );
  });
  private.find('[data-menu="bulkmove"]').before(button);
 } else {
  return;
 }

 function copyCodes(message, data) {
  if(data.length === 0) {
   $('#message').text('There are no ' + message + ' Pokémon to display!');
  } else {
   var selection = '';
   for(var i = 0; i < data.length; i++) {
	selection += '[url=https://pfq.link/?' + data[i] + '][img]https://pfq.link/?' + data[i] + '=platform.png[/img][/url]';
   }
   $('#message').text('Copied the platforms of all ' + message + ' Pokémon to the clipboard!');
   var select = document.createElement('input');
   select.setAttribute('type', 'text');
   select.setAttribute('id', 'select');
   select.setAttribute('value', selection);
   $('body').append(select);
   select.select();
   document.execCommand("copy");
   select.remove();
  }
 }

 function addButtonFunc(selector, func) {
  console.log(func);
  $(selector).click(function() { func } );
 }

 function getMonData() {
  var mondata = new Map();
  var regular = [], shiny = [], albino = [], melan = [], delta = [];
  var fielddata = private.find('.fieldmontip');
  for(var i = 0; i < fielddata.length; i++) {
   var sel = fielddata[i];
   if($(sel).find('[title="[SHINY]"]')) {
	var mon = $(sel).find('[title="[SHINY]"]').closest('.tooltip_content').prev().attr('data-id');
	if(mon != undefined) { shiny.push(mon); continue; }
	else {
	 if($(sel).find('[title="[ALBINO]"]')) {
	  var mon = $(sel).find('[title="[ALBINO]"]').closest('.tooltip_content').prev().attr('data-id');
	  if(mon != undefined) { albino.push(mon); continue; }
	  else {
	   if($(sel).find('[title="[MELANISTIC]"]')) {
		var mon = $(sel).find('[title="[MELANISTIC]"]').closest('.tooltip_content').prev().attr('data-id');
		if(mon != undefined) { melan.push(mon); continue; }
		else {
		 if($(sel).find('[title="[DELTA]"]')) {
		  var mon = $(sel).find('[title="[DELTA]"]').closest('.tooltip_content').prev().attr('data-id');
		  if(mon != undefined) { shiny.push(mon); continue; }
		  else {
		   regular.push(mon);
		  }
		  var sel = null;
		 }
		}
		var sel = null;
	   }
	  }
	  var sel = null;
	 }
	}
	var sel = null;
   }
  }
  mondata['regular'] = regular;
  mondata['shiny'] = shiny;
  mondata['albino'] = albino;
  mondata['melan'] = melan;
  mondata['delta'] = delta;

  return mondata;
 }
};

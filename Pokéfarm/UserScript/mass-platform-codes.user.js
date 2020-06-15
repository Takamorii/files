// ==UserScript==
// @name         Mass Platform Codes
// @namespace    http://www.pokefarm.com/user/Hayashi_Rin
// @downloadURL  
// @version      0.1
// @description  Will add one later.
// @author       Hayashi Rin
// @match        https://pokefarm.com/fields
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @updateURL    
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
 if(private) {
  var button = $('<label hr-data-menu="bulkdisplay"></label').text('Mass Display Codes');
  button.click(function() { copyCodes(); });
  private.find('[data-menu="bulkmove"]').before(button);
 } else {
  return;
 }

 function copyCodes() {
  if($('.copied').length) {
   return;
  } else {
   var select = document.createElement('input');
   select.setAttribute('type', 'text');
   select.setAttribute('id', 'select');
   select.setAttribute('value', getMonData());
   console.log(select);
   $('body').append(select);
   select.select();
   document.execCommand("copy");
   select.remove();
   resetText(button, $('<span class="copied">Copied to Clipboard!</span>'), 'Mass Display Codes');
  }
 }

 function getMonData() {
  var mons = private.find('.fieldmon');
  var code = '';
  for(var i = 0; i < mons.length; i++) {
   var id = mons.eq(i).attr('data-id');
   code += '[url=https://pfq.link/?' + id + '][img]https://pfq.link/?' + id + '=platform.png[/img][/url]';
  }
  return code;
 }

 function resetText(parent, span, text) {
  button.text('').append(span);
  span.fadeOut(3000);
  setTimeout(function() {
   parent.text(text);
  }, 3000);
 }
};

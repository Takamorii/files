// ==UserScript==
// @name         Shiny Charm Reminder
// @namespace    http://www.pokefarm.com/user/Hayashi_Rin
// @downloadURL  https://github.com/Takamorii/files/raw/master/Pok%C3%A9farm/UserScript/shiny-charm-reminder.user.js
// @version      1.01
// @description  Will add one later.
// @author       Hayashi Rin
// @match        https://pokefarm.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://github.com/Takamorii/files/raw/master/Pok%C3%A9farm/UserScript/MassDisplay/Functions.js
// @updateURL    https://github.com/Takamorii/files/raw/master/Pok%C3%A9farm/UserScript/shiny-charm-reminder.user.js
// @connect      github.com
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
/* eslint-disable */

var $ = window.jQuery;
waitForKeyElements('[title="Shiny Charm"]', activateUserScript);

function activateUserScript() {
 if($('[title="Shiny Charm"]').text().includes("14h")) {
  var today = new Date();
  checkNewDay(today.getUTCDate());
 }
};

function checkNewDay(today) {
 var date = new Date();
 if(GM_getValue('SCR-DATE') == null) {
  GM_setValue('SCR-DATE', date.getUTCDate());
 }

 var yesterday = GM_getValue('SCR-DATE');
 if(yesterday === today) {
  return;
 } else {
  if(yesterday < today || today === 1) {
   GM_setValue('SCR-DATE', today);
   RemindMe();
  }
 }
}

function RemindMe() {
 var reminder = $('<p id="reminder">Your Shiny Charm needs activated!</p>'); reminder.css('text-align', 'center');
 Dialog("Shiny Charm Reminder", reminder);
 var goto = $('<button type="button" style="float: left; margin: 0px 8px 0px 0px;">Go To</button>'); goto.click(function() { window.location.href = 'https://pokefarm.com/shinyhunt'; });
 $('#reminder').after(goto);
}

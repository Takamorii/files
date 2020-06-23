// ==UserScript==
// @name         Shiny Charm Reminder
// @namespace    http://www.pokefarm.com/user/Hayashi_Rin
// @downloadURL  https://github.com/Takamorii/files/raw/master/Pok%C3%A9farm/UserScript/shiny-charm-reminder.user.js
// @version      1.1_0
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
 var today = new Date();
 if(GM_getValue('SCR-DATE') === null) {
  console.log('value SCR-DATE created');
  GM_setValue('SCR-DATE', [false, today.getUTCDate()]);
 } else if(GM_getValue('SCR-DATE')[1] !== today.getUTCDate()) {
  console.log('value SCR-DATE set to new day');
  var day = [false, today.getUTCDate()];
  GM_setValue('SCR-DATE', day);
 }

 if($('[title="Shiny Charm"]').text().includes("OFF") && GM_getValue('SCR-DATE')[0] === false) {
  console.log('value SCR-DATE flagged as false');
  checkNewDay(today.getUTCDate());
 } else if(GM_getValue('SCR-DATE')[0] === true) {
  console.log('value SCR-DATE flagged as true, terminating');
 }
};

function checkNewDay(today) {
 console.log('running function checkNewDay(today)');
 var day = GM_getValue('SCR-DATE');
 var yesterday = day[1];
 console.log('value yesterday = ' + yesterday + '\n' + 'value today = ' + today);
 if(yesterday <= today || today === 1) {
  RemindMe();

  day[0] = true;
  GM_setValue('SCR-DATE', day);
  console.log('value SCR-DATE flagged to true');
 }
}

function RemindMe() {
 console.log('running function RemindMe()');
 var reminder = $('<p id="reminder">Your Shiny Charm needs activated!</p>'); reminder.css('text-align', 'center');
 Dialog("Shiny Charm Reminder", reminder);
 var goto = $('<button type="button" style="float: left; margin: 0px 8px 0px 0px;">Go To</button>'); goto.click(function() { window.location.href = 'https://pokefarm.com/shinyhunt'; });
 $('#reminder').after(goto);
}

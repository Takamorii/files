// ==UserScript==
// @name         Collect Dex Images
// @namespace    http://www.pokefarm.com/user/Hayashi_Rin
// @version      1.0
// @description  Creates a button on the dex page to grab all 'mon images and create an array
// @author       Hayashi Rin
// @match        https://pokefarm.com/dex
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @connect      github.com
// ==/UserScript==
/* eslint-env jquery, es6 */
/* global waitForKeyElements */

const specialForms = ['Unown', 'Oricorio', 'Burmy', 'Wormadam'];
waitForKeyElements('#content', runScript);

function runScript() {
    const btnCSS = { 'vertical-align': 'middle', 'margin-left': '20px' };
	createButton('Index', '#content > h1', async () => {
        const regions = await indexRegions();
        const data = await indexImages(regions);
        saveFile(JSON.stringify(data, undefined, 2), 'Dex Entries.txt', 'text/plain');
    }, btnCSS);
}

function createButton(l, e, f, c) {
	const a = document.createElement('button');
    a.append(document.createTextNode(l));
    a.onclick = function() { f() };

	const s = Object.keys(c);
	s.forEach(function(item, index) {
		$(a).css(item, c[item]);
	});

	$(e).append(a);
}

async function indexRegions() {
    let a = {};
    const c = Array.from($('[id*="region-"]'));
    let open = new Promise(resolve => {
        c.forEach((item) => { $(item).find('h3').click();} );
        setTimeout(() => { resolve("done!") }, 1000);
    });
    let result = await open.then(result => {
        c.forEach((item, index) => { var d = $(item); a[index] = { 'name': d.find('h3').text(), 'id': d.attr('id'), 'count': Array.from(item.querySelector('ol').querySelectorAll('li')).length }; });
    });
    return new Promise(resolve => { resolve(a) });
}

async function indexImages(regions) {
    let a = {};
    let openDexEntry = new Promise(resolve => {
        let data = {};
        for(let x = 0; x < Object.keys(regions).length; x++) {
            const selector = document.querySelector('#'+regions[x].id + ' ol.region-entries');
            data[x] = selector.querySelectorAll('li.entry > a.ecnt');
        }
        resolve(data);
    });
    let result = await openDexEntry;
    let data = await getData(result);
    return new Promise(resolve => { resolve(data) });
}

async function getData(object) {
    const regions = Object.entries(object);
    let data = {};

    let total = 0, remaining, completed;
    regions.forEach((item) => { total += item[1].length });
    remaining = total; completed = 0;

    console.log('Total \'mons: ' + total);

    const start = Date.now();
    let curEst = null;
    for (const region of regions) {
        console.log('Indexing Dex entry data for ' + $(region[1]).parent().parent().parent().find('h3').text() + ' region.');
        data[$(region[1]).parent().parent().parent().find('h3').text()] = await indexData(region, region[1].length);

        console.log('Time elapsed: ' + Math.floor((Date.now() - start) / 60000) + 'm ' + Math.floor(((Date.now() - start) / 1000) % 60) + 's');
        completed += region[1].length;
        const average = Math.floor(((Date.now() - start) / 1000) / completed);
        remaining -= region[1].length;

        curEst = (Math.floor((remaining * average) / 60)) + 'm ' + ((remaining * average) % 60) + 's';
        console.log('Estimated time remaining: ' + curEst);
    }
    console.log('Done collecting entry data!', '\nTime elapsed: ' + Math.floor((Date.now() - start) / 60000) + 'm ' + Math.floor(((Date.now() - start) / 1000) % 60) + 's');
    return new Promise(resolve => { resolve(data) });
}

async function indexData(selectors, count) {
    const elements = selectors[1];
    const timeStart = Date.now();
    let data = {};
    for (let x = 0; x < count; x++) {
        elements[x].click();
        await checkLoaded('element', '.formeregistration > ul > li', 500);

        if($('.formeregistration > ul > li').length > 1 && $('.formeregistration > ul > li:nth-of-type(1) > a').length > 0) {
            let title = $('#dexinfo > h3:first-of-type').text().slice($('#dexinfo > h3:first-of-type').text().indexOf(':') + 2);
            if(title.includes('[') && $('.formeregistration > ul > li').length > 1) {
                 console.log('Incorrect form for ' + title.slice(0, title.indexOf(' [')) + ', correcting.');
            } else {
                 console.log('Incorrect form for ' + title + ', correcting.');
            }
            document.querySelector('.formeregistration > ul > li:nth-of-type(1) > a').click();
        }

        if($('.eggspr img').length > 0) { await checkLoaded('img', '.eggspr img', 500) }
        await checkLoaded('css', '.pokemon', 500);
        await checkLoaded('img', '.formeregistration li:last-of-type > span:first-of-type > img', 500);
        const forms = $('.formeregistration > ul > li').length;

        let name = new Promise((resolve) => {
            let title = $('#dexinfo > h3:first-of-type').text().slice($('#dexinfo > h3:first-of-type').text().indexOf(':') + 2);
            if(title.includes('[') && $('.formeregistration > ul > li').length > 1) {
                resolve(['name', title.slice(0, title.indexOf(' ['))]);
            } else {
                resolve(['name', title]);
            }
        });
        let egg = new Promise((resolve) => {
            if($('.eggspr img').length > 0) {
                resolve(['egg', $('.eggspr img').attr('src').slice(0, $('.eggspr img').attr('src').lastIndexOf('/'))]);
            } else {
                resolve(['egg', 'N/A']);
            }
        });
        let big = new Promise((resolve) => { resolve(['big', $('.pokemon').css('background-image').slice(5, $('.pokemon').css('background-image').lastIndexOf('/'))]) });
        let small = new Promise((resolve) => { resolve(['small', $('.formeregistration span > b').parent().prev().find('img').attr('src').slice(0, $('.formeregistration span > b').parent().prev().find('img').attr('src').lastIndexOf('/'))]) });
        let ifForms = new Promise((resolve) => {
            if($('.formeregistration > ul > li').length > 1) { resolve(getForms(forms)); }
            else { resolve('Done!'); }
        });

        await Promise.all([name, egg, big, small, ifForms]).then((result) => {
            data[result[0][1]] = {};
            if(Object.keys(result[4])[0] === 'forms') {
                data[result[0][1]].forms = result[4].forms;
            }
            for (let y = 0; y < result.length - 1; y++) {
                data[result[0][1]][result[y][0]] = result[y][1];
            }
            console.log('Collected data for: ' + result[0][1] + ' (' + (x + 1) + ' / ' + count + ')');
        });
        document.querySelector('#dexinfo button').click();
    }
    console.log('Collected data for the ' + $(selectors[1]).parent().parent().parent().find('h3').text() + ' region!', data);
    return new Promise(resolve => { resolve(data) });
}

async function getForms(forms) {
    let formData = {};
    formData.forms = {};
    let flag = false;
    for await (const a of specialForms) {
        let title = $('#dexinfo > h3:first-of-type').text().slice($('#dexinfo > h3:first-of-type').text().indexOf(':') + 2);
        if(title.includes('[') && title.slice(0, title.indexOf(' [')) === a) {
            flag = true;
        }
    }
    if(flag) {
        for(let y = 1; y <= (forms + 1); y++) {
            if(y === forms + 1) {
                return formData;
            } else if(y === 1) {
                await getForm(y, true).then((result) => {
                    const name = $('.formeregistration span > b').text();
                    formData.forms[y] = result[name];
                });
            } else if(y !== 1){
                await getForm(y - 1, false).then((result) => {
                    const name = $('.formeregistration span > b').text();
                    formData.forms[y] = result[name];
                });
            }
        }
    } else {
        for(let y = 1; y <= forms; y++) {
            if(y === forms) {
                return formData;
            } else {
                await getForm(y, false).then((result) => {
                    const name = $('.formeregistration span > b').text();
                    formData.forms[y] = result[name];
                });
            }
        }
    }
}

async function getForm(forms, special) {
    if(special !== true) {
        Array.from(document.querySelectorAll('.formeregistration > ul > li'))[forms].querySelector('a').click();
    }

    if($('.eggspr img').length > 0) { await checkLoaded('img', '.eggspr img', 500) }
    await checkLoaded('css', '.pokemon', 500);
    await checkLoaded('img', '.formeregistration li:last-of-type > span:first-of-type > img', 500);

    let formData = {};
    let form = new Promise((resolve) => { resolve(['form', $('.formeregistration span > b').text()]) });
    let big = new Promise((resolve) => { resolve(['big', $('.pokemon').css('background-image').slice(5, $('.pokemon').css('background-image').lastIndexOf('/'))]) });
    let small = new Promise((resolve) => { resolve(['small', $('.formeregistration span > b').parent().prev().find('img').attr('src').slice(0, $('.formeregistration span > b').parent().prev().find('img').attr('src').lastIndexOf('/'))]) });
    await Promise.all([form, big, small]).then((result) => {
        formData[result[0][1]] = {};
        for(let x = 0; x < result.length; x++) { formData[result[0][1]][result[x][0]] = result[x][1]; }
    });
    return formData;
}

async function checkLoaded(type, selector, time) {
    switch(type) {
        case 'css':
            if ($(selector).css('background-image') != null) {
                await delay(time);
                return new Promise(resolve => resolve('Exists!'));
            } else {
                await delay(time);
                await checkLoaded(type, selector, time).then(result => { return result });
            }
            break;
        case 'img':
            if($(selector).attr('src') != null) {
                await delay(time);
                return new Promise(resolve => resolve('Exists!'));
            } else {
                await delay(time);
                await checkLoaded(type, selector, time).then(result => { return result });
            }
            break;
        case 'element':
            if($(selector).length > 0) {
                await delay(time);
                return new Promise(resolve => resolve('Exists!'));
            } else {
                await delay(time);
                await checkLoaded(type, selector, time).then(result => { return result });
            }
            break;
        default:
            return new Promise((resolve, reject) => { reject('Not a proper type.') });
            break;
    }
}

function saveFile(data, filename, type) {
    const file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) { window.navigator.msSaveOrOpenBlob(file, filename); }
    else {
        let a = document.createElement("a"), url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function delay(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

const cheerio = require('cheerio');
const axios = require('axios').default;
const search = require('./playerSearch')
let URL = 'http://fbref.com'

async function getPlayerInfo(playerName, regexString) {
    let playerURL = URL + await search(playerName)
    let html = (await axios.get(playerURL)).data
    let $ = cheerio.load(html)
    console.log($('title').text())
}

getPlayerInfo('Lionel Messi', null)
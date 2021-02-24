const cheerio = require('cheerio');
const axios = require('axios').default;
let URL = 'https://fbref.com'
let indexURL = 'https://fbref.com/en/players/'
async function search(playerName) {
    let html = (await axios.get(indexURL)).data
    let playerPage
    let $ = cheerio.load(html)
    let tags = []
    $('.page_index > li> div').children('a').each((index, element) => {
        tags.push($(element))
    })
    let lastName = playerName.split(" ").length === 1 ? playerName.substring(0, 2) : playerName.split(" ")[1].substring(0, 2)
    tags.map(t => {
        if ($(t).text() === lastName) {
            playerPage = URL + $(t).attr('href')
        }
    })
    if (playerPage) {
        try {
            let playerData = (await axios.get(playerPage)).data
            let p = cheerio.load(playerData)
            let allPlayers = []
            p('div.section_content > p').children('a').each((index, child) => {
                allPlayers.push(child)
            })
            let playerHref
            allPlayers.map(pl => {
                if (p(pl).text() === playerName) {
                    playerHref = p(pl).attr('href')
                }
            })
            return playerHref || 'No player'
        } catch (error) {
            return 'An error occurred'
        }
    } else {
        return ('No player');
    }
    // console.log(playerName.split(" "))
}


module.exports = search
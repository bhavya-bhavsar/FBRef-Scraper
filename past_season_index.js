const axios = require('axios').default
const cheerio = require('cheerio')
let URL = 'https://fbref.com/en/comps/'
let currSeasonStandard = /<!--\n*\s*<div class="table_container" id="div_stats_standard_squads">.*?-->/gs
let currSeasonKeeperStandard = /<!--\n*\s*<div class="table_container" id="div_stats_keeper_squads">.*?-->/gs


async function past_season_index() {
    let seasonsIndex = {}
    let html = await (await axios.get(URL + '9/history')).data
    const $ = cheerio.load(html)
    $('tbody>tr').children('th').each((index, element) => {
        seasonsIndex[$(element).text()] = $(element).children('a').attr('href')
    })
    return seasonsIndex

}

// past_season_index().then(res => {
//         console.log(res)
//     })
//     .catch(err => {
//         console.log(err)
//     })

module.exports = past_season_index
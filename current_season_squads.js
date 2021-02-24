const axios = require('axios').default
const cheerio = require('cheerio')
let URL = 'https://fbref.com/en/'
let currSeasonStandard = /<!--\n*\s*<div class="table_container" id="div_stats_standard_squads">.*?-->/gs
let currSeasonKeeperStandard = /<!--\n*\s*<div class="table_container" id="div_stats_keeper_squads">.*?-->/gs


async function curr_season_data(regexString) {
    let teamsArr = {}
        //Premier League
    let html = await axios.get(URL + 'comps/9')
    html = html.data
        // let data = await regexString.(html)
    let data = html.match(regexString)[0]
    data = data.slice(4, -3)
    let $ = cheerio.load(data)
    $('tbody>tr.side-for').children('th').each((idx, child) => {
        teamsArr[$(child).text()] = {}
        $(child).siblings('td').each((index, element) => {
            teamsArr[$(child).text()][$(element).attr('data-stat')] = $(element).text()
        })
    })
    return teamsArr
}

curr_season_data(currSeasonKeeperStandard).then(res => {
        console.log(res)
    })
    .catch(err => console.error(err))
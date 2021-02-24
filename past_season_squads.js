const axios = require('axios').default
const cheerio = require('cheerio')
const psi = require('./past_season_index')
const fs = require('file-system')
let URL = 'https://fbref.com'
let squadStd = /<!--\n*\s*<div class="table_container" id="div_stats_standard_squads">.*?-->/gs
let keeperStd = /<!--\n*\s*<div class="table_container" id="div_stats_keeper_squads">.*?-->/gs
let keeperAdv = /<!--\n*\s*<div class="table_container" id="div_stats_keeper_adv_squads">.*?-->/gs
let squadShoot = /<!--\n*\s*<div class="table_container" id="div_stats_shooting_squads">.*?-->/gs
let squadPass = /<!--\n*\s*<div class="table_container" id="div_stats_passing_squads">.*?-->/gs
let squadPassTypes = /<!--\n*\s*<div class="table_container" id="div_stats_passing_types_squads">.*?-->/gs
let squadGCA = /<!--\n*\s*<div class="table_container" id="div_stats_gca_squads">.*?-->/gs
let squadDef = /<!--\n*\s*<div class="table_container" id="div_stats_defense_squads">.*?-->/gs
let squadPossession = /<!--\n*\s*<div class="table_container" id="div_stats_possession_squads">.*?-->/gs
let squadPlayTime = /<!--\n*\s*<div class="table_container" id="div_stats_playing_time_squads">.*?-->/gs
let squadMisc = /<!--\n*\s*<div class="table_container" id="div_stats_misc_squads">.*?-->/gs


async function past_season_data(season, regexString) {
    let index = await psi()
    let teamsArr = []
    URL = URL + index[season]
    let html = (await axios.get(URL)).data
    let data = html.match(regexString)[0]
    data = data.slice(4, -3)
    let $ = cheerio.load(data)
    $('tbody>tr.side-for').children('th').each((idx, child) => {
        teamsArr.push({})
        teamsArr[idx]['Team'] = $(child).text()
        $(child).siblings('td').each((index, element) => {
            teamsArr[idx][$(element).attr('data-stat')] = $(element).text()
        })

    })
    return teamsArr
}
let season = '2016-2017'
past_season_data(season, squadMisc).then(async res => {
        await fs.writeFile(`./data_${season}/squadMisc.json`, JSON.stringify(res))
        console.log('Done')
    })
    .catch(err => console.error(err))
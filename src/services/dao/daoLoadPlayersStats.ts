import { dbConnectionService } from "../dbConnectionService";
import { apiPaths } from "../../../config/apiPaths";
import { configs } from "../../../config/configs";
import { createLogger } from "../../utils/logger";
import { LogLevel } from "../../utils/logLevel";

import * as Player from "../../models/playerInfoModel/playerInfos";

var httpTransport = require('https');
var btoa = require('btoa');
var util = require('util');

const MIN_VALUE = -100;

let logger = createLogger("daoLoadPlayersStats");

export interface IDaoPlayersStats {
    /**
     * Call API to get all stats of all nhl players
     * We load one time the players stats and save it in two different
     * collection of mondodb
     * 1. AllStatsPooling for the players who will be picked so we can remove from database
     * 2. AllStats[YEAR] for all players stats for a specific year
     */
    loadPlayersStats(year);
}

class DaoPlayersStats implements IDaoPlayersStats {
    loadPlayersStats(year: number) {
        // Define endpoint to get players stats for specific year from api www.mysportsfeed.com
        const httpOptions = {
            host: configs.nhlApi.httpOptions.host,
            path: apiPaths.Paths[year],
            //since we are listening on a custom port, we need to specify it by hand
            port: configs.nhlApi.httpOptions.port,
            //This is what changes the request to a POST request
            method: configs.nhlApi.httpOptions.method,
            headers: {"Authorization":"Basic " + btoa("frrocc" + ":" + "fr2618nk")}
        };
        httpOptions.headers['User-Agent'] = 'node ' + process.version;

        let responseBufs = [];
        let responseStr = '';
        var dataObj;

        const request = httpTransport.request(httpOptions, (res) => {
            res.on('data', (chunk) => {
                if (Buffer.isBuffer(chunk)) {
                    responseBufs.push(chunk);
                }
                else {
                    responseStr = responseStr + chunk;
                }
            }).on('end', () => {
                responseStr = responseBufs.length > 0 ? Buffer.concat(responseBufs).toString(configs.nhlApi.responseEncoding) : responseStr;

                dataObj = JSON.parse(responseStr);
                var keyCummPlayersStats = Object.keys(dataObj);

                var key = keyCummPlayersStats[0]; // All player stats are under this key
                var players = dataObj[key]; // here get value "by name" as it expected with objects

                // Store all players stats in database
                this.savePlayersStatsInDb(players, year);
            });
        })
        .setTimeout(0)
        .on('error', (error) => {
        });
        request.write("")
        request.end();
    }

    /**
     * This function will save the players stats in Mongodb
     * @param players: all players stat entry
     * @param year: year representing players stats
     */
    private savePlayersStatsInDb(players: any, year: number) {
        logger.debug("Saving players stats for year: " + year);
        let db = dbConnectionService.getConnection();

        // Verify db connection
        if (!db) {
            throw new Error("Can't establish connection to databse");
        }

        logger.debug(players);
        // Iterate over all players entry
        for (var i = 0; i < players.playerstatsentry.length; i++) {
            this.insertPlayerInfos(players.playerstatsentry[i], year);
        }
    }

    /**
     * Insert player goal stat in mongodb goals collection
     * @param player: entry in json structure to acces a player infos
     * @param year: year representing players stats
     */
    private insertPlayerInfos(player: any, year: number) {
        let plusMinus: number = Number.MIN_VALUE;
        if(player.stats.stats.hasOwnProperty('PlusMinus')) {
            plusMinus = parseInt(player.stats.stats.PlusMinus['#text']);
        }

        let hits: number = Number.MIN_VALUE;
        if(player.stats.stats.hasOwnProperty('Hits')) {
            hits = parseInt(player.stats.stats.Hits['#text']);
        }

        let shots: number = Number.MIN_VALUE;
        if (player.stats.stats.hasOwnProperty('Shots')) {
            shots = parseInt(player.stats.stats.Shots['#text']);
        }

        let shotPercentage: number = Number.MIN_VALUE;
        if (player.stats.stats.hasOwnProperty('ShotPercentage')) {
            shotPercentage = parseInt(player.stats.stats.ShotPercentage['#text']);
        }

        let faceoffs: number = Number.MIN_VALUE;
        if (player.stats.stats.hasOwnProperty('Faceoffs')) {
            faceoffs = parseInt(player.stats.stats.Faceoffs['#text']);
        }

        let faceoffPercent: number = Number.MIN_VALUE;
        if (player.stats.stats.hasOwnProperty('FaceoffPercent')) {
            faceoffPercent = parseFloat(player.stats.stats.FaceoffPercent['#text']);
        }

        let playerInfos: Player.PlayerInfo = {
            _id: player._id,
            player: {
                ID: player.player.ID,
                LastName: player.player.LastName,
                FirstName: player.player.FirstName,
                JerseyNumber: player.player.JerseyNumber,
                Position: player.player.Position,
                Height: player.player.Height,
                Weight: player.player.Weight,
                BirthDate: player.player.BirthDate,
                Age: player.player.Age,
                BirthCity: player.player.BirthCity,
                BirthCountry: player.player.BirthCountry,
                IsRookie: (player.player.IsRookie == "true"),
            },
            team: {
                ID: player.team.ID,
                City: player.team.City,
                Name: player.team.Name,
                Abbreviation: player.team.Abbreviation
            },
            stats: {
                gamesPlayed: parseInt(player.stats.GamesPlayed['#text']),
                stats: {
                    goals: parseInt(player.stats.stats.Goals['#text']),
                    assists: parseInt(player.stats.stats.Assists['#text']),
                    points: parseInt(player.stats.stats.Points['#text']),
                    hatTricks: parseInt(player.stats.stats.HatTricks['#text']),
                    plusMinus: plusMinus,
                    shots: shots,
                    shotPercentage: shotPercentage,
                    penalityMin: parseInt(player.stats.stats.PenaltyMinutes['#text']),
                    powerplayGoals: parseInt(player.stats.stats.PowerplayGoals['#text']),
                    powerplayAssists: parseInt(player.stats.stats.PowerplayAssists['#text']),
                    powerplayPoints: parseInt(player.stats.stats.PowerplayPoints['#text']),
                    shorthandedGoals: parseInt(player.stats.stats.ShorthandedGoals['#text']),
                    shorthandedAssists: parseInt(player.stats.stats.ShorthandedAssists['#text']),
                    shorthandedPoints: parseInt(player.stats.stats.ShorthandedPoints['#text']),
                    gameWinningGoals: parseInt(player.stats.stats.GameWinningGoals['#text']),
                    gameTyingGoals: parseInt(player.stats.stats.GameTyingGoals['#text']),
                    hits: hits,
                    faceoffs: faceoffs,
                    faceoffPercent: faceoffPercent,
                }
            },
            year: year,
        }

        let db = dbConnectionService.getConnection();
        // Verify connection
        if (!db) {
            throw new Error("Can't establish connection to database");
        }

        let currentYear: number = new Date().getFullYear();
        //Stats for AllStatsPooling need to be up to date
        if (year === currentYear) {
            db.collection("AllStatsPooling").insert(playerInfos, null, function (error, results) { 
            if (error) {
                throw error;
            }
        });
        }

        db.collection("AllStats" + year).insert(playerInfos, null, function (error, results) { 
            if (error) {
                throw error;
            }
        });

    }
}
export let daoPlayersStats: DaoPlayersStats = new DaoPlayersStats();

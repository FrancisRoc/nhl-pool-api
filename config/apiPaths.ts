/**
 * Api mysportsfeed.com paths for different years
 */
export class ApiPaths {

    private static _instance: ApiPaths;

    private constructor() {
    }

    /**
     * Singleton
     */
    static get instance(): ApiPaths {
        if (!this._instance) {
            this._instance = new ApiPaths();
        }
        return this._instance;
    }

    /**
     * Known environment types
     */
    get Paths() {
        return {
            "lenght": 4,
            "startingYear": 2014,
            "2014": "/api/feed/pull/nhl/2013-2014-regular/cumulative_player_stats.json",
            "2015": "/api/feed/pull/nhl/2014-2015-regular/cumulative_player_stats.json",
            "2016": "/api/feed/pull/nhl/2015-2016-regular/cumulative_player_stats.json",
            "2017": "/api/feed/pull/nhl/2016-2017-regular/cumulative_player_stats.json"
        };
    }

}

export let apiPaths: ApiPaths = ApiPaths.instance;
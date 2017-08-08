export interface IPlayer {
    ID: string;
    LastName: string;
    FirstName: string;
    JerseyNumber: number;
    Position: string;
    Height: string;
    Weight: string;
    BirthDate: string;
    Age: string;
    BirthCity: string;
    BirthCountry: string;
    IsRookie: boolean;
}

export interface ITeam {
    ID: string;
    City: string;
    Name: string;
    Abbreviation: string;
}

export interface IPlayerStats {
    goals: number;
    assists: number;
    points: number;
    hatTricks: number;
    plusMinus: number;
    shots: number;
    shotPercentage: number;
    penalityMin: number;
    powerplayGoals: number;
    powerplayAssists: number;
    powerplayPoints: number;
    shorthandedGoals: number;
    shorthandedAssists: number;
    shorthandedPoints: number;
    gameWinningGoals: number;
    gameTyingGoals: number;
    hits: number;
    faceoffs: number;
    faceoffPercent: number;
}

export interface IStats {
    gamesPlayed: number;
    stats: IPlayerStats;
}

export interface IPlayerInfo {
    _id: string;
    player: IPlayer;
    team: ITeam;
    stats: IStats;
    year: number;
}
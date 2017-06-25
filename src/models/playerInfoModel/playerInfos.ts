export interface Player {
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

export interface Team {
    ID: string;
    City: string;
    Name: string;
    Abbreviation: string;
}

export interface PlayerStats {
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

export interface Stats {
    gamesPlayed: number;
    stats: PlayerStats;
}

export interface PlayerInfo {
    _id: string;
    player: Player;
    team: Team;
    stats: Stats;
    year: number;
}
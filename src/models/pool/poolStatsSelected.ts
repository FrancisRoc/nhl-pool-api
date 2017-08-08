import { IImportantStats } from './importantStats';

export interface IPoolStatsSelected {
    _id: string;
    currentStat: string;
    importantStats: IImportantStats[];
}
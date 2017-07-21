import { IImportantStats } from './importantStats';

export interface PoolStatsSelected {
    _id: string;
    currentStat: string;
    importantStats: IImportantStats[];
}
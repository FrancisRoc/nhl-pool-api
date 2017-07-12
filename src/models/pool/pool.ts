import { IAccountInfos } from '../user/accountInfosInterface';

/**
 * A Pool.
 */
export interface IPool {
    _id: string;
    name: string;
    members: IAccountInfos[];
}
import { IAccountInfos } from '../user/accountInfosInterface';

/**
 * A Pool informations returned to frontend.
 */
export interface IPoolResponse {
    _id?: string;
    name: string;
    members: IAccountInfos[];
}

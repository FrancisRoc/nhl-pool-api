import { IUser } from '../user/user';

/**
 * A Pool informations returned to frontend.
 */
export interface IPoolResponse {
    _id?: string;
    name: string;
    members: IUser[];
}

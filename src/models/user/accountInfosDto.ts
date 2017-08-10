import { IUser } from "./user";

export class AccountInfosDto {
    private _id: string;
    private name: string;
    private username: string;

    constructor(accountInfos: IUser) {
        Object.assign(this, accountInfos);
    }

    setUserId(userId: string): void {
        this._id = userId;
    }

    getUserId(): string {
        return this._id;
    }
}

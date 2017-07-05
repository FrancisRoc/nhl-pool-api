import { IAccountInfos } from "./accountInfosInterface";

export class AccountInfosDto {
    private name: string;
    private nickname: string;
    private email: string;
    private _id: string;

    constructor(accountInfos: IAccountInfos) {
        Object.assign(this, accountInfos);
    }

    setUserId(userId: string): void {
        this._id = userId;
    }

    getUserId(): string {
        return this._id;
    }
}

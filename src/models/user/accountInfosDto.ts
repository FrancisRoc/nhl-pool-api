import { IAccountInfos } from "./accountInfosInterface";

export class AccountInfosDto {
    private name: string;
    private nickname: string;
    private email: string;
    private userId: number;

    constructor(accountInfos: IAccountInfos) {
        Object.apply(this, accountInfos);
    }

    setUserId(userId: number): void {
        this.userId = userId;
    }

    getUserId(): number {
        return this.userId;
    }
}

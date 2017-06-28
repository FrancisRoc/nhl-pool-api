import { IAccountInfos } from "./accountInfosInterface";

export class AccountInfosDto {
    private firstName: string;
    private lastName: string;
    private email: string;
    private dateOfBirth: Date;
    private userName: string;
    private password: string;
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
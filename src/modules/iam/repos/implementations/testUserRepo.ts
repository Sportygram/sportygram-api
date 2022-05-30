import { UserRepo } from "../interfaces";
import { UniqueEntityID } from "../../../../lib/domain/UniqueEntityID";
import { User } from "../../domain/user";
import { UserId } from "../../domain/userId";
import { UserEmail } from "../../domain/valueObjects/userEmail";

export class TestUserRepo implements UserRepo {
    public users: User[];

    /**
     *
     */
    constructor(users: User[]) {
        this.users = users;
    }
    getUserByUsername(_userName: string): Promise<User | undefined> {
        throw new Error("Method not implemented.");
    }
    getAllUsers(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }

    getUserByReferralCode(_referralCode: string): Promise<User | undefined> {
        // const found = !!~this.users.findIndex(
        // 	(user) => user.profile. === userEmail
        // );

        return Promise.resolve(this.users[0]);
    }

    exists(userId: string): Promise<boolean> {
        const found = !!~this.users.findIndex(
            (user) => user.userId.id.toString() === userId
        );

        return Promise.resolve(found);
    }

    getUserByUserId(userId: string): Promise<User | undefined> {
        const userEntityId: UserId = UserId.create(
            new UniqueEntityID(userId)
        ).getValue();
        const foundUser: User | undefined = this.users.find((user) =>
            user.userId.equals(userEntityId)
        );

        return Promise.resolve(foundUser);
    }

    getUserByEmail(userEmail: UserEmail | string): Promise<User | undefined> {
        const email: string =
            userEmail instanceof UserEmail ? userEmail.value : userEmail;
        const foundUser: User | undefined = this.users.find(
            (user) => user.email?.value === email
        );

        return Promise.resolve(foundUser);
    }

    async delete(user: User): Promise<void> {
        // TODO: Replace
        const exists = await this.exists(user.id.toString());

        if (!exists) {
            const newUser = User.create(user.props, new UniqueEntityID());

            this.users.push(newUser.getValue());
        }
    }

    async save(user: User): Promise<void> {
        // TODO: Replace
        const exists = await this.exists(user.id.toString());

        if (!exists) {
            const newUser = User.create(user.props, new UniqueEntityID());

            this.users.push(newUser.getValue());
        }
    }
}

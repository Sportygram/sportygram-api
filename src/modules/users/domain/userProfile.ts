import { AggregateRoot } from "../../../lib/domain/AggregateRoot";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { Result } from "../../../lib/core/Result";
import { UserId } from "./userId";
import { Guard } from "../../../lib/core/Guard";
import { GamesSummary, Settings } from "./valueObjects/settings";
import { UserProfileId } from "./userProfileId";
import { Phone } from "./valueObjects/phone";
import { teams } from "../../../infra/http/graphql/nexus/mocks/data";

interface UserProfileProps {
    userId: UserId;
    phone?: Phone;
    coinBalance: number;
    referralCount: number;
    favoriteTeam?: string | null;
    profileImageUrl?: string | null;
    onboarded: boolean;
    settings: Settings;
    gamesSummary: GamesSummary;
    createdAt?: Date;
    updatedAt?: Date;
}

export class UserProfile extends AggregateRoot<UserProfileProps> {
    get userProfileId(): UserProfileId {
        return UserProfileId.create(this._id).getValue();
    }
    get userId(): UserId {
        return this.props.userId;
    }
    get phone(): Phone | undefined {
        return this.props.phone;
    }
    get profileImageUrl(): string | undefined | null {
        return this.props.profileImageUrl;
    }
    get favoriteTeam(): string | undefined | null {
        return this.props.favoriteTeam;
    }
    get settings(): Settings {
        return this.props.settings;
    }
    get gamesSummary(): GamesSummary {
        return this.props.gamesSummary;
    }
    get onboarded(): boolean {
        return !!this.props.onboarded;
    }
    get coinBalance() {
        return this.props.coinBalance;
    }
    get referralCount() {
        return this.props.referralCount;
    }
    get createdAt(): Date {
        return this.props.createdAt || new Date();
    }
    get updatedAt(): Date {
        return this.props.updatedAt || new Date();
    }

    constructor(userProps: UserProfileProps, id?: UniqueEntityID) {
        super(userProps, id);
    }

    public updateOnboarded(onboarded: boolean): Result<void> {
        this.props.onboarded = onboarded;
        return Result.ok();
    }

    public updatePhone(phone: Phone): Result<void> {
        this.props.phone = phone;
        return Result.ok();
    }
    public updateProfileImageUrl(profileImageUrl: string): Result<void> {
        this.props.profileImageUrl = profileImageUrl;
        return Result.ok();
    }
    public updateFavoriteTeam(favoriteTeam: string): Result<void> {
        const isValidTeam = teams.find((team) => team.code === favoriteTeam);

        if (!isValidTeam) {
            return Result.fail("Favorite Team must be a valid team");
        }

        this.props.favoriteTeam = favoriteTeam;
        return Result.ok();
    }

    public static create(
        props: UserProfileProps,
        id?: UniqueEntityID
    ): Result<UserProfile> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.settings, argumentName: "settings" },
        ]);
        if (!guardResult.succeeded) {
            return Result.fail<UserProfile>(guardResult.message || "");
        }

        if (props.favoriteTeam) {
            const isValidTeam = teams.find(
                (team) => team.code === props.favoriteTeam
            );

            if (!isValidTeam) {
                return Result.fail("Favorite Team must be a valid team");
            }
        }

        const userProfile = new UserProfile(
            {
                ...props,
            },
            id
        );

        return Result.ok<UserProfile>(userProfile);
    }
}

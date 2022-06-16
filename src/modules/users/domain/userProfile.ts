import { AggregateRoot } from "../../../lib/domain/AggregateRoot";
import { UniqueEntityID } from "../../../lib/domain/UniqueEntityID";
import { Result } from "../../../lib/core/Result";
import { UserId } from "./userId";
import { Guard } from "../../../lib/core/Guard";
import { GamesSummary, Settings } from "./valueObjects/settings";
import { UserProfileId } from "./userProfileId";
import { teams } from "../../gaming/infra/database/seed/team.seed";
import { config } from "../../../lib/config";

interface UserProfileProps {
    userId: UserId;
    displayName?: string;
    coinBalance: number;
    referralCount: number;
    favoriteTeam?: string;
    profileColour?: string;
    profileImageUrl?: string;
    onboarded: boolean;
    settings: Settings;
    gamesSummary: GamesSummary;
    metadata: any;
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
    get displayName(): string | undefined {
        return this.props.displayName;
    }
    get profileColour(): string {
        return this.props.profileColour || config.huddle.defaultProfileColour;
    }
    get profileImageUrl(): string | undefined {
        return this.props.profileImageUrl;
    }
    get favoriteTeam(): string | undefined {
        return this.props.favoriteTeam;
    }
    get settings(): Settings {
        return this.props.settings;
    }
    get metadata() {
        return this.props.metadata;
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

    public updateDisplayName(displayName: string): Result<void> {
        this.props.displayName = displayName;
        return Result.ok();
    }
    public updateOnboarded(onboarded: boolean): Result<void> {
        this.props.onboarded = onboarded;
        return Result.ok();
    }

    public updateProfileColour(profileColour: string): Result<void> {
        this.props.profileColour = profileColour;
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

    public updateStreamData(streamData: any, token?: string): Result<void> {
        const current = this.metadata.stream || { data: {} };
        this.props.metadata.stream = {
            ...current,
            token: token || current?.token,
            data: { ...current.data, ...streamData },
        };
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

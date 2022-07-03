import { prisma } from "../../../../infra/database/prisma/client";
import logger from "../../../../lib/core/Logger";
import { Match } from "../../domain/match";
import {
    Athlete,
    Competition,
    FootballPeriod,
    MatchMetadata,
    MatchStatus,
    Team,
} from "../../domain/types";
import {
    getFixtures,
    getLiveFixture,
    getTeamPlayers,
} from "../../externalServices/apiFootball";
import {
    FixtureData,
    FixtureShortStatus,
    PlayerData,
} from "../../externalServices/apiFootball/apiFootball.types";
import { MatchDTO } from "../../useCases/createMatch/createMatchDTO";
import { FootballService } from "./footballService.types";

export class ApiFootballService implements FootballService {
    getCompetitions(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getTeams(): Promise<Team[]> {
        throw new Error("Method not implemented.");
    }

    async getTeamAthletes(team: Team): Promise<Athlete[]> {
        const afId = team.sources?.apiFootball?.id;
        let teamPlayers: PlayerData[] = [];

        let { response, paging } = await getTeamPlayers(afId, {});
        teamPlayers = [...teamPlayers, ...response];

        while (paging.current < paging.total) {
            const { response: newResp, paging: newPaging } =
                await getTeamPlayers(afId, {
                    season: 2022,
                    page: paging.current + 1,
                });
            paging = newPaging;
            teamPlayers = [...teamPlayers, ...newResp];
        }

        return teamPlayers.map(playerDataToAthleteMap);
    }

    async getFixtures(competition?: Competition): Promise<MatchDTO[]> {
        try {
            const afId = competition?.sources?.apiFootball?.id;
            const fixtures = await getFixtures({ league: afId });
            return await Promise.all(fixtures.map(fixtureDataToMatchDTOMap));
        } catch (error) {
            logger.info(`Error fetching fixtures from apiFootball`, error);
            throw error;
        }
    }

    async getMatchLineUp(_match: Match): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async getLiveMatch(match: Match): Promise<MatchDTO> {
        const afId = match.sources?.apiFootball?.id;
        try {
            let fixture = await getLiveFixture(afId);
            if (!fixture) {
                const fixtures = await getFixtures({
                    id: afId,
                });
                fixture = fixtures[0];
            }
            return fixtureDataToMatchDTOMap(fixture);
        } catch (error) {
            logger.info(`Error fetching fixtures from apiFootball`, error);
            throw error;
        }
    }
    getMatchStatistics(): Promise<any> {
        throw new Error("Method not implemented.");
    }
}

function playerDataToAthleteMap(a: PlayerData): Athlete {
    return {
        name: a.player.name,
        firstname: a.player.firstname,
        lastname: a.player.lastname,
        nationality: a.player.nationality,
        photo: a.player.photo,
        sources: { apiFootball: { id: a.player.id } },
    };
}

async function fixtureDataToMatchDTOMap(
    fixtureData: FixtureData
): Promise<MatchDTO> {
    const teams = (await Promise.all(
        Object.values(fixtureData.teams).map(async (raw) => {
            const team = await prisma.team.findFirst({
                where: {
                    name: raw.name,
                },
            });

            if (!team) throw new Error(`Missing team: ${raw.name}`);
            return team;
        })
    )) as Team[];

    const FixtureStatusMap: Record<FixtureShortStatus, MatchStatus> = {
        TBD: MatchStatus.Unscheduled,
        NS: MatchStatus.Scheduled,
        "1H": MatchStatus.InProgress,
        HT: MatchStatus.Break,
        "2H": MatchStatus.InProgress,
        ET: MatchStatus.InProgress,
        P: MatchStatus.InProgress,
        FT: MatchStatus.Completed,
        AET: MatchStatus.Break,
        PEN: MatchStatus.InProgress,
        BT: MatchStatus.Break,
        SUSP: MatchStatus.Suspended,
        INT: MatchStatus.Break,
        PST: MatchStatus.Scheduled,
        CANC: MatchStatus.Cancelled,
        ABD: MatchStatus.Cancelled,
        AWD: MatchStatus.Completed,
        WO: MatchStatus.Completed,
    };

    const status = FixtureStatusMap[fixtureData.fixture.status.short];
    const homeTeam = teams.find((t) => t.name === fixtureData.teams.home.name);
    const awayTeam = teams.find((t) => t.name === fixtureData.teams.away.name);
    if (!homeTeam || !awayTeam)
        throw new Error(
            `Missing team: ${fixtureData.teams.home.name} or ${fixtureData.teams.away.name}`
        );

    let winner;
    if (status === MatchStatus.Completed) {
        if (fixtureData.teams.home.winner) winner = homeTeam.id;
        else if (fixtureData.teams.away.winner) winner = awayTeam.id;
        else winner = "draw";
    }

    const statistics = {
        [homeTeam.code]: fixtureData.teams.home.statistics,
        [awayTeam.code]: fixtureData.teams.away.statistics,
    };

    return {
        teams,
        sport: "football",
        status,
        competitionId: fixtureData.league.country === 'USA' ? 2 : 1,
        dateTime: fixtureData.fixture.date,
        // TODO: Checkout periods for apiFootball match that extended to penalties
        // It's okay for now, premier league does not extend to penalties
        periods: {
            first: (fixtureData.fixture.periods.first
                ? new Date(fixtureData.fixture.periods.first * 1000)
                : new Date(fixtureData.fixture.date)
            ).toISOString(),
            ...(fixtureData.fixture.periods.second && {
                second: new Date(
                    fixtureData.fixture.periods.second * 1000
                ).toISOString(),
            }),
        } as Record<Partial<FootballPeriod>, string>,
        season: `${fixtureData.league.season}`,
        venue: fixtureData.fixture.venue.name,
        winner: winner ? `${winner}` : undefined,
        summary: {
            scores: {
                [homeTeam.code]: fixtureData.goals.home || 0,
                [awayTeam.code]: fixtureData.goals.away || 0,
            },
            scoresByPeriodEnd: {
                first: fixtureData.score.halftime,
                second: fixtureData.score.fulltime,
                firstExtra: undefined,
                secondExtra: fixtureData.score.extratime,
                penalties: fixtureData.score.penalty,
            },
            statistics,
        },
        sources: { apiFootball: { id: fixtureData.fixture.id } },
        metadata: {
            status: fixtureData.fixture.status,
            teams: {
                home: {
                    id: homeTeam.id,
                    name: homeTeam.name,
                    code: homeTeam.code,
                },
                away: {
                    id: awayTeam.id,
                    name: awayTeam.name,
                    code: awayTeam.code,
                },
            },
        } as MatchMetadata,
    };
}

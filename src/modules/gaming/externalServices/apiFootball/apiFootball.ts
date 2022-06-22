/*
get Leagues: https://api-football-v1.p.rapidapi.com/v3/leagues
get Teams: https://api-football-v1.p.rapidapi.com/v3/teams?league=39&season=2022
get Team Athletes: https://api-football-v1.p.rapidapi.com/v3/players/?season=2022&team=50&page=1
get Fixtures: https://api-football-v1.p.rapidapi.com/v3/fixtures?league=39&season=2022
lineup: https://api-football-v1.p.rapidapi.com/v3/fixtures/lineups?fixture=710921
get live score and updates: https://api-football-v1.p.rapidapi.com/v3/fixtures?league=39&season=2022&live=all
get Match Statistics: https://api-football-v1.p.rapidapi.com/v3/fixtures?id=710921
*/

import {
    FixtureData,
    LeagueData,
    Paging,
    PlayerData,
    TeamData,
} from "./apiFootball.types";
import { apiFootballRequest } from "./baseApi";

export async function getLeagues() {
    return (await apiFootballRequest("/leagues")).response as Promise<
        LeagueData[]
    >;
}

export async function getTeams(
    params: { league: number; season: number; id?: number } = {
        league: 39,
        season: 2022,
    }
) {
    return (await apiFootballRequest("/teams", params)).response as Promise<
        TeamData[]
    >;
}

export async function getTeamPlayers(
    team: number,
    params: {
        season: number;
        page?: number;
    } = {
        season: 2022,
        page: 1,
    }
) {
    const resp = await apiFootballRequest("/players", {
        team,
        ...params,
    });
    return {
        response: resp.response as PlayerData[],
        paging: resp.paging as Paging,
    };
}

export async function getFixtures(
    params: {
        league: number;
        season: number;
        id?: number;
        live?: "all";
    } = {
        league: 39,
        season: 2022,
    }
) {
    return (await apiFootballRequest("/fixtures", params)).response as Promise<
        FixtureData[]
    >;
}

export async function getLiveFixture(
    fixtureId: number
): Promise<FixtureData | undefined> {
    const cache = new Map<number, FixtureData>();
    let fixture = cache.get(fixtureId);
    if (!fixture) {
        const liveFixtures = await getFixtures({
            league: 39,
            season: 2022,
            live: "all",
        });

        liveFixtures.forEach((fixtureData) => {
            cache.set(fixtureData.fixture.id, fixtureData);
        });
        fixture = cache.get(fixtureId);
    }
    cache.delete(fixtureId);
    return fixture;
}

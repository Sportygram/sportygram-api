export interface AddNewCompetitionDTO {
    name: string;
    logo: string;
    sport: string;
    country: string;
    countryCode: string;
    season: string;
    sources: Record<string, any>;
}

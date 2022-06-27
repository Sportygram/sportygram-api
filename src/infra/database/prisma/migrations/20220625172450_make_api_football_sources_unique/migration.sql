-- This is an empty migration.
CREATE UNIQUE INDEX "matches_sources_apiFootball_id_key" ON matches(("sources" -> 'apiFootball' ->> 'id'));
CREATE UNIQUE INDEX "competitions_sources_apiFootball_id_key" ON competitions(("sources" -> 'apiFootball' ->> 'id'));
CREATE UNIQUE INDEX "teams_sources_apiFootball_id_key" ON teams(("sources" -> 'apiFootball' ->> 'id'));
CREATE UNIQUE INDEX "athletes_sources_apiFootball_id_key" ON athletes(("sources" -> 'apiFootball' ->> 'id'));
CREATE UNIQUE INDEX "matches_teams_sources_apiFootball_id_key" ON matches_teams(("sources" -> 'apiFootball' ->> 'id'));

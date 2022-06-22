-- This is an empty migration.
CREATE UNIQUE INDEX "matches_sources_apiFootball_id_key" ON matches(("sources" -> 'apiFootball' ->> 'id'));
CREATE UNIQUE INDEX "leagues_sources_apiFootball_id_key" ON leagues(("sources" -> 'apiFootball' ->> 'id'));
CREATE UNIQUE INDEX "teams_sources_apiFootball_id_key" ON teams(("sources" -> 'apiFootball' ->> 'id'));
CREATE UNIQUE INDEX "athletes_sources_apiFootball_id_key" ON athletes(("sources" -> 'apiFootball' ->> 'id'));
import React from "react";
import { Box, Typography, Button } from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";

import { SeriesDetail, Season, Episode } from "../../declarations/types";
import { API_KEY, API_URL_BASE } from "../../declarations/constants";
import { useParams } from "react-router-dom";
import Layout from "../shared/layout/Layout";
import MediaHeader from "../MediaHeader";
import EpisodeCard from "../shared/EpisodeCard";

const getRandomInt = (max: number) =>
  Math.floor(Math.random() * Math.floor(max));

const ShowPage: React.FC = () => {
  const { seriesId } = useParams();
  const [showInfo, updateShowInfo] = React.useState<SeriesDetail>();
  const [selectedSeasons, updateSelectedSeasons] = React.useState<Season[]>([]);
  const [randomEpisode, updateRandomEpisode] = React.useState<Episode>();

  const selectAllRegularSeasons = React.useCallback((res: SeriesDetail) => {
    // Default select all regular seasons
    updateSelectedSeasons(
      res.seasons.filter((season: Season) => season.season_number !== 0)
    );
  }, []);

  React.useEffect(() => {
    fetch(`${API_URL_BASE}/tv/${seriesId}?api_key=${API_KEY}`)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        updateShowInfo(res);
        selectAllRegularSeasons(res);
      });
  }, [seriesId, selectAllRegularSeasons]);

  const getRandomEpisode = function(): {
    season: Season;
    episodeNumber: number;
  } {
    const numPotentialEpisodes = selectedSeasons.reduce(
      (episodes, season) => episodes + season.episode_count,
      0
    );
    const randomEpisodeNumber = getRandomInt(numPotentialEpisodes);
    let episodeCounter = randomEpisodeNumber;

    const selectedEpisodeSeason = selectedSeasons.find(season => {
      if (season.episode_count <= episodeCounter) {
        episodeCounter -= season.episode_count;
        return false;
      }
      return true;
    });

    if (
      !selectedEpisodeSeason ||
      (showInfo &&
        showInfo.last_episode_to_air.season_number ===
          selectedEpisodeSeason.season_number &&
        showInfo.last_episode_to_air.episode_number < episodeCounter)
    ) {
      console.log(
        randomEpisodeNumber,
        numPotentialEpisodes,
        `S${selectedEpisodeSeason?.season_number}E${episodeCounter}`
      );
      return getRandomEpisode();
    }

    return {
      season: selectedEpisodeSeason,
      episodeNumber: episodeCounter
    };
  };

  React.useEffect(() => {
    if (!showInfo) return;
    const { season, episodeNumber } = getRandomEpisode();

    if (!season || !episodeNumber) return;

    fetch(
      `${API_URL_BASE}/tv/${seriesId}/season/${season.season_number}?api_key=${API_KEY}`
    )
      .then(res => res.json())
      .then(res => updateRandomEpisode(res.episodes[episodeNumber]));
    // eslint-disable-next-line
  }, [selectedSeasons]);

  const onSeasonSelect = (event: React.MouseEvent, newSeasons: Season[]) => {
    event.preventDefault();
    updateSelectedSeasons(newSeasons);
  };

  return (
    <Layout>
      {showInfo && (
        <>
          <MediaHeader {...showInfo} />
          <Box p={3} maxWidth="1000px">
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">
                <Box fontWeight="bolder">Filter Seasons: </Box>
                <ToggleButtonGroup
                  value={selectedSeasons}
                  onChange={onSeasonSelect}
                >
                  {showInfo.seasons.map(season => (
                    <ToggleButton key={season.id} value={season}>
                      <Box px={1}>{season.season_number}</Box>
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Typography>
              <Box>
                <Button variant="contained" color="secondary" size="large">
                  Find Another Episode
                </Button>
              </Box>
            </Box>
            {randomEpisode && (
              <Box my={3}>
                <EpisodeCard {...randomEpisode} />
              </Box>
            )}
          </Box>
        </>
      )}
    </Layout>
  );
};
export default ShowPage;
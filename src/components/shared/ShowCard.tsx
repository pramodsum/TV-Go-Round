import React from "react";
import {
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  Box
} from "@material-ui/core";

import { Series } from "../../declarations/types";
import { Link } from "react-router-dom";

const ShowCard: React.FC<Series> = props => (
  <Box width={["100%", "30%"]} my={1}>
    <Card>
      <CardActionArea>
        <Link
          to={`/show/${props.id}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <CardMedia
            style={{ height: "140px" }}
            image={`https://image.tmdb.org/t/p/w500_and_h282_face${props.poster_path}`}
            title={props.name}
          />
          <CardContent>
            <Box display="flex" justifyContent="space-between">
              <Typography gutterBottom variant="h5" component="h2">
                {props.name}
              </Typography>
              <Chip
                color="primary"
                style={{ marginTop: "2px", marginLeft: "6px" }}
                label={`${props.vote_average * 10}%`}
              />
            </Box>
          </CardContent>
        </Link>
      </CardActionArea>
    </Card>
  </Box>
);

export default ShowCard;

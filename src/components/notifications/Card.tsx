import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 275,
  padding: "8px",
  marginBottom: "4px",
  "&:hover": {
    opacity: 0.4,
    cursor: "pointer"
  }
}));

export default function SimpleCard(props: any) {
  const [clicked, setClicked] = React.useState(props.isRead);

  const handleClicked = () => {
    props.handleClickCard();
    setClicked(true);
  };

  return (
    <StyledCard onClick={handleClicked}>
      <CardContent>
        <Typography variant="h5" component="h3">
          {props.name}
        </Typography>
        {clicked ? null : (
          <Badge className="float-right" color="secondary" variant="dot" />
        )}

        <Typography sx={{ marginBottom: 0.75 }} color="textSecondary">
          {props.nType}
        </Typography>
      </CardContent>
      <hr className="solid my-0" />
    </StyledCard>
  );
}

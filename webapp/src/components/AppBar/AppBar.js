import { bool, func } from "prop-types";
import { useLocation } from "react-router-dom";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { DRAWER_WIDTH } from "components/Drawer";
import pathTo from "utils/pathTo";

const PATHNAME_TO_NAME = {
  [pathTo.dashboard]: "Dashboard",
  [pathTo.transactions]: "Transactions",
  [pathTo.companies]: "Companies",
  [pathTo.merchants]: "Merchants",
  [pathTo.users]: "Users",
};

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function AppBar(props) {
  const { open, toggleDrawer } = props;
  const location = useLocation();

  return (
    <StyledAppBar position="absolute" open={open}>
      <Toolbar
        sx={{
          pr: "24px", // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: "36px",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          {PATHNAME_TO_NAME[location.pathname]}
        </Typography>
      </Toolbar>
    </StyledAppBar>
  );
}

AppBar.propTypes = {
  open: bool.isRequired,
  toggleDrawer: func.isRequired,
};

export default AppBar;

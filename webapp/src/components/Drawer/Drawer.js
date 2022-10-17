import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import { styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import ReceiptIcon from "@mui/icons-material/Receipt";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PeopleIcon from "@mui/icons-material/People";
import { bool, func } from "prop-types";

import ListItemLink from "components/ListItemLink";
import pathTo from "utils/pathTo";

export const DRAWER_WIDTH = 240;

const NAV_LINKS = [
  {
    icon: <DashboardIcon />,
    primary: "Dashboard",
    to: pathTo.dashboard,
  },
  {
    icon: <ReceiptIcon />,
    primary: "Transactions",
    to: pathTo.transactions,
  },
  {
    icon: <BusinessIcon />,
    primary: "Companies",
    to: pathTo.companies,
  },
  {
    icon: <StorefrontIcon />,
    primary: "Merchants",
    to: pathTo.merchants,
  },
  {
    icon: <PeopleIcon />,
    primary: "Users",
    to: pathTo.users,
  },
];

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: DRAWER_WIDTH,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

function Drawer(props) {
  const { open, toggleDrawer } = props;

  return (
    <StyledDrawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List sx={{ height: "100%" }}>
        {NAV_LINKS.map((link) => (
          <ListItemLink key={link.primary} {...link} />
        ))}
      </List>
    </StyledDrawer>
  );
}

Drawer.propTypes = {
  open: bool.isRequired,
  toggleDrawer: func.isRequired,
};

export default Drawer;

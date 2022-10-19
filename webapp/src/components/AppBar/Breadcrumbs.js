import { Link, useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";

import pathTo from "utils/pathTo";
import pathToName from "utils/pathToName";

function Breadcrumbs() {
  const location = useLocation();

  let breadcrumbs = [];
  for (const path of Object.values(pathTo)) {
    // skip when path is dashboard but location pathname is not dashboard
    if (path === pathTo.dashboard && location.pathname !== pathTo.dashboard) {
      continue;
    }

    if (location.pathname.includes(path)) {
      breadcrumbs.push({
        name: pathToName[path],
        to: path,
      });
    }
  }

  return (
    <MuiBreadcrumbs aria-label="breadcrumb" sx={{ fontSize: 24 }}>
      {breadcrumbs.map((breadcrumb, index) => {
        const isLastIndex = index === breadcrumbs.length - 1;
        if (isLastIndex) {
          return (
            <Typography
              key={breadcrumb.name}
              component="h1"
              variant="h6"
              color="white"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {breadcrumb.name}
            </Typography>
          );
        }
        return (
          <Link key={breadcrumb.name} to={breadcrumb.to}>
            <Typography
              component="h1"
              variant="h6"
              color="blue"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {breadcrumb.name}
            </Typography>
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}

export default Breadcrumbs;

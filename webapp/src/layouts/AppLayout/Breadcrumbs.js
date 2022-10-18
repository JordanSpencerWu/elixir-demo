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
    <MuiBreadcrumbs
      aria-label="breadcrumb"
      sx={{ position: "absolute", top: 16, left: 24, fontSize: 24 }}
    >
      {breadcrumbs.map((breadcrumb, index) => {
        const isLastIndex = index === breadcrumbs.length - 1;
        if (isLastIndex) {
          return (
            <Typography sx={{ fontSize: 24 }} color="text.primary">
              {breadcrumb.name}
            </Typography>
          );
        }
        return <Link to={breadcrumb.to}>{breadcrumb.name}</Link>;
      })}
    </MuiBreadcrumbs>
  );
}

export default Breadcrumbs;

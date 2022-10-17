import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { NavLink } from "react-router-dom";
import { string, node } from "prop-types";
import { Global, css } from "@emotion/react";

function ListItemLink(props) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef(function Link(itemProps, ref) {
        return <NavLink to={to} ref={ref} {...itemProps} />;
      }),
    [to]
  );

  return (
    <>
      <Global
        styles={css`
          a.active,
          a.active:hover {
            background-color: #3b71ca;
            color: white;
          }

          a.active svg {
            fill: white;
          }
        `}
      />
      <li>
        <ListItem button component={renderLink}>
          {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
          <ListItemText primary={primary} />
        </ListItem>
      </li>
    </>
  );
}

ListItemLink.propTypes = {
  icon: node,
  primary: string.isRequired,
  to: string.isRequired,
};

ListItemLink.defaultProps = {
  icon: null,
};

export default ListItemLink;

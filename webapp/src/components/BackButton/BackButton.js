import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";

function BackButton() {
  const naviagte = useNavigate();

  const handleBackClick = () => {
    naviagte(-1);
  };

  return (
    <Link
      sx={{ fontSize: "18px" }}
      component="button"
      onClick={handleBackClick}
    >
      Back
    </Link>
  );
}

export default BackButton;

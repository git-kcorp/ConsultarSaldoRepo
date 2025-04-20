import { useState } from "react";
import styles from "../Styles/Header.module.css";
import SettingsIcon from "@mui/icons-material/Settings";
import { IconButton } from "@mui/material";
import Configuration from "./Configuration";

function Header() {
  const [openConfig, setOpenConfig] = useState(false);

  const handleClick = () => {
    setOpenConfig(true);
  };

  const handleClose = () => {
    setOpenConfig(false);
  };

  return (
    <div className="header">
      <div className={styles["nav-left"]}></div>
      <div className={styles["nav-mid"]}></div>

      <div className={styles["nav-right"]}>
        <IconButton aria-label="Configuracion" color="inherit" onClick={handleClick}>
          <SettingsIcon />
        </IconButton>
      </div>

      <Configuration open={openConfig} onClose={handleClose} />
    </div>
  );
}

export default Header;

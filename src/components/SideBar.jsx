import { NAV_SIZE } from "../utils";
import SideBarItem from "./SideBarItem";

const ulStyles = {
  margin: 0,
  listStyleType: 'none',
  display: "flex",
  justifyContent: "space-between",
  flex: 1,
  padding: 0
}

function SideBar({ position = "top", size = NAV_SIZE, navbarContent, options, setSelectedOption }) {
  const onClick = (index) => setSelectedOption(() => options[index].toLowerCase());
  const navStyles = {
    position: "fixed",
    top: position === "top" ? 0 : null,
    bottom: position === "bottom" ? 0 : null,
    left: position === "left" ? 0 : null,
    right: position === "right" ? 0 : null,
    width: (position === "top" || position === "bottom") ? "100%" : size,
    height: (position === "top" || position === "bottom") ? size : "100%",
    background: "rgba(16, 16, 16, 0.25)",
    display: 'flex',
    zIndex: 100,
  }
  
  return (
    <nav style={navStyles}>
      <ul style={ulStyles}>
        {navbarContent.map((cnt, index) => (
          <SideBarItem onClick={() => onClick(index)} key={cnt.id}>{cnt.children}</SideBarItem>
        ))}
      </ul>
    </nav>
  )
}

export default SideBar
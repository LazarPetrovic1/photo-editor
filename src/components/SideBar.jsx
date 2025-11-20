import { NAV_SIZE } from "../utils";
import SideBarItem from "./SideBarItem";

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
  };

  const save = () => {
    const name = crypto.randomUUID();
    const canvas = document.getElementById("canvas")
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${name}.png`;
    link.click();
  }
  
  return (
    <nav style={navStyles}>
      <ul className="side-ul">
        {navbarContent.map((cnt, index) => (
          <SideBarItem onClick={() => onClick(index)} key={cnt.id}>{cnt.children}</SideBarItem>
        ))}
        {position === "top" && (
          <li className="side-li">
            <button className="export-btn" onClick={save}>Save</button>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default SideBar
import { NAV_SIZE } from "../utils";
import SideBarItem from "./SideBarItem";

function SideBar({ position = "top", size = NAV_SIZE, navbarContent, options, setSelectedOption, setExtension, extension }) {
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
    const dataURL = canvas.toDataURL(`image/${extension}`);
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${name}.${extension}`;
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
            <div className="export-block">
              <select title="Extension to save as" style={{ flex: 1 }} name="extension" id="extension" value={extension} onChange={e => setExtension(() => e.target.value)}>
                <option value="" disabled>-- Extension --</option>
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WEBP</option>
              </select>
              <button className="export-btn" onClick={save}>Save</button>
            </div>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default SideBar
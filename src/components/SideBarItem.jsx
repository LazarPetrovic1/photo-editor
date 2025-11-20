const liStyles = {
  display: "flex",
  margin: 0,
  justifyContent: "center",
  alignItems :"center",
  flex: 1,
  cursor: 'pointer',
  userSelect: 'none'
}

function SideBarItem({ onClick, children }) {
  return <li className="side-li" onClick={onClick}>{children}</li>;
}

export default SideBarItem
export const NAV_SIZE = 50;
export const topNavOptions = ["Crop", "Filter", "Text", "Draw", "Stickers", "Fill", "Obfuscate", "Resize"]
export const leftNavOptions = []
export const rightNavOptions = []
export const botNavOptions = []
export const TOP_NAV_CNTNT = [
  {
    id: 1,
    children: <span style={{ padding: "0.25rem", flex: 1, textAlign: "center" }}>Crop</span>,
  },
  {
    id: 3,
    children: <span style={{ padding: "0.25rem", flex: 1, textAlign: "center" }}>Filter</span>,
  },
  {
    id: 4,
    children: <span style={{ padding: "0.25rem", flex: 1, textAlign: "center" }}>Text</span>,
  },
  {
    id: 9,
    children: <span style={{ padding: "0.25rem", flex: 1, textAlign: "center" }}>Draw</span>,
  },
  {
    id: 5,
    children: <span style={{ padding: "0.25rem", flex: 1, textAlign: "center" }}>Stickers</span>,
  },
  {
    id: 6,
    children: <span style={{ padding: "0.25rem", flex: 1, textAlign: "center" }}>Fill</span>,
  },
  {
    id: 7,
    children: <span style={{ padding: "0.25rem", flex: 1, textAlign: "center" }}>Obfuscate</span>,
  },
  {
    id: 8,
    children: <span style={{ padding: "0.25rem", flex: 1, textAlign: "center" }}>Resize</span>,
  },
]
export const canvasFontFamilies = [
  "Arial", "Helvetica", "Times New Roman", "Verdana", "Tahoma", "Georgia",
  "Courier New", "Trebuchet MS", "Segoe UI", "Lucida Sans", "Lucida Grande"
]
export const canvasTextAlign = ["left", "center", "right"]
export const canvasTextBaseline = ["middle", "top", "bottom"]
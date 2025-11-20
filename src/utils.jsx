export const NAV_SIZE = 50;
export const topNavOptions = ["Crop", "Filter", "Text", "Draw", "Shapes", "Obfuscate", "Resize"]
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
    id: 6,
    children: <span style={{ padding: "0.25rem", flex: 1, textAlign: "center" }}>Shapes</span>,
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

export const log1 = (text, val) => console.log(`%c${text}`, 'color: white; font-size: 18px;', val);
export const log2 = (text, val) => console.log(`%c${text}`, 'color: yellow; font-size: 18px;', val);
export const log3 = (text, val) => console.log(`%c${text}`, 'color: orange; font-size: 18px;', val);
export const log4 = (text, val) => console.log(`%c${text}`, 'color: blue; font-size: 18px;', val);
export const log5 = (text, val) => console.log(`%c${text}`, 'color: navy; font-size: 18px;', val);
export const log6 = (text, val) => console.log(`%c${text}`, 'color: green; font-size: 18px;', val);
export const log7 = (text, val) => console.log(`%c${text}`, 'color: red; font-size: 18px;', val);
export const log8 = (text, val) => console.log(`%c${text}`, 'color: purple; font-size: 18px;', val);
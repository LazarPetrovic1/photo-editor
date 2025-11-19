import './App.css';
import { useState } from 'react';
import SideBar from './components/SideBar';
import { TOP_NAV_CNTNT, topNavOptions } from './utils';
import ImageContainer from './components/ImageContainer';
import useHistoryState from './hooks/useHistoryState';
import AlertContainer from './components/AlertContainer';

const newDivStyles = {
  display: "flex",
  flexDirection: "column",
  width: "90%"
}

function App() {
  const [selectedOption, setSelectedOption] = useState(() => null)
  const [imageUrl, setImageUrl] = useHistoryState(() => "");
  const hasImage = !!imageUrl;
  const [size, setSize] = useState(() => ({
    height: 300,
    width: 300
  }));
  const [bg, setBg] = useState(() => "");
  const resize = (e) => setSize((prev) => ({ ...prev, [e.target.name]: parseInt(e.target.value)}));
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(() => url);
    }
  };

  const newImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = bg; // Set background color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill canvas with color
    const imageUrl = canvas.toDataURL("image/png"); // Generate data URL   
    setImageUrl(() => imageUrl)
  }

  // const handleSave = (imageBlob) => {
  //   // Handle the saved image blob
  //   const url = URL.createObjectURL(imageBlob);
  //   console.log("Saved image URL:", url);

  //   // You can also download the image
  //   const randomName = crypto.randomUUID().replace("-", "");
  //   const downloadLink = document.createElement("a");
  //   downloadLink.href = url;
  //   downloadLink.download = `${randomName}.png`;
  //   downloadLink.click();
  // };

  // const handleCancel = () => {
  //   console.log("Editing cancelled");
  //   setImageUrl(() => ""); // Reset image
  // };
  
  return (
    <div>
      {hasImage && <SideBar navbarContent={TOP_NAV_CNTNT} setSelectedOption={setSelectedOption} options={topNavOptions} />}
      <AlertContainer />
      {!imageUrl ? (
        <div className="image-picker">
          <div style={{ width: "50vw", height: "90vh" }}>
            <div className="upload-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="file-input"
              />
            </div>
            <div className="wr"></div>
            <div style={newDivStyles}>
              <div className='new-row'>
                <label htmlFor="height">Height</label>
                <input min={50} max={5000} step={1} type="number" name="height" id="height" value={size.height} onChange={resize} />
                <span>px</span>
              </div>
              <div className='new-row'>
                <label htmlFor="width">Width</label>
                <input min={50} max={5000} step={1} type="number" name="width" id="width" value={size.width} onChange={resize} />
                <span>px</span>
              </div>
              <div className='new-row'>
                <label htmlFor="bg"><small>Default background</small></label>
                <input type="color" name="bg" id="bg" value={bg} onChange={e => setBg(() => e.target.value)} />
                <small>{bg}</small>
              </div>
              <button onClick={newImage} className='new-image-btn'>Create a blank image</button>
            </div>
          </div>
        </div>
      ) : <ImageContainer setImageUrl={setImageUrl} imageUrl={imageUrl} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />}
    </div>
  );
}

export default App;

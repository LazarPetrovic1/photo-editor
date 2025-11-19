import { useContext, useEffect, useRef, useState } from "react";
import { canvasFontFamilies, canvasTextAlign, canvasTextBaseline } from "../utils";
import { AlertContext } from "../contexts/AlertContext";

const INIT_DIMS = { startX: null, startY: null, endX: null, endY: null }

function ImageContainer({ imageUrl, setImageUrl, selectedOption, setSelectedOption }) {
  const imgRef = useRef(null);
  const [texts, setTexts] = useState(() => []);
  const [drawlines, setDrawlines] = useState(() => []);
  const [isDrawing, setIsDrawing] = useState(() => false);
  const [scale, setScale] = useState(() => 1);
  const [isCropping, setIsCropping] = useState(() => false);
  const [dims, setDims] = useState(() => INIT_DIMS);
  const [image, setImage] = useState(() => null);
  const [showControls, setShowControls] = useState(() => null);
  const [contrast, setContrast] = useState(() => 100);
  const [grayscale, setGrayscale] = useState(() => 0);
  const [saturation, setSaturation] = useState(() => 100);
  const [hueRotate, setHueRotate] = useState(() => 0);
  const [negative, setNegative] = useState(() => 0);
  const [opacity, setOpacity] = useState(() => 100);
  const [brightness, setBrightness] = useState(() => 100);
  const [blur, setBlur] = useState(() => 0);
  const [dropShadow, setDropShadow] = useState(() => ({ x: 0, y: 0, blur: 0, color: "transparent" }));
  const { addAlert } = useContext(AlertContext)
  const [textOptions, setTextOptions] = useState(() => ({
    fontSize: 16,
    fontFamily: canvasFontFamilies[0],
    fill: "#000000",
    strokeText: "#000000",
    textAlign: canvasTextAlign[0],
    textBaseline: canvasTextBaseline[0],
    lineWidth: 3
  }))

  useEffect(() => {
    if (selectedOption === "text") addAlert("Double click on the image to add a text field there.", "info");
    // eslint-disable-next-line
  }, [selectedOption]);
  // eslint-disable-next-line
  useEffect(() => { renderCanvas(); }, [texts.length]);

  useEffect(() => {
    if (imgRef && imgRef.current) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imageUrl; // or a blob URL
      img.onload = () => {
        const canvas = imgRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      setImage(() => img);
    }
  }, [imageUrl]);

  // const addDrawingToCanvas = () => {
  //   const ctx = imgRef.current.getContext('2d');
  //   drawlines.forEach((dl) => {
  //     ctx.strokeStyle = dl.strokeText;
  //     ctx.lineWidth = dl.lineWidth;
  //     ctx.lineTo(dl.offsetX, dl.offsetY);
  //     ctx.stroke();
  //     imgRef.current.toBlob((blob) => {
  //       const url = URL.createObjectURL(blob);
  //       setImageUrl(() => url);
  //     }, 'image/png')
  //   });
  // }

  const renderCanvas = () => {
    const ctx = imgRef.current.getContext('2d');
    texts.forEach(text => {
      ctx.font = `${text.fontSize}px ${text.fontFamily}`;
      ctx.textAlign = text.textAlign;
      ctx.textBaseline = text.textBaseline;
      ctx.fillStyle = text.fill;
      ctx.strokeStyle = text.strokeText;
      ctx.lineWidth = text.lineWidth;
      ctx.fillText(text.value, text.x, text.y);
      if (text.strokeText !== 'none') ctx.strokeText(text.value, text.x, text.y);
        imgRef.current.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setImageUrl(() => url);
      }, 'image/png')
    });
  }

  const addTextField = (clientX, clientY) => {
    setShowControls(() => null)
    const canvas = imgRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const input = document.createElement('input');
    input.style.position = 'absolute';
    input.style.left = `${clientX}px`;
    input.style.top = `${clientY}px`;
    document.body.appendChild(input);
    input.focus();
    const finish = () => {
      const canvas = imgRef.current;
      const ctx = canvas.getContext('2d')
      ctx.font = `${textOptions.fontSize}px ${textOptions.fontFamily}`;
      ctx.textAlign = textOptions.textAlign;
      ctx.textBaseline = textOptions.textBaseline;
      ctx.fillStyle = textOptions.fill;
      ctx.strokeStyle = textOptions.strokeText;
      ctx.lineWidth = textOptions.lineWidth;
      ctx.fillText(input.value, x, y);
      input.removeEventListener('blur', finish);
      input.removeEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') finish();
      });
      setTexts((prev) => [...prev, { value: input.value, x, y, ...textOptions }]);
      document.body.removeChild(input);
    };
    input.addEventListener('blur', finish);
    input.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') finish() });
  }

  const handleMouseDown = (e) => {
    if (!e.ctrlKey) {
      setIsDrawing(() => true);
      return;
    }
    if (e.ctrlKey) {
      const canvas = imgRef.current;
      const rect = canvas.getBoundingClientRect();
      setDims((prev) => ({ ...prev, startX: e.clientX - rect.left, startY: e.clientY - rect.top }));
      setIsCropping(() => true);
      addAlert("Hold the CTRL key the whole time while cropping until the menu appears.", "info");
    }
  }
  
  const handleMouseMove = (e) => {
    const canvas = imgRef.current;
    const ctx = canvas.getContext('2d');
    if (isDrawing) {
      const { offsetX, offsetY } = e.nativeEvent;
      ctx.strokeStyle = textOptions.strokeText;
      ctx.lineWidth = textOptions.lineWidth;
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
      setDrawlines((prev) => [...prev, { offsetX, offsetY, ...textOptions }]);
    }
    if (!isCropping) return;
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    setDims((prev) => ({ ...prev, endX: currentX, endY: currentY }));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    const width = currentX - dims.startX;
    const height = currentY - dims.startY;
    ctx.fillStyle = 'rgba(30, 0, 255, 0.3)';
    ctx.strokeStyle = 'navy';
    ctx.lineWidth = 2;
    ctx.fillRect(dims.startX, dims.startY, width, height);
    ctx.strokeRect(dims.startX, dims.startY, width, height);
  }

  const handleMouseUp = (e) => {
    if (e.ctrlKey) {
      setIsCropping(() => false);
      setShowControls(() => "crop")
    } else {
      setIsDrawing(() => false);
      // addDrawingToCanvas();
    }
  }

  const handleWheel = (e) => {
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(1, scale + delta), 3); // limits: 1x to 3x
    setScale(() => newScale);
  };

  const stopCrop = () => {
    const canvas = imgRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0); // Redraw original image
  }

  const cancelCrop = () => {
    stopCrop();
    setDims(() => INIT_DIMS); // Clear crop state
    setShowControls(() => "")
  };

  const acceptCrop = () => {
    stopCrop();
    const canvas = imgRef.current;
    const ctx = canvas.getContext('2d');
    const { startX, startY, endX, endY } = dims;
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);
    const x = Math.min(startX, endX);
    const y = Math.min(startY, endY);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(tempCanvas, 0, 0);

    tempCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      setImageUrl(() => url);
    }, 'image/png');

    setShowControls(() => "")
    setTexts(() => []);
  }

  const handleDoubleClick = (e) => {
    if (selectedOption !== 'text') return;
    addTextField(e.clientX, e.clientY);
  }

  return (
    <div className="image-container" style={{ cursor: isCropping ? "crosshair" : "default" }} onWheel={handleWheel}>
      <canvas
        ref={imgRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          transition: 'transform 0.1s',
          display: 'block',
          filter: `contrast(${contrast}%) grayscale(${grayscale}%) saturate(${saturation}%) hue-rotate(${hueRotate}deg) invert(${negative}%) opacity(${opacity}%) brightness(${brightness}%) blur(${blur}px) drop-shadow(${dropShadow.x}px ${dropShadow.y}px ${dropShadow.blur}px ${dropShadow.color})`
        }}
      />
      {showControls === "crop" && (
        <div className="crop-controls">
          <span>Crop image?</span>
          <button onClick={acceptCrop} className="button">&#10003; Yes</button>
          <button onClick={cancelCrop} className="button">&#10539; No</button>
        </div>
      )}
      {selectedOption === "filter" && (
        <div className="filter-controls">
          <div className="filter-item">
            <label style={{ fontSize: "10px" }} htmlFor="contrast">Contrast</label>
            <input
              type="range"
              onChange={e => setContrast(() => e.target.value)}
              value={contrast}
              min={0}
              max={300}
              step={1}
              name="contrast"
              id="contrast"
            />
            <span style={{ fontSize: "10px" }}>{contrast}%</span>
          </div>
          <div className="filter-item">
            <label style={{ fontSize: "10px" }} htmlFor="grayscale">Grayscale</label>
            <input
              type="range"
              onChange={e => setGrayscale(() => e.target.value)}
              min={0}
              max={100}
              value={grayscale}
              step={1}
              name="grayscale"
              id="grayscale"
            />
            <span style={{ fontSize: "10px" }}>{grayscale}%</span>
          </div>
          <div className="filter-item">
            <label style={{ fontSize: "10px" }} htmlFor="saturate">Saturation</label>
            <input
              type="range"
              value={saturation}
              onChange={e => setSaturation(() => e.target.value)}
              min={0}
              max={300}
              step={1}
              name="saturate"
              id="saturate"
            />
            <span style={{ fontSize: "10px" }}>{saturation}%</span>
          </div>
          <div className="filter-item">
            <label style={{ fontSize: "10px" }} htmlFor="hue-rotate">Hue Rotation</label>
            <input
              type="range"
              onChange={e => setHueRotate(() => e.target.value)}
              min={0}
              max={360}
              step={1}
              name="hue-rotate"
              id="hue-rotate"
            />
            <span style={{ fontSize: "10px" }}>{hueRotate}°</span>
          </div>
          <div className="filter-item">
            <label style={{ fontSize: "10px" }} htmlFor="negative">Negative</label>
            <input
              type="range"
              value={negative}
              onChange={e => setNegative(() => e.target.value)}
              min={0}
              max={100}
              step={1}
              name="negative"
              id="negative"
            />
            <span style={{ fontSize: "10px" }}>{negative}%</span>
          </div>
          <div className="filter-item">
            <label style={{ fontSize: "10px" }} htmlFor="opacity">Opacity</label>
            <input
              type="range"
              value={opacity}
              onChange={e => setOpacity(() => e.target.value)}
              min={0}
              max={100}
              step={1}
              name="opacity"
              id="opacity"
            />
            <span style={{ fontSize: "10px" }}>{opacity}%</span>
          </div>
          <div className="filter-item">
            <label style={{ fontSize: "10px" }} htmlFor="brightness">Brightness</label>
            <input
              type="range"
              onChange={e => setBrightness(() => e.target.value)}
              min={0}
              max={300}
              step={1}
              value={brightness}
              name="brightness"
              id="brightness"
            />
            <span style={{ fontSize: "10px" }}>{brightness}%</span>
          </div>
          <div className="filter-item">
            <label style={{ fontSize: "10px" }} htmlFor="blur">Blur</label>
            <input
              type="range"
              onChange={e => setBlur(() => e.target.value)}
              min={0}
              max={50}
              step={1}
              value={blur}
              name="blur"
              id="blur"
            />
            <span style={{ fontSize: "10px" }}>{blur}px</span>
          </div>
          <div className="filter-item" style={{ flexDirection: "row" }}>
            <div className="centralizer">
              <label style={{ fontSize: "10px" }} htmlFor="dsx">Drop shadow (x-axis)</label>
              <input
                type="range"
                onChange={e => setDropShadow((prev) => ({ ...prev, x: e.target.value }))}
                min={0}
                max={50}
                step={1}
                value={dropShadow.x}
                name="dsx"
                id="dsx"
              />
              <span style={{ fontSize: "10px" }}>{dropShadow.x}px</span>
            </div>
            <div className="centralizer">
              <label style={{ fontSize: "10px" }} htmlFor="dsy">Drop shadow (y-axis)</label>
              <input
                type="range"
                onChange={e => setDropShadow((prev) => ({ ...prev, y: e.target.value }))}
                min={0}
                max={50}
                step={1}
                value={dropShadow.y}
                name="dsy"
                id="dsy"
              />
              <span style={{ fontSize: "10px" }}>{dropShadow.y}px</span>
            </div>
            <div className="centralizer">
              <label style={{ fontSize: "10px" }} htmlFor="dsblur">Drop shadow blur</label>
              <input
                type="range"
                onChange={e => setDropShadow((prev) => ({ ...prev, blur: e.target.value }))}
                min={0}
                max={50}
                step={1}
                value={dropShadow.blur}
                name="dsblur"
                id="dsblur"
              />
              <span style={{ fontSize: "10px" }}>{dropShadow.blur}px</span>
            </div>
            <div className="centralizer" style={{ width: "100px" }}>
              <label style={{ fontSize: "10px" }} htmlFor="dscolour">Drop shadow colour</label>
              <input
                type="color"
                onChange={e => setDropShadow((prev) => ({ ...prev, color: e.target.value }))}
                value={dropShadow.color}
                name="dscolour"
                id="dscolour"
              />
              <span style={{ fontSize: "10px" }}>{dropShadow.color}</span>
            </div>
          </div>
          <div className="filter-item">
            <button
              title="Close"
              className="button"
              style={{ background: "#d50808ff", border: "none", padding: 0, height: "60px", width: "60px", fontSize: "3rem" }}
              onClick={() => setSelectedOption(() => null)}
            >&times;</button>
          </div>
        </div>
      )}
      {selectedOption === "text" && (
        <div className="text-controls">
          <div className="text-item">
            <label style={{ fontSize: "10px" }} htmlFor="fs">Font size</label>
            <input
              type="number"
              onChange={e => setTextOptions((prev) => ({ ...prev, fontSize: parseInt(e.target.value) }))}
              value={textOptions.fontSize}
              min={0}
              max={100}
              step={1}
              name="fs"
              id="fs"
            />
            <span style={{ fontSize: "10px" }}>{textOptions.fontSize}px</span>
          </div>
          <div className="text-item">
            <label style={{ fontSize: "10px" }} htmlFor="ff">Font family</label>
            <select
              value={textOptions.fontFamily}
              name="ff" id="ff"
              onChange={e => setTextOptions((prev) => ({ ...prev, fontFamily: e.target.value }))}
            >
              {canvasFontFamilies.map((cff, i) => (
                <option value={cff} key={i}>{cff}</option>
              ))}
            </select>
            <span style={{ fontSize: "10px" }}>{textOptions.fontFamily}</span>
          </div>
          <div className="text-item">
            <label style={{ fontSize: "10px" }} htmlFor="fill">Fill text</label>
            <input type="color" name="fill" id="fill" onChange={e => setTextOptions((prev) => ({ ...prev, fill: e.target.value }))} />
            <span style={{ fontSize: "10px" }}>{textOptions.fill}</span>
          </div>
          <div className="text-item">
            <label style={{ fontSize: "10px" }} htmlFor="stroke">Stroke text</label>
            <input type="color" name="stroke" id="stroke" onChange={e => setTextOptions((prev) => ({ ...prev, strokeText: e.target.value }))} />
            <span style={{ fontSize: "10px" }}>{textOptions.strokeText}</span>
          </div>
          <div className="text-item">
            <label style={{ fontSize: "10px" }} htmlFor="tal">Text align</label>
            <select
              value={textOptions.textAlign}
              name="tal" id="tal"
              onChange={e => setTextOptions((prev) => ({ ...prev, textAlign: e.target.value }))}
            >
              {canvasTextAlign.map((ctal, i) => (
                <option value={ctal} key={i}>{ctal}</option>
              ))}
            </select>
            <span style={{ fontSize: "10px" }}>{textOptions.textAlign}</span>
          </div>
          <div className="text-item">
            <label style={{ fontSize: "10px" }} htmlFor="val">Vertical align</label>
            <select
              value={textOptions.textBaseline}
              name="val" id="val"
              onChange={e => setTextOptions((prev) => ({ ...prev, textBaseline: e.target.value }))}
            >
              {canvasTextBaseline.map((ctbl, i) => (
                <option value={ctbl} key={i}>{ctbl}</option>
              ))}
            </select>
            <span style={{ fontSize: "10px" }}>{textOptions.textBaseline}</span>
          </div>
          <div className="text-item">
            <label style={{ fontSize: "10px" }} htmlFor="lw">Line width</label>
            <input
              type="number"
              onChange={e => setTextOptions((prev) => ({ ...prev, lineWidth: parseInt(e.target.value) }))}
              value={textOptions.lineWidth}
              min={0}
              max={20}
              step={1}
              name="lw"
              id="lw"
            />
            <span style={{ fontSize: "10px" }}>{textOptions.lineWidth}px</span>
          </div>
        </div>
      )}
      {selectedOption === "draw" && (
        <div className="draw-controls">
          <div className="draw-item">
            <label style={{ fontSize: "10px" }} htmlFor="stroke">Stroke text</label>
            <input type="color" name="stroke" id="stroke" onChange={e => setTextOptions((prev) => ({ ...prev, strokeText: e.target.value }))} />
            <span style={{ fontSize: "10px" }}>{textOptions.strokeText}</span>
          </div>
          <div className="draw-item">
            <label style={{ fontSize: "10px" }} htmlFor="lw">Line width</label>
            <input
              type="number"
              onChange={e => setTextOptions((prev) => ({ ...prev, lineWidth: parseInt(e.target.value) }))}
              value={textOptions.lineWidth}
              min={0}
              max={20}
              step={1}
              name="lw"
              id="lw"
            />
            <span style={{ fontSize: "10px" }}>{textOptions.lineWidth}px</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageContainer;
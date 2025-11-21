import { useContext, useEffect, useRef, useState } from "react";
import { canvasFontFamilies, canvasTextAlign, canvasTextBaseline } from "../utils";
import { AlertContext } from "../contexts/AlertContext";

const INIT_DIMS = { startX: null, startY: null, endX: null, endY: null }
const CIRCLE_DIMS = { startX: null, startY: null, radius: null }
const DRAW_RECT_DIMS = { startX: null, startY: null, width: null, height: null }

function ImageContainer({ imageUrl, setImageUrl, selectedOption, setSelectedOption, size, setSize, back }) {
  const imgRef = useRef(null);
  const [texts, setTexts] = useState(() => []);
  // eslint-disable-next-line
  const [_, setDrawlines] = useState(() => []);
  const [isDrawing, setIsDrawing] = useState(() => false);
  const [isBlurring, setIsBlurring] = useState(() => false);
  const [isShapeFilled, setIsShapeFilled] = useState(() => true);
  const [shape, setShape] = useState(() => "");
  // eslint-disable-next-line
  const [__, setCircles] = useState(() => []);
  const [circleStart, setCircleStart] = useState(() => CIRCLE_DIMS);
  const [rectStart, setRectStart] = useState(() => DRAW_RECT_DIMS);
  // eslint-disable-next-line
  const [___, setRects] = useState(() => []);
  const [scale, setScale] = useState(() => 1);
  const [obfuscation, setObfuscation] = useState(() => 10);
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
    strokeStyle: "#000000",
    textAlign: canvasTextAlign[0],
    textBaseline: canvasTextBaseline[0],
    lineWidth: 3
  }))
  const undo = () => back();

  useEffect(() => {
    if (selectedOption === "text") addAlert("Double click on the image to add a text field there.", "info");
    if (selectedOption === "filter") addAlert("Adjust the sliders down below to see the effect.", "info");
    if (selectedOption === "crop") addAlert("Hold the CTRL key the whole time while cropping until the menu appears.", "info");
    if (selectedOption === "shapes") addAlert("Click, then hold the SHIFT key the whole time while adding shapes.", "info");
    if (selectedOption === "obfuscate") addAlert("Hold the ALT key while drawing the blur.", "info");
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

  const saveCurrentImageState = () => {
    imgRef.current.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      setImageUrl(() => url);
    }, `image/png`);
  }

  function resizeCanvas() {
    const canvas = imgRef.current;
    const ctx = canvas.getContext('2d');
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);
    canvas.width = size.width;
    canvas.height = size.height;
    ctx.drawImage(tempCanvas, 0, 0, size.width, size.height);
    saveCurrentImageState();
  }

  const renderCanvas = () => {
    const ctx = imgRef.current.getContext('2d');
    texts.forEach(text => {
      ctx.font = `${text.fontSize}px ${text.fontFamily}`;
      ctx.textAlign = text.textAlign;
      ctx.textBaseline = text.textBaseline;
      ctx.fillStyle = text.fill;
      ctx.strokeStyle = text.strokeStyle;
      ctx.lineWidth = text.lineWidth;
      ctx.fillText(text.value, text.x, text.y);
      if (text.strokeStyle !== 'none') ctx.strokeStyle(text.value, text.x, text.y);
        imgRef.current.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setImageUrl(() => url);
      }, 'image/png')
    });
  }

  const renderLine = ({ currentX, currentY }, canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = textOptions.strokeStyle;
    ctx.lineWidth = textOptions.lineWidth;
    ctx.lineTo(currentX, currentY);
    setDrawlines((prev) => [...prev, { currentX, currentY, ...textOptions }]);
    ctx.stroke();
  }

  const renderRect = ({ width, height }, canvas, isFilled) => {
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.strokeStyle = textOptions.strokeStyle;
    ctx.fillStyle = textOptions.fill;
    ctx.lineWidth = textOptions.lineWidth;
    if (isFilled) ctx.fillRect(rectStart.startX, rectStart.startY, width, height);
  }

  const renderCircle = ({ width, height, currentX, currentY, canvas }, isFilled) => {
    const ctx = canvas.getContext('2d');
    const radius = Math.sqrt(width ** 2 + height ** 2) / 2;
    const centerX = (circleStart.startX + currentX) / 2;
    const centerY = (circleStart.startY + currentY) / 2;
    setCircleStart((prev) => ({ ...prev, radius }))
    // setCircles((prev) => ({ ...prev, startX: currentX, startY: currentY, ...textOptions }));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = textOptions.fill;
    ctx.strokeStyle = textOptions.strokeStyle;
    if (isFilled) ctx.fill(); else ctx.stroke();
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
      ctx.strokeStyle = textOptions.strokeStyle;
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
    const canvas = imgRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (e.ctrlKey) setIsCropping(() => true);
    if ((e.ctrlKey || e.altKey) && e.button === 0) {
      console.log("is cropping to be set", { startX: e.clientX - rect.left, startY: e.clientY - rect.top });
      setDims((prev) => ({ ...prev, startX: e.clientX - rect.left, startY: e.clientY - rect.top }));
    }
    if (e.altKey) setIsBlurring(() => true);
    if (!e.shiftKey && e.button === 0 && selectedOption === "draw") {
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
      setIsDrawing(() => true);
      return;
    }
    if (!e.shiftKey && e.button === 0) {
      if (shape === "circle") setCircleStart((prev) => ({ ...prev, startX: e.clientX - rect.left, startY: e.clientY - rect.top }));
      if (shape === "rectangle") setRectStart((prev) => ({ ...prev, startX: e.clientX - rect.left, startY: e.clientY - rect.top }));
      return;
    }
  }
  
  const handleMouseMove = (e) => {
    const canvas = imgRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    if (e.shiftKey) {
      if (shape === "circle") {
        const width = currentX - circleStart.startX / 2;
        const height = currentY - circleStart.startY / 2;
        renderCircle({ width, height, currentX, currentY, canvas }, isShapeFilled)
        return;
      }
      if (shape === "rectangle") {
        const width = currentX - rectStart.startX;
        const height = currentY - rectStart.startY;
        setRectStart((prev) => ({ ...prev, width, height, endX: currentX, endY: currentY, ...textOptions }));
        renderRect({ width, height }, canvas, isShapeFilled)
        
        // else ctx.stroke(rectStart.startX, rectStart.startY, width, height);
      }
    }
    if (isDrawing) renderLine({ currentX, currentY }, canvas);
    if (isCropping) {
      setDims((prev) => ({ ...prev, endX: currentX, endY: currentY }));
      ctx.beginPath()
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
      const width = currentX - dims.startX;
      const height = currentY - dims.startY;
      ctx.fillStyle = 'transparent';
      ctx.strokeStyle = 'navy';
      ctx.lineWidth = 2;
      ctx.fillRect(dims.startX, dims.startY, width, height);
      ctx.strokeRect(dims.startX, dims.startY, width, height);
    }
    if (isBlurring) {
      setDims((prev) => ({ ...prev, endX: currentX, endY: currentY }));
      ctx.beginPath()
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
      const width = currentX - dims.startX;
      const height = currentY - dims.startY;
      ctx.fillStyle = 'transparent';
      ctx.strokeStyle = 'transparent';
      ctx.lineWidth = 2;
      ctx.fillRect(dims.startX, dims.startY, width, height);
      ctx.strokeRect(dims.startX, dims.startY, width, height);
    }
  }

  const handleMouseUp = (e) => {
    if (e.ctrlKey) {
      setIsCropping(() => false);
      setShowControls(() => "crop")
    }
    if (e.altKey) {
      setIsBlurring(() => false);
      setShowControls(() => "obfuscate")
    }
    if (e.button === 0) {
      setIsDrawing(() => false);
      saveCurrentImageState();
      // addDrawingToCanvas();
    }
    if (e.shiftKey && e.button === 0) {
      if (shape === "circle") {
        setCircles((prev) => [...prev, { ...circleStart, ...textOptions }]);
        saveCurrentImageState();
      }
      if (shape === "rectangle") {
        setRects((prev) => [...prev, { ...rectStart, ...textOptions }]);
        if (!isShapeFilled) imgRef.current.getContext('2d').strokeRect(rectStart.startX, rectStart.startY, rectStart.width, rectStart.height);
        saveCurrentImageState();
      }
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

  const acceptBlur = () => {
    stopCrop();
    const canvas = imgRef.current;
    const ctx = canvas.getContext('2d');
    const { startX, startY, endX, endY } = dims;
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);
    const x = Math.min(startX, endX);
    const y = Math.min(startY, endY);
    // Create offscreen canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.strokeStyle = "transparent"
    tempCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
    tempCtx.filter = `blur(${obfuscation}px)`;
    tempCtx.drawImage(tempCanvas, 0, 0);
    tempCtx.filter = 'none';
    ctx.drawImage(tempCanvas, x, y);
    setShowControls(() => "")
    saveCurrentImageState();
  }

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
        id="canvas"
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
            <input type="color" name="stroke" id="stroke" onChange={e => setTextOptions((prev) => ({ ...prev, strokeStyle: e.target.value }))} />
            <span style={{ fontSize: "10px" }}>{textOptions.strokeStyle}</span>
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
            <label style={{ fontSize: "10px" }} htmlFor="stroke">Stroke line</label>
            <input type="color" name="stroke" id="stroke" onChange={e => setTextOptions((prev) => ({ ...prev, strokeStyle: e.target.value }))} />
            <span style={{ fontSize: "10px" }}>{textOptions.strokeStyle}</span>
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
          <div className="draw-item">
            <button className="text-undo-btn" onClick={undo}>Undo</button>
          </div>
        </div>
      )}
      {selectedOption === "shapes" && (
        <div className="shapes-controls">
          <div className="shapes-item">
            <label style={{ fontSize: "10px" }} htmlFor="shape">Add shape</label>
            <select value={shape} name="shape" id="shape" onChange={e => setShape(() => e.target.value)}>
              <option value="" disabled>--Select one--</option>
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
            </select>
          </div>
          <div className="shapes-item-checkline">
            <input
              type="checkbox"
              name="isShapeFilled"
              id="isShapeFilled"
              value={isShapeFilled}
              checked={isShapeFilled}
              onChange={e => setIsShapeFilled((prev) => !prev)}
              />
            <label htmlFor="isShapeFilled" style={{ userSelect: "none" }}>The shape is {isShapeFilled ? "filled" : "stroked"}.</label>
          </div>
          <div className="draw-item">
            <label style={{ fontSize: "10px" }} htmlFor="stroke">Shape stroke</label>
            <input type="color" name="stroke" id="stroke" onChange={e => setTextOptions((prev) => ({ ...prev, strokeStyle: e.target.value }))} />
            <span style={{ fontSize: "10px" }}>{textOptions.strokeStyle}</span>
          </div>
          <div className="draw-item">
            <label style={{ fontSize: "10px" }} htmlFor="fill">Shape fill</label>
            <input type="color" name="fill" id="fill" onChange={e => setTextOptions((prev) => ({ ...prev, fill: e.target.value }))} />
            <span style={{ fontSize: "10px" }}>{textOptions.fill}</span>
          </div>
        </div>
      )}
      {showControls === "obfuscate" && (
        <div className="blur-controls">
          <span>Obfuscate image?</span>
          <label htmlFor="blur">Blur</label>
          <input min={5} max={100} step={1} type="number" value={obfuscation} onChange={e => setObfuscation(() => parseInt(e.target.value))} name="blur"  id="blur" />
          <button onClick={acceptBlur} className="button">&#10003; Yes</button>
          <button onClick={cancelCrop} className="button">&#10539; No</button>
        </div>
      )}
      {selectedOption === "resize" && (
        <div className="resize-controls">
          <div className="resize-item">
            <label style={{ fontSize: "10px" }} htmlFor="wdt">Width</label>
            <input
              type="number"
              onChange={e => setSize((prev) => ({ ...prev, width: parseInt(e.target.value) }))}
              value={size.width}
              min={50}
              max={5000}
              step={1}
              name="wdt"
              id="wdt"
            />
            <span style={{ fontSize: "10px" }}>{size.width}px</span>
          </div>
          <div className="resize-item">
            <label style={{ fontSize: "10px" }} htmlFor="hght">Height</label>
            <input
              type="number"
              onChange={e => setSize((prev) => ({ ...prev, height: parseInt(e.target.value) }))}
              value={size.height}
              min={50}
              max={5000}
              step={1}
              name="hght"
              id="hght"
            />
            <span style={{ fontSize: "10px" }}>{size.height}px</span>
          </div>
          <button onClick={resizeCanvas} className="button">Resize</button>
        </div>
      )}
    </div>
  )
}

export default ImageContainer;
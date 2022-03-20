import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import axios from 'axios';
import MultiRangeSliderH from "./multiRangeSliderH";
import MultiRangeSliderS from "./multiRangeSliderS";
import MultiRangeSliderV from "./multiRangeSliderV";

function App() {
  //変数とState////////////////////////////////////////////////////
  const [Image, setImage] = useState(null);
  const [uploadImage, setUploadImage] = useState(null);
  const [hsvImage, setHSVImage] = useState(null);
  const [Mask, setMask] = useState(null);

  const [H, setH] = useState(0);
  const [S, setS] = useState(0);
  const [V, setV] = useState(0);
  const [H_, setH_] = useState(179);
  const [S_, setS_] = useState(255);
  const [V_, setV_] = useState(255);
  
  const imageData = Image
  const uploadImageData = uploadImage
  const MaskData = Mask
  
  //関数//////////////////////////////////////////////////////////
  const reload = () => {
    setImage(null);
    setUploadImage(null);
    setHSVImage(null);
    setMask(null);
    setH(0);
    setH_(255);
    setS(0);
    setS_(255);
    setV(0);
    setV_(255);
  }

  const handleImage = (e) => {
    const files = e.target.files;
    if(files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
          setImage(e.target.result)
      };
      reader.readAsDataURL(file);
      setUploadImage(file);
    } else {
      setImage(null);
      setUploadImage(null);
    };
  }

  const toHSVfunc = () => {
    const formData = new FormData();
    formData.append("image", uploadImageData, "test.png");
    axios({
      method: "post",
      url: "/api/toHSV",
      data: formData,
    }).then((response) => {setHSVImage(response.data)})
  };

  const toMaskfunc = (H,H_,S,S_,V,V_) => {
    const formDatas = new FormData();
    formDatas.append("img", uploadImageData, "test.png");
    formDatas.append("hsvLower", `[${H}, ${S}, ${V}]`);
    formDatas.append("hsvUpper", `[${H_}, ${S_}, ${V_}]`);
    console.log({H},{S},{V},{H_},{S_},{V_})
    axios({
      method: "post",
      url: "/api/toMask",
      data: formDatas,
    }).then((response) => {setMask(response.data)})
  };

  const handleSubmit = () => {
    if (Image != null) {
    toHSVfunc();
    toMaskfunc(H,H_,S,S_,V,V_);
    } else {
      alert("Drag & Drop, or select an image file!")
    }
  };
  const handleMultiH = ({min,max}) => {
    setH(min);
    setH_(max);
    toMaskfunc(min,max,S,S_,V,V_);
  }
  const handleMultiS = ({min,max}) => {
    setS(min);
    setS_(max);
    toMaskfunc(H,H_,min,max,V,V_);
  }
  const handleMultiV = ({min,max}) => {
    setV(min);
    setV_(max);
    toMaskfunc(H,H_,S,S_,min,max);
  }

  //描画//////////////////////////////////////////////////////////

  var UpperPage1 = (<div>
    <div className='UpperPage'>
    <p>Drag & Drop, or select a file</p>
    <input className="input" type="file" accept="image/*" onChange={event => handleImage(event)}></input><br></br></div>
    </div>);
  var UpperPage2 = (<div className='UpperPage'>
    <button className='reloadBotton' onClick={reload}>Start Over</button>
    </div>);
  var LowerPage1 = (<img src={logo} className="App-logo" alt="logo" />);
  var LowerPage2 = (<img className="photo" src={imageData} alt={imageData} />);
  var LowerPage3 = (<div>
    <p>Original / Mask (Controllable) / HSV</p>
    <img className="photolist" src={imageData} alt={imageData} />
    <img className="photolist" src={`data:image/png;base64,${MaskData}`} alt={MaskData} />
    <img className="photolist" src={`data:image/png;base64,${hsvImage}`} alt={hsvImage} />
  </div>);
  var rangeslider1 = (<div>
    <br></br>
    <button className="submitButton" onClick={handleSubmit}>Let's Colorful !</button>
    <br></br>
  </div>);
  var rangeslider2 = (<div className="Box">
      <div className="Sliders">
        <p className="SliderName">H</p>
        <MultiRangeSliderH min={0} max={179} onChange={({ min, max }) => console.log({min,max})} onClick={({ min, max }) => handleMultiH({min,max})} />
      </div>
      <div className="Sliders">
        <p className="SliderName">S</p>
        <MultiRangeSliderS min={0} max={255} onChange={({ min, max }) => console.log({min,max})} onClick={({ min, max }) => handleMultiS({min,max})} />
      </div>
      <div className="Sliders">
        <p className="SliderName">V</p>
        <MultiRangeSliderV min={0} max={255} onChange={({ min, max }) => console.log({min,max})} onClick={({ min, max }) => handleMultiV({min,max})} />
      </div>
    </div>);

  var UpperPage = (UpperPage1)
  var LowerPage = (LowerPage1)
  var rangeslider = (rangeslider1)
  if (imageData != null) {
    UpperPage = (UpperPage2);
    LowerPage = (LowerPage2)
  };
  if (MaskData != null) {
    UpperPage = (UpperPage2);
    LowerPage = (LowerPage3);
    rangeslider = (rangeslider2)
  };


  //return//////////////////////////////////////////////////////////


  return (
    <div className="App">
      <body className="App-header">

        <h1>Colorful Pathology</h1>

        {UpperPage}
        {LowerPage}
        {rangeslider}
        <br></br>
        <p>Python Server Status: <span id="server"> </span></p>
      </body>
      
      <footer id="footer">
        Copyright© 2022- Kenji Harada All Rights Reserved.<br></br><br></br>
      </footer>
    </div>
  );
}


export default App;
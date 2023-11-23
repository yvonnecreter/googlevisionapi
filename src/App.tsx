import React from 'react';
import { useState } from 'react';
import './App.css';
import axios from 'axios';

const APIKey = "AIzaSyDpkqVcuwpwkwD9KYM7ksPM9D06hcUkoIQ";
const APIURL = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDpkqVcuwpwkwD9KYM7ksPM9D06hcUkoIQ";

const App = () => {
  let savedFileName = "";

  const imageUpload = (e: any) => {
    const file = e.target.files[0];
    getBase64(file).then(base64 => {
      localStorage["fileBase64"] = base64;
      savedFileName = file.name;
    });
  };

  const downloadOutput = async () => {
    let out = dataURLtoFile(localStorage["fileBase64"], savedFileName);
    const url = window.URL.createObjectURL(out);
    const link = document.createElement('a');
    link.href = url;
    let result = savedFileName;
    let savedFile = localStorage["fileBase64"].split(',')[1];

    const requestData = {
      requests: [
        {
          image: {
            content: savedFile
            // source: {
            //   imageUri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogospng.org%2Fdownload%2Fcoca-cola%2Flogo-coca-cola-4096.png&f=1&nofb=1&ipt=3fa7cec9f3780b920188c7abcbdb7d258478fc174f7c26c2f6103ace152993fa&ipo=images"
            // }
          },
          features: [{
            type: "LOGO_DETECTION", maxResults: 1
          }]
        }]
    };
    const apiResponse = await axios.post(APIURL, requestData);
    result = apiResponse.data.responses[0].logoAnnotations[0].description;

    link.download = "" + result; //filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }



  return (
    <div className="App">
      <div className='spacer'></div>
      <h1 className='glowtext'>Rename Images to Logoname AI</h1>
      <div className='spacer'></div>

      <input
        type="file"
        id="imageFile"
        name='imageFile'
        onChange={imageUpload} />

      <div className='spacer'></div>
      <button onClick={downloadOutput}>Download</button>
    </div>
  );
}

const getBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

function dataURLtoFile(dataurl: any, filename: string) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}



export default App;


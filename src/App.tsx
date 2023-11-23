import React from 'react';
import { useState } from 'react';
import './App.css';
import axios from 'axios';

const APIKey = "AIzaSyDpkqVcuwpwkwD9KYM7ksPM9D06hcUkoIQ";
const APIURL = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDpkqVcuwpwkwD9KYM7ksPM9D06hcUkoIQ";

const App = () => {
  // let savedFiles: any = [];
  const savedFiles: any = useState([]);

  const imageUpload = (e: any) => {
    try {
      // var temp: any = [];
      // if (savedFiles.length > 0) {
      const fileList = Array.from(e.target.files);
      fileList.forEach((file: any) => {
        getBase64(file).then(base64 => {
          savedFiles.push({ img: base64, name: file.name })
        });
      })
      // setSavedFiles(savedFiles);
      // }
    } catch (error) {
      console.error(error)
    }
  };

  const downloadOutput = async () => {
    // if (savedFiles.length > 0) {
    savedFiles.forEach(async (file: any) => {
      try {
        let out = dataURLtoFile(file.img, file.name);
        const url = window.URL.createObjectURL(out);
        const link = document.createElement('a');
        link.href = url;
        let result = file.name;
        let savedFile = file.img.split(',')[1];
        const requestData = {
          requests: [
            {
              image: {
                content: savedFile
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
      } catch (error) {
        console.error(error)
      }
    })
    // setSavedFiles([]);
    // }
  }



  return (
    <div className="App">
      <div className='spacer'></div>
      <div className="headersection">
        <h1 className='glowtext head1'>AI Batch Rename</h1>
        <h3 className='glowtext head3'>Images to Logoname</h3>
      </div>
      <div className='spacer'></div>
      <div className='spacer'></div>
      <div className='center'>
        <input
          type="file"
          id="imageFile"
          name='imageFile'
          onChange={imageUpload}
          multiple />
        <div className='spacer'></div>
        <button onClick={downloadOutput}>Convert</button>
      </div>
      <p className="credits">Made by Yvonne Creter, using Google Vision</p>
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


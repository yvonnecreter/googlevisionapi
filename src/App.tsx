import React from 'react';
import { useState } from 'react';
import './App.css';
import axios, { AxiosError } from 'axios';

const APIKey = "AIzaSyDpkqVcuwpwkwD9KYM7ksPM9D06hcUkoIQ";
const APIURL = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDpkqVcuwpwkwD9KYM7ksPM9D06hcUkoIQ";

const App = () => {
  var savedFiles: any = [];
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

  const imageUpload = (e: any) => {
    try {
      const fileList = Array.from(e.target.files);

      fileList.forEach((file: any) => {
        if (allowedTypes.includes(file?.type)) {
          getBase64(file).then(base64 => {
            savedFiles.push({ img: base64, name: file.name })
          });
        } else {
          alert("Only JPEG, PNG, and GIF images are allowed.");
          savedFiles = [];
          window.location.reload();
        }
      })
    } catch (error) {
      alert(JSON.stringify(error));
      console.error(error);
      savedFiles = [];
      window.location.reload();
    }
  };

  var failed = false;

  const downloadOutput = async () => {
    let v = document.getElementById("imageFile") as HTMLInputElement;
    if (v.value == null || v.value == "") {
      alert("no files selected")
    } else {
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
          failed = true;
          alert(JSON.stringify(error));
          const err = error as AxiosError;
          err?.request.responseText == "Request payload size exceeds the limit: 41943040 bytes." && alert("file too big")
        }
      })
      savedFiles = [];
    }
  }



  return (
    <div className="App">
      <div className="navbar"> <h1 className='head1'>Google Vision AI Toolbox</h1>
        <a href="logorenamer">Logo Renamer</a>
      </div>
      <hr className="solid"></hr>
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
      <p className='description'>
        Simple Webinterface to Tag Pictures with the Logos found in it. <br />  The Website will communicate with google vision to detect the most propable logo in the image and rename it.  <br />
        <br />  Choose your Files with the first button and click the second to convert and download<br />  <br /> Make sure multiple downloads on this site are enabled when you are selecting more than one.
      </p>
      <p className="credits">Made by Yvonne Creter, using Google Vision</p>
    </div >
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


import React, { useState, useRef } from 'react';
import axios from 'axios';

const Home = () => {
  const photo = useRef(null);
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = () => {
    photo.current.click();
  };

  const handlePhoto = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };

  const processButton = async () => {
    if (!image) return;
    
    const apiKey = "C1wU3rKjK9hmYlk2LrnkaPibrzpeyqc5ufd2QnmVW9EkcyYH4IcEJQQJ99BAACGhslBXJ3w3AAAFACOGmAf3"; // Replace with your actual key
    const endpoint = "https://navaneeth.cognitiveservices.azure.com/";
    
    const formData = new FormData();
    formData.append('file', image);

    setIsProcessing(true);
    setText("Processing...");

    try {
      // Step 1: Submit image for reading
      const submitResponse = await axios.post(
        `${endpoint}/vision/v3.2/read/analyze`,
        formData,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': apiKey,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Get operation location from response headers
      const operationLocation = submitResponse.headers['operation-location'];

      // Step 2: Poll for result
      let status = 'running';
      let result;
      while (status === 'running' || status === 'not started') {
        const pollResponse = await axios.get(operationLocation, {
          headers: {
            'Ocp-Apim-Subscription-Key': apiKey
          }
        });

        status = pollResponse.data.status;
        result = pollResponse.data;

        if (status === 'succeeded') break;
        
        // Wait between polls
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Extract text from successful result
      if (result.analyzeResult && result.analyzeResult.readResults) {
        const extractedText = result.analyzeResult.readResults
          .map(page => 
            page.lines.map(line => line.text).join(' ')
          )
          .join('\n');

        setText(extractedText);
      } else {
        setText("No text could be recognized.");
      }
    } catch (error) {
      console.error("Error processing the image", error);
      setText("Error recognizing text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center bg-red-500" style={{ height: "15vh" }}>
        <h1 className="text-5xl font-bold">Handwriting Recognition</h1>
      </div>
      <div className="flex justify-center items-center bg-blue-200" style={{ height: "85vh" }}>
        <div className="flex flex-col items-center">
          <input
            className="hidden"
            onChange={handlePhoto}
            type="file"
            ref={photo}
            accept="image/*"
          />
          <button 
            className="hover:bg-violet-700 p-2 bg-violet-500 font-bold"
            onClick={handleClick}
          >
            Select Image
          </button>
          {image && (
            <>
              <img
                className="mt-10"
                src={URL.createObjectURL(image)}
                width="300"
                onClick={handleClick}
                alt="Selected"
              />
              <button 
                className="mt-10 bg-blue-500 p-3 hover:bg-blue-700" 
                onClick={processButton}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Process'}
              </button>
            </>
          )}
        </div>
        <div className="flex ml-10 bg-yellow-50 p-5 outline outline-4 outline-blue-800 max-w-md">
          <p>{text}</p>
        </div>
      </div>
    </>
  );
};

export default Home;
import React, { useState, useRef } from 'react';
import axios from 'axios'; // Optional if you prefer axios for API calls

const Home = () => {
  const photo = useRef(null);
  const [image, setImage] = useState(null);
  const [text, setText] = useState(""); // To store recognized text

  const handleClick = () => {
    photo.current.click();
  };

  const handlePhoto = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };

  const processButton = async () => {
    if (!image) return;

    const apiKey = "C1wU3rKjK9hmYlk2LrnkaPibrzpeyqc5ufd2QnmVW9EkcyYH4IcEJQQJ99BAACGhslBXJ3w3AAAFACOGmAf3"; // Replace with your Azure API key
    const endpoint = "https://navaneeth.cognitiveservices.azure.com/"; // Replace with your Azure endpoint

    // Create FormData to send the image file
    const formData = new FormData();
    formData.append("file", image);

    try {
      // Call the Azure OCR API
      const response = await axios.post(`${endpoint}/vision/v3.2/ocr`, formData, {
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          "Content-Type": "multipart/form-data",
        },
      });

      // Process the OCR response
      const ocrText = response.data.regions
        .map((region) =>
          region.lines
            .map((line) => line.words.map((word) => word.text).join(" "))
            .join("\n")
        )
        .join("\n");

      setText(ocrText); // Set the extracted text in the state
    } catch (error) {
      console.error("Error processing the image", error);
      setText("Error recognizing text. Please try again.");
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
            className="hover:bg-violet-700 p-2 bg-violet-500 font-bold"
            onChange={handlePhoto}
            type="file"
            ref={photo}
          />
          {image && (
            <>
              <img
                className="mt-10"
                src={URL.createObjectURL(image)}
                width="300"
                onClick={handleClick}
                alt="Selected"
              />
              <button className="mt-10 bg-blue-500 p-3 hover:bg-blue-700" onClick={processButton}>
                Process
              </button>
            </>
          )}
        </div>
        <div className="flex ml-10 bg-yellow-50 p-50 outline outline-4 outline-blue-800">
          <p>{text ? text : "No text recognized yet."}</p>
        </div>
      </div>
    </>
  );
};

export default Home;

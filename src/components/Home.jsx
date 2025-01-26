import React from 'react';

const Home = () => {

  const handleClick = () => {
    alert("Button clicked!");
  };
  
  return (
    <>
      <div className="flex items-center justify-center bg-red-500" style={{ height: '15vh' }}>
        <h1 className="text-5xl font-bold">HandWriting Recognition</h1>
      </div>
      <div class="flex justify-center items-center bg-blue-200" style={{height: '85vh'}}>
        <button onClick={handleClick} class="hover:bg-violet-700 p-2 bg-violet-500 font-bold">Upload a Photo</button>
        <div class="flex ml-10 bg-yellow-50 p-50 outline outline-4 outline-blue-800">
          <h2>Output</h2>
        </div>
      </div>
    </>

  );
};

export default Home;

import React,{useState,useRef} from 'react';

const Home = () => {

  const photo = useRef(null);
  const [image,setimage] = useState(null);

  const handleclick = () => {

    photo.current.click();

  }

  const handlephoto = (event) => {

    const image = event.target.files[0];
    setimage(image)

  }

  const processbutton = () => {


  }
  
  return (
    <>
      <div className="flex items-center justify-center bg-red-500" style={{ height: '15vh' }}>
        <h1 className="text-5xl font-bold">HandWriting Recognition</h1>
      </div>
      <div class="flex justify-center items-center bg-blue-200" style={{height: '85vh'}}>

        <div class="flex flex-col items-center">
          <input class="hover:bg-violet-700 p-2 bg-violet-500 font-bold" onChange={handlephoto} type='file' ref={photo}/>
          {image && (
            <>
              <img
              class="mt-10"
              src={URL.createObjectURL(image)}
              width="300"
              onClick={handleclick}
              />
              <button class="mt-10 bg-blue-500 p-3 hover:bg-blue-700" onClick={processbutton}>Process</button>
            </>
          )}
        </div>
        <div class="flex ml-10 bg-yellow-50 p-50 outline outline-4 outline-blue-800">
          <h2>Output</h2>
        </div>

      </div>
    </>

  );
};

export default Home;

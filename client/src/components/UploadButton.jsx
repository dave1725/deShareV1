import { useAddress } from '@thirdweb-dev/react';
import React, { useState,useRef } from 'react';
import { FiFile } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useContract, useContractWrite, useContractRead } from '@thirdweb-dev/react';
import { Web3 } from 'web3';
import axios from 'axios';

const web3 = new Web3(window.ethereum);

const UploadButton = ({ onFileData }) => {
  const sender = useAddress();
  const { contract } = useContract("0xf1725A52E1543c37e45DdB28d3cc63bbFC11875F");
  const { mutateAsync : addFileToIPFS, isLoading } = useContractWrite(contract,'addFileToIPFS');
  const [files, setFiles] = useState([]);
    const [drop, setDrop] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [fileData,setfileData] = useState(null);
    const inputRef = useRef();

    const handleDragOver = (event) => {
        event.preventDefault();
    }

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFiles = event.dataTransfer.files;
        setFiles([...files, ...droppedFiles]);
        onFileData([...files, ...droppedFiles]);
    }

    const handleFileChange = (event) => {
      const selectedFiles = event.target.files;
      setFiles([...files, ...selectedFiles]);
      onFileData([...files, ...selectedFiles]);
    }

    const removeFile = (index) => {
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);
      onFileData(updatedFiles);
  }
  //   const handleDrop = (event) => {
  //     event.preventDefault();
  //     const droppedFiles = event.dataTransfer.files;
  //     setFiles([...files, ...droppedFiles]);
  //     onFileData([...files, ...droppedFiles]);
  // }

  // const handleFileChange = (event) => {
  //     const selectedFiles = event.target.files;
  //     setFiles([...files, ...selectedFiles]);
  //     onFileData([...files, ...selectedFiles]);

  // const file = event.target.files;
  // if (file.length > 0) {
  //     const reader = new FileReader();
  //     reader.onload = function (fileEvent) {
  //         const fileData = fileEvent.target.result;
  //         console.log(fileData);
  //     };
  //     reader.readAsText(file[0]);
  // }
  // }
  // const handleFileUpload = async (event) => {
  //   event.preventDefault();
  //   const balance = await web3.eth.getBalance(address);

  //   if (balance === 0n) {
  //     return alert("Your Wallet has no funds!");
  //   }
  //   if (files.length === 0) {
  //     return alert("Please upload a file");
  //   }
  //   if (files.length > 0) {
  //     const reader = new FileReader();
  //     reader.onload = function (fileEvent) {
  //       const f = fileEvent.target.result;
  //       setFileData(f);
  //       console.log(fileData);
  //       //   axios.post("http://localhost:5000/share", { fileData : f})
  //       //   .then(async (res) => {
  //       //     const cid = res.data.cid;
  //       //     console.log(cid);
  //       //     console.log(sender,recieverAddress);
  //       //     const data = await addFileToIPFS({ args: [sender,recieverAddress,cid] });
  //       //     console.log(data);
  //       //   })
  //       //   .catch(err => {
  //       //     console.log(err);
  //       //   })
  //     };
  //     reader.readAsDataURL(fileData[0]);

  //   }
  // }

  const handleOpen = () =>{
    setIsOpen(true);
  }

  const uploads = () =>{
    console.log(files[0]);
    if (files.length > 0) {
          const reader = new FileReader();
          reader.onload = function (fileEvent) {
            const f = fileEvent.target.result;
            setfileData(f);
            console.log(fileData);
            axios.post("http://localhost:5000/share", { fileData : f})
            .then(async (res) => {
              const cid = res.data.cid;
              console.log(cid);
              console.log(sender);
              const data = await addFileToIPFS({ args: [sender,cid] });
              console.log(data);
            })
            .catch(err => {
              console.log(err);
            })
          };
          reader.readAsDataURL(files[0]);
        }
  }
// 
  return (
    <>
      <button
        className="fixed bottom-4 right-20 rounded-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-700 text-white font-bold focus:outline-none shadow-md hover:bg-orange-500 z-50" // Added z-index: 50
        onClick={handleOpen}
      >
        Upload
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-500/50 dark:bg-black/50 backdrop-blur-sm flex justify-center items-center z-50" // Added z-index: 60
        >
           {!drop && (
                <div className="flex flex-col h-[400px] justify-center items-center font-code border-neutral-400 border-2 border-dashed p-3"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <h4 className="text-white text-xl">Drag and drop to upload</h4>
                    <h6 className='text-sxl'>or</h6>
                    <input
                        type="file"
                        hidden
                        multiple
                        onChange={handleFileChange}
                        ref={inputRef}
                    />
                    <button onClick={() => inputRef.current.click()} className="bg-gray-700 w-24 h- px-2 rounded-md border-gray-400 border-2">upload</button>
                </div>
            )}
          {!drop && (
                <div className="overflow-x-auto Whitespace-nowrap">
                    <div className="flex overflow-x-auto" >
                        {files.map((file, index) => (
                            <div key={index} className="file-item border-[1px] border-zinc-500 bg-zinc-700 text-white p-2 rounded-md m-1 flex items-center justify-between">
                            <div className="file-info flex items-center gap-2">
                                <FiFile className="text-zinc-200" /> {/* File icon */}
                                <span className="file-name text-xs text-zinc-200">{file.name}</span>
                            </div>
                            <button className="remove-button" onClick={() => removeFile(index)}>
                                <RxCross2 className="text-zinc-200 hover:text-red-500" />
                            </button>
                        </div>
                        ))}
                    </div>
                </div>
            )}

          <button onClick={uploads} className="rounded-md bg-orange-700 p-3">   upload
          </button>
        </div>
      )}
    </>
  );
};

export default UploadButton;

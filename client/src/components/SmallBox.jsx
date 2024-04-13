import React, { useState,useEffect } from 'react'
import Button from './Button'
import { useContract, useAddress, useContractRead } from "@thirdweb-dev/react";

export const SmallBox = () => {
  const address = useAddress();
  const [status, setStatus] = useState(false);
  const [files,setFiles] = useState([]);
  const [length,setlength] = useState();
  const { contract,isLoading } = useContract("0x386768EafD1dBa8Bee54998E60121DBd3A8B7B73");

  //const { mutateAsync : getFiles, isLoading } = useContractRead(contract,"getFiles");

  useEffect(() => {
    const checkUploadsForAccount = async () => {
      if(!isLoading){
        const data = await contract.call("getFiles", [address]);
        if (data.length <= 0) {
          setStatus(false);
        } else {
          setFiles(data);
          setStatus(true);
        }
      }
    };
    checkUploadsForAccount();
  }, [address, contract]);

  const bytes32ToDecimal = (bytes32Hex) => {
    if (bytes32Hex.startsWith('0x')) {
        bytes32Hex = bytes32Hex.slice(2);
    }
    let result = BigInt('0x' + bytes32Hex);
    return result.toString();
  }

  const decimalToUTC = (decimalTimestamp) => {
    const timestampMilliseconds = decimalTimestamp * 1000;
    const date = new Date(timestampMilliseconds);
    const utcString = date.toUTCString();
    return utcString;
  }

  const convertUTC = (bytes32) => {
    const decimal = bytes32ToDecimal(bytes32);
    const utcDateTime = decimalToUTC(decimal); // Get the UTC date and time string
    const utcDate = new Date(utcDateTime); // Convert UTC string to a Date object
    const istDate = utcDate.toLocaleString('en-US', {timeZone: 'Asia/Kolkata'}); // Convert to IST
    return istDate;
  }

  const checkUploadsForAccount = async () =>{
    const { data,isLoading } = await contract.call("getFiles",[address]);
    console.log(isLoading);
    if(data.length<=0){
      setStatus(false);
    }
    else{
      setFiles(data);
      setlength(data.length);
      setStatus(true);
    }
  }
  //checkUploadsForAccount();

  const handleClick = async (event,index) => {
    event.preventDefault();
    //const data = await contract.call("getFiles",[address]);
    setFiles(data);
    console.log(files);
    const _cid = files[index].cid;
    const _receiver = files[index].receiver;
    const _timestamp = convertUTC(files[index].timestamp);
    return console.log(`CID: ${_cid}\nReceiver: ${_receiver}\nTimeStamp: ${_timestamp}`);
  }

  return (
    // <div className="w-2/5 px-2 py-5 bg-neutral-800 rounded-md mx-4 my-2 flex justify-end">
    //     content

    // </div>
    <>
    {status ? (
      files ?
      files.map((file,index) => (
        <Button key={index} className="w-2/5 px-2 py-5 bg-neutral-800 rounded-md mx-4 my-2 flex justify-end" onClick={(event)=>handleClick(event,index)}>
          Document{index+1}
        </Button>
      )) : (
        <p>Loading!</p>
      )
    ) : address ? (
      <p>No Uplos!</p>
    ): (
      <p>Connect Wallet!</p>
    )}
    </>
  )
}

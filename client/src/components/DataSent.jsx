import React from 'react'
import axios from "axios";
import { useEffect,useState } from "react";
import { useContract, useAddress, useContractRead } from "@thirdweb-dev/react";

const DataSent = () => {
  const { contract,isLoading } = useContract("0x386768EafD1dBa8Bee54998E60121DBd3A8B7B73"); //contract address
  const address = useAddress();
  console.log(address);
  const [msg, setMsg] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if(!isLoading){
        const data = await contract.call("getFiles",[address]);
        setMsg(data);
        console.log(msg.length);
        // const _cid = msg[0].cid;
        // const _receiver = msg[0].receiver;
        // const _timestamp = convertUTC(msg[0].timestamp);
        // return console.log(`CID: ${_cid}\nReceiver: ${_receiver}\nTimeStamp: ${_timestamp}`);
      }
    };
    fetchData();
  }, [address,contract]);

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


  return (
    <div className='border-2 border-white'>
    { !(msg.length === 0) ?
      msg.map((item, index) => (
        <div key={index}>
          <div>Receiver : {item.receiver}</div>
          <p>cid : {item.cid}</p>
          <div>TimeStamp : {convertUTC(item.timestamp)}</div>
        </div>
      )) : address ? (
        <p>No Uploads!!</p>
      ) : (
        <p>Connect Wallet!!</p>
      )
    }
  </div>
  )
}

export default DataSent;


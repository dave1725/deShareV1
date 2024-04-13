import React from 'react'
import Button from './Button'
import Section from './Section'
import {Dragendrop} from './Dragendrop'
import { Address, isValidChecksumAddress } from 'ethereumjs-util';
import { useContract, useContractWrite, useContractRead, useAddress } from '@thirdweb-dev/react';
import { Web3 } from 'web3';
import axios from "axios";

const web3 = new Web3(window.ethereum);

export const RightBox = () => {
    const { contract } = useContract("0x386768EafD1dBa8Bee54998E60121DBd3A8B7B73");
    const { mutateAsync : addFileToIPFS, isLoading } = useContractWrite(contract,'addFileToIPFS');
    
    const [fileData, setFileData] = React.useState(null);
    const [data, setData] = React.useState("");
    const [recieverAddress, setReceiverAddress] = React.useState('');

    const sender = useAddress();

    const handleFileData = (data) => {
        setFileData(data);
    }

    const uploadCID = () => {
      
    }

    const upload = async ( event ) =>{
        event.preventDefault();
        const balance = await web3.eth.getBalance(sender);

        if(balance === 0n){
          return alert("Your Wallet has no funds!");
        }
        const isValid = localStorage.getItem("status");
        if(fileData === null){
          return alert("Please upload a file");
        }
        if(!isValid){
          return alert("Please enter a wallet address!");
        }

        if (fileData.length > 0) {
          localStorage.removeItem("status");
          const reader = new FileReader();
          reader.onload = function(fileEvent) {
            const f = fileEvent.target.result;
            setFileData(f);
            axios.post("http://localhost:5000/share", { fileData : f})
            .then(async (res) => {
              const cid = res.data.cid;
              console.log(cid);
              console.log(sender,recieverAddress);
              const data = await addFileToIPFS({ args: [sender,recieverAddress,cid] });
              console.log(data);
            })
            .catch(err => {
              console.log(err);
            })
          };
          reader.readAsDataURL(fileData[0]);
        }
    }

    const checkValidAddress = () =>{
      try {
        const isValid = isValidChecksumAddress(recieverAddress);
        if(isValid){
          //disable the button
          localStorage.setItem("status",true);
          alert("Address verified!!");
        }
        else{
          alert("Please verify receiver address!");
        }
      } catch (error) {
        console.log(error);
      }
    }

  return (
    <div className="w-1/2 h-[45rem] mb-5 bg-stone-900 p-2 rounded-md">
        <div className="flex gap-2">
            <input type="text" onChange={(e)=>{setReceiverAddress(e.target.value)}} className="w-full p-3 font-code rounded-md" placeholder="Reciever Id"/>
            <Button onClick={checkValidAddress}>Verify</Button>
        </div>
        <Section 
        className="w-full h-[580px] -mx-2 my-3" 
        crosses
        customPaddings
        id="data"
        >
            <div className="container">
                <Dragendrop onFileData={handleFileData} />
            </div>
        </Section>
        <div className="w-full flex flex-row gap-4">
            <Button onClick={upload} className="w-full content-end flex">Send</Button>
            <Button onClick={uploadCID} className="w-full content-end flex">Send through CID</Button>
        </div>
    </div>
  )
}

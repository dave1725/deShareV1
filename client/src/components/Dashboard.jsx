import { benefits } from "../constants/index";
import Heading from "./Heading";
import Section from "./Section";
import Arrow from "../assets/svg/Arrow";
import ClipPath from "../assets/svg/ClipPath";
import { GradientLight } from "./design/Benefits";
import UploadButton from "./UploadButton";
import { useState,useEffect } from "react";
import { useContract, useContractWrite, useContractRead, useAddress } from '@thirdweb-dev/react';
import { MissingGasInnerError } from "web3";

const Dashboard = () => {
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
    <Section id="features" className="min-h-screen">
      <UploadButton className="fixed bottom-4 right-4 z-100" />
      <div className="container relative z-2">
        <Heading
          className="md:max-w-md lg:max-w-2xl"
          title="Your secured documents"
        />

        <div className="flex flex-wrap z-0 gap-10 mb-10">
          {msg.map((item,index) => (
            <div
              className="block relative z-0 p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]"
              style={{
                backgroundImage: `url(${item.backgroundUrl})`,
              }}
              key={item.id}
            >
              <div className="relative z-2 flex flex-col min-h-[12rem] p-[2.4rem] cursor-pointer">
                <h5 className="h7 mb-5 text-xs">{item.cid}</h5>
                <p className="body-2 mb-6 text-n-3">{convertUTC(item.timestamp)}</p>
                <div className="flex items-center mt-auto">
                  <img
                    src={item.iconUrl}
                    width={48}
                    height={48}
                    alt={item.title} 
                  />
                  <p className="ml-auto font-code text-xs hover:underline font-bold text-n-1 uppercase tracking-wider">
                    Open document
                  </p>
                  <Arrow />
                </div>
              </div>

              {item.light && <GradientLight />}

              <div
                className="absolute inset-0.5 bg-n-8 border-[1px] border-zinc-600"
                style={{ clipPath: "url(#benefits)" }}
              >
              </div>
                
              <ClipPath />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Dashboard;

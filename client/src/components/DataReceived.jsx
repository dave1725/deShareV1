import React from 'react'
import axios from "axios";

const DataReceived = () => {
  const [msg, setMsg] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const receiver = "0x6ad330dd68BeAF54cf4ACd311d91991F8Faa94E9";
      try {
        const resp = await axios.get(`http://localhost:5002/getreceiveData/${receiver}`);
        setMsg(resp.data);
        console.log(resp.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className='border-2 border-white'>
    {
      msg.map((item, index) => (
        <div key={index}>
          <p>{index}</p>
          <div>{item.sender}</div>
          <div>{item.content}</div>
        </div>
      ))
    }
    data
  </div>
  )
}

export default DataReceived;

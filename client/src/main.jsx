import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import "./index.css";
import Share from "./components/Share";
import Hero from "./components/Hero";
import { Polygon } from "@thirdweb-dev/chains";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import Digilocker from "./components/Digilocker";
import Dashboard from "./components/Dashboard"
import ShareService from "./components/ShareService";

const container = document.getElementById("root");
const root = createRoot(container);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='/' element={<Hero/>}/>
      <Route path='/shareService' element={<ShareService/>}/>
      <Route path='/shareService/share' element={<Share/>}/>
      <Route path='/digilocker' element={<Digilocker/>}/>
      <Route path='/digilocker/dashboard' element={<Dashboard/>}/>
    </Route>
  )
)

const customChain = {
  chainId: 80002, 
  rpc: ["https://80002.rpc.thirdweb.com"], 
 
  // Information for adding the network to your wallet (how it will appear for first time users) === \\
  // Information about the chain's native currency (i.e. the currency that is used to pay for gas)
  nativeCurrency: {
    decimals: 18,
    name: "Polygon",
    symbol: "MATIC",
  },
  shortName: "czkevm", // Display value shown in the wallet UI
  slug: "consensys", // Display value shown in the wallet UI
  testnet: true, // Boolean indicating whether the chain is a testnet or mainnet
  chain: "Polygon", // Name of the network
  name: "Polygon Amoy Testnet", // Name of the network
};


root.render(
  <React.StrictMode>
      <ThirdwebProvider
        clientId={import.meta.env.VITE_TEMPLATE_CLIENT_ID}
        activeChain = {customChain}
      >
        <RouterProvider router={router}/>
      </ThirdwebProvider>
  </React.StrictMode>
);

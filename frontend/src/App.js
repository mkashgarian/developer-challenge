import React, { useState } from 'react';
import './App.css';
import SupplyChain from './components/SupplyChain.tsx';
import { createTheme, ThemeProvider } from '@material-ui/core';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3498DB'
    }
  }
})

function App() {

  const [loading, setLoading] = useState(false);
  const [deployState, setDeployState] = useState("Deploy");
  const [contractAddress, setContractAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  async function deployContract() {
    setLoading(true);
    setErrorMsg(null);
    setDeployState("Deploying...")
    try {
      const res = await fetch('/api/contract', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      });
      const {contractAddress : addr, error} = await res.json();
      if (!res.ok) {
        setErrorMsg(error)
        setDeployState("Error! - Retry Deploy");
      } else {
        setContractAddress(addr);
        setDeployState("Redeploy");
      }
    } catch (err) {
      setErrorMsg(err.stack)
      setDeployState("Error! - Retry Deploy");
    }
    setLoading(false);
  }
  

  return (
    <ThemeProvider theme={theme}>
      <SupplyChain/>
    </ThemeProvider>
  );
}

export default App;

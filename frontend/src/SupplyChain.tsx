import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AddProduct from './components/AddProduct';
import AddScore from './components/AddScore';
import ProductSearch from './components/ProductSearch';

const SupplyChain = (props: {contractAddress: string}) => {


    const [value, setValue] = React.useState(0);  
    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
      };


    return (
        <div className='supply-chain'>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                <Tab label="Add a Product" />
                <Tab label="Add a Score" />
                <Tab label="Search for a Product" />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <AddProduct
                contractAddress={props.contractAddress}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <AddScore
                contractAddress={props.contractAddress}
                />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <ProductSearch
                contractAddress={props.contractAddress}
                />
            </TabPanel>
        </div>
    )

}

function TabPanel(props: any) {
    const { children, value, index, ...other } = props;  return (
      <div {...other}>
        {value === index && <Box p={3}>{children}</Box>}
      </div>
    );
  }

export default SupplyChain;
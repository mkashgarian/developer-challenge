import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import AddProduct from './components/AddProduct';
import AddScore from './components/AddScore';
import ProductSearch from './components/ProductSearch';

interface Product  {
  name: string,
  manufacturer: string
}

const SupplyChain = (props: {contractAddress: string}) => {

    const [value, setValue] = React.useState(0);  
    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
      };

    return (
        <div className='supply-chain'>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} centered aria-label="simple tabs example">
                <Tab label="Add a Product" />
                <Tab label="Add a Score" />
                <Tab label="Search for a Product" />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <AddProduct
                  getAllProducts={getAllProducts}
                  checkIfUpcExists={checkIfUpcExists}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <AddScore
                checkIfUpcExists={checkIfUpcExists}
                />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <ProductSearch
                  getProduct={getProduct}
                />
            </TabPanel>
        </div>
    )

    async function getProduct(upc: number) {
      try {
        const productRes = await fetch(`/api/product/${upc}`);
        if(productRes.status === 404) {
          return { status: 'Sorry, the UPC you entered does not exist.', product: null};
        } else if(productRes.status === 200) {
          const res = await productRes.json();
          const product: Product = {name: res.name, manufacturer: res.manufacturer};
          return { status: 'success', product: product};
        } 
        return { status: 'Sorry, there was an error searching.', product: null};
      } catch(err: any) {
        console.log(err);
        return { status: 'Sorry, there was an error searching.', product: null};
      }
    }

    async function getAllProducts() {
      try {
        const productRes = await fetch(`/api/product`);
        if(productRes.status === 200) {
          const products = await productRes.json();
          return { status: 'success', product: products };
        } 
      } catch(err: any) {
        console.log(err);
        return { status: 'Sorry, there was an error searching.', product: null};
      }
    }

    async function checkIfUpcExists(upc: number) {
      try {
        const productRes = await fetch(`/api/${upc}`);
        if(productRes.status === 200) {
          const upcExists = await productRes.json();
          return { status: 'success', exists: upcExists };
        } 
      } catch(err: any) {
        console.log(err);
        return { status: 'Sorry, there was an error.'};
      }
    }
}

function TabPanel(props: any) {
    const { children, value, index, ...other } = props;  return (
      <div {...other}>
        {value === index && <Box p={3}>{children}</Box>}
      </div>
    );
  }

export default SupplyChain;
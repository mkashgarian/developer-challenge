import React, { useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import { Box, Button, makeStyles, TextField, Typography } from '@material-ui/core';


const useStyles = makeStyles({
  field: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    display: 'block'
  },
  box: {
    margin: 10
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  intro: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  alert: {
    marginTop: 20,
    margin: 'auto',
    width: '50%',
    border: '3px solid green',
    padding: '10px'
  }
})

const AddProduct = () => {

    const classes = useStyles();
    const [productName, setProductName] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [upc, setUpc] = useState('');
    const [statusMsg, setStatusMsg] = useState('');
    const [severity, setSeverity] = useState('');

    return (
      <div> 
        <Typography 
          paragraph
          color="textSecondary"
          className={classes.intro}
        >
          Use the form below to add a product at the beginning of the manufacturing process. 
        </Typography>
        <Box className={classes.container}>

          <Box className={classes.box}>
            <TextField
                placeholder="Center Cut Bacon"
                id="outlined-basic" 
                label="Product Name" 
                variant="outlined"
                value={productName}
                onChange={e => setProductName(e.target.value)}
            />
          </Box>
          <Box className={classes.box}>
            <TextField
                placeholder="Oscar Meyer"
                id="outlined-basic" 
                label="Manufacturer" 
                variant="outlined"
                value={manufacturer}
                onChange={e => setManufacturer(e.target.value)}
            />
            </Box>
            <Box className={classes.box}>
            <TextField
                placeholder="284756193816"
                id="outlined-basic" 
                label="UPC" 
                variant="outlined"
                value={upc}
                onChange={e => setUpc(e.target.value)}
            />
            </Box>
              <Box>
              <Button 
                  variant="contained" 
                  color="primary"
                  onClick={submit}
                  type="submit"
              >
                  Submit
              </Button>
              
            </Box>
          </Box>
          {(severity == "success" || severity == "error") &&
            <Alert severity={severity} className={classes.alert}>{statusMsg}</Alert>
          }
          </div>
    )


    async function submit() {
        setStatusMsg('');
        try {
          const res = await fetch(`/api/product`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: productName,
              manufacturer: manufacturer,
              upc: parseInt(upc)
            })
          });
        //   const {productId, error} = await res.json();
        console.log(await res.json());
          if (!res.ok) {
            setSeverity(`error`);
            setStatusMsg(`Uh oh! This product was not able to be added.`);
          } else {
            setSeverity(`success`);
            setStatusMsg(`Success! New product has been added.`);
          }
        } catch(err: any) {
          setStatusMsg(`Uh oh! This product was not able to be added.`);
          // setStatusMsg(err.stack)
        }
      }


}
export default AddProduct;
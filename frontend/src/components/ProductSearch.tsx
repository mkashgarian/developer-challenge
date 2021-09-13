import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';

const ProductSearch = (props: {contractAddress: string}) => {

    const [upc, setUpc] = useState('');
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState(null);
    const [manufacturer, setManufacturer] = useState(null);
    const [statusMsg, setStatusMsg] = useState('');
    const [score, setScore] = useState('');
    const [productionDate, setProductionDate] = useState('');


    return (
        <div className='product-search'>
            <TextField
                id="outlined-basic" 
                label="UPC" 
                variant="outlined"
                value={upc}
                onChange={e => setUpc(e.target.value)}
            />
            <TextField 
                id="outlined-basic" 
                label="Production Date" 
                variant="outlined"
                value={productionDate}
                onChange={e => setProductionDate(e.target.value)}
            />
            <Button variant="contained" color="primary"
                onClick={search}
            >Search</Button>
            {!statusMsg && 
                <div>
                    <div>
                        Product Name is: {productName}
                    </div>
                    <div>
                        Score is: {score}
                    </div>
                </div>
             }
             {statusMsg}
        </div>
    )


    async function search() {
        // setLoading(true);
        setStatusMsg('');
        try {
          const productRes = await fetch(`/api/${props.contractAddress}/product/${upc}`);
          const {manufacturer, name, error} = await productRes.json();
          if (!productRes.ok) {
            setStatusMsg(error);
          } else if(!name || !manufacturer) {
            setStatusMsg(`Sorry, the product ID you entered does not exist.`);
          } else {
            setProductName(name);
            setManufacturer(manufacturer);
            getScore();
          }
        } catch(err: any) {
          setStatusMsg(err.stack)
          console.error(statusMsg);
        }
        // setLoading(false);
      }

    async function getScore() {
        const scoreRes = await fetch(`/api/${props.contractAddress}/score/${productId}/${productionDate}`);
        const {score, error} = await scoreRes.json();
        if(!scoreRes.ok) {
            setStatusMsg(error);
        } else if (score) {
            if(score == -1) {
                setStatusMsg(`No scores have been added for this product with this production date.`);
            }
            setScore(score);
        } 
    }

}

export default ProductSearch;
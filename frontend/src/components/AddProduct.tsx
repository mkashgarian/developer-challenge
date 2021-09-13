import React, { useState } from 'react';

const AddProduct = (props: {contractAddress: string}) => {

    const [productName, setProductName] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [upc, setUpc] = useState('');
    const [statusMsg, setStatusMsg] = useState('');

    return (
        <div className='add-product'>
            Product Name: 
            <input
                value={productName}
                onChange={e => setProductName(e.target.value)}
            />
            Manufacturer: 
            <input
                value={manufacturer}
                onChange={e => setManufacturer(e.target.value)}
            />
            UPC: 
            <input
                value={upc}
                onChange={e => setUpc(e.target.value)}
            />
            <button
                onClick={submit}
            >Submit</button>
            {statusMsg}
        </div>
    )


    async function submit() {
        // setLoading(true);
        setStatusMsg('');
        try {
          const res = await fetch(`/api/${props.contractAddress}/product`, {
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
            // setStatusMsg(error)
          } else {
            setStatusMsg(`Success! New product has been added.`);
          }
        } catch(err: any) {
          setStatusMsg(err.stack)
        }
        // setLoading(false);
      }


}
export default AddProduct;
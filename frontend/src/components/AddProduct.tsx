import React, { useState } from 'react';

const AddProduct = () => {

    const [productName, setProductName] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [statusMsg, setStatusMsg] = useState('');

    return (
        <div>
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
          const res = await fetch(`/api/0x3bcbed1287b4e893d75e83ff7a26d90af21746ca/product`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: productName,
              manufacturer: manufacturer
            })
          });
          const {error} = await res.json();
          if (!res.ok) {
            setStatusMsg(error)
          } else {
            setStatusMsg("Success! New product has been added.");
          }
        } catch(err: any) {
          setStatusMsg(err.stack)
        }
        // setLoading(false);
      }


}
export default AddProduct;
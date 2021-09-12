import React, { useState } from 'react';

const ProductSearch = () => {

    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState(null);
    const [manufacturer, setManufacturer] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    return (
        <div>
            Product ID: 
            <input
                value={productId}
                onChange={e => setProductId(e.target.value)}
            />
            <button
                onClick={search}
            >Search</button>
            {/* {productName &&  */}
                <div>
                    Product Name is: {productName}
                </div>
            {/* } */}
        </div>
    )


    async function search() {
        // setLoading(true);
        setErrorMsg('');
        try {
          const res = await fetch(`/api/0x3bcbed1287b4e893d75e83ff7a26d90af21746ca/product/${productId}`);
          const {manufacturer, name, error} = await res.json();
          if (!res.ok) {
            setErrorMsg(error);
          } else {
            console.log(manufacturer);
            setProductName(name);
            setManufacturer(manufacturer);
          }
        } catch(err: any) {
          setErrorMsg(err.stack)
          console.error(errorMsg);
        }
        // setLoading(false);
      }

}

export default ProductSearch;
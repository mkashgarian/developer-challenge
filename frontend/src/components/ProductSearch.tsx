import React, { useState } from 'react';

const ProductSearch = () => {

    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState(null);
    const [manufacturer, setManufacturer] = useState(null);
    const [statusMsg, setStatusMsg] = useState('');
    const [score, setScore] = useState('');
    const [productionDate, setProductionDate] = useState('');


    return (
        <div className='product-search'>
            Product ID: 
            <input
                value={productId}
                onChange={e => setProductId(e.target.value)}
            />
            Production Date: 
            <input
                value={productionDate}
                onChange={e => setProductionDate(e.target.value)}
            />
            <button
                onClick={search}
            >Search</button>
            {/* {productName &&  */}
                <div>
                    Product Name is: {productName}
                </div>
                <div>
                    Score is: {score}
                </div>
            {/* } */}
        </div>
    )


    async function search() {
        // setLoading(true);
        setStatusMsg('');
        try {
          const productRes = await fetch(`/api/0x8211f9f5a8e4c474ebf23aaff6d13e3194df5225/product/${productId}`);
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
        const scoreRes = await fetch(`/api/0x8211f9f5a8e4c474ebf23aaff6d13e3194df5225/score/${productId}/${productionDate}`);
        const {score, error} = await scoreRes.json();
        if(!scoreRes.ok) {
            setStatusMsg(error);
        } else if (score) {
            setScore(score);
        } else {
            setStatusMsg(`No scores have been added for this product with this production date.`);
        }
    }

}

export default ProductSearch;
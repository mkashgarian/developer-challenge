import React, { useState } from 'react';

const AddScore = (props: {contractAddress: string}) => {

    const [productId, setProductId] = useState('');
    const [statusMsg, setStatusMsg] = useState('');
    const [herbicides, setHerbicides] = useState('');
    const [pesticides, setPesticides] = useState('');
    const [nonrenewableEnergy, setNonrenewableEnergy] = useState('');
    const [plastics, setPlastics] = useState('');
    const [productionDate, setProductionDate] = useState('');


    return (
        <div className='add-score'>
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
            Do you use pesticides? 
            <input
                value={pesticides}
                onChange={e => setPesticides(e.target.value)}
            />
            Do you use plastic packaging? 
            <input
                value={plastics}
                onChange={e => setPlastics(e.target.value)}
            />
            Do you use non-renewable energy? 
            <input
                value={nonrenewableEnergy}
                onChange={e => setNonrenewableEnergy(e.target.value)}
            />
            Do you use herbicides? 
            <input
                value={herbicides}
                onChange={e => setHerbicides(e.target.value)}
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
          const res = await fetch(`/api/${props.contractAddress}/score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: productId,
              productionDate: productionDate,
              plastics: plastics,
              nonrenewableEnergy: nonrenewableEnergy,
              herbicides: herbicides,
              pesticides: pesticides
            })
          });
          const {error} = await res.json();
          if (!res.ok) {
            setStatusMsg(error)
          } else {
            setStatusMsg(`Success! New score has been added for product ID ${productId} and date ${productionDate}.`);
          }
        } catch(err: any) {
          setStatusMsg(err.stack)
        }
        // setLoading(false);
      }
}

export default AddScore;
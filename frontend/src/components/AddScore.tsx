import React, { useState } from 'react';

const AddScore = () => {

    const [score, setScore] = useState('');
    const [productId, setProductId] = useState('');


    return (
        <div>
            Product ID: 
            <input
                value={productId}
                onChange={e => setProductId(e.target.value)}
            />
            Score: 
            <input
                value={score}
                onChange={e => setScore(e.target.value)}
            />
            <button
                onClick={submit}
            >Submit</button>
        </div>
    )
}

const submit = () => {
    
}

export default AddScore;
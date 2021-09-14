import React, { useState } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import { Box, makeStyles, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles({
  box: {
    margin: 10,
    marginBottom: 20
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

const AddScore = () => {

    const classes = useStyles();
    const [statusMsg, setStatusMsg] = useState('');
    const [severity, setSeverity] = useState('');
    const [herbicides, setHerbicides] = useState('');
    const [pesticides, setPesticides] = useState('');
    const [nonrenewableEnergy, setNonrenewableEnergy] = useState('');
    const [plastics, setPlastics] = useState('');
    const [productionDate, setProductionDate] = useState('');
    const [upc, setUpc] = useState('');

    return (
        <div className='add-score'>
          <Box className={classes.container}>
            <Box className={classes.box}>
              <TextField
                id="outlined-basic" 
                label="UPC" 
                variant="outlined"
                value={upc}
                onChange={e => setUpc(e.target.value)}
              />
            </Box>
            <Box className={classes.box}>
              <TextField 
                type="date"
                id="outlined-basic" 
                // label="Production Date" 
                variant="outlined"
                value={productionDate}
                onChange={e => setProductionDate(e.target.value)}
              /> 
            </Box>
            </Box>
            <Box className={classes.container}>
            <FormControl component="fieldset">
                <FormLabel component="legend">Do you use pesticides?</FormLabel>
                <RadioGroup aria-label="pesticides" name="pesticides" onChange={event => setPesticides(event.target.value)}>
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
                <FormLabel component="legend">Do you use plastic packaging?</FormLabel>
                <RadioGroup aria-label="plastics" name="plastics" onChange={event => setPlastics(event.target.value)}>
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
                <FormLabel component="legend">Do you use non-renewable energy?</FormLabel>
                <RadioGroup aria-label="energy" name="energy" onChange={event => setNonrenewableEnergy(event.target.value)}>
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
                <FormLabel component="legend">Do you use herbicides?</FormLabel>
                <RadioGroup aria-label="herbicides" name="herbicides" onChange={event => setHerbicides(event.target.value)}>
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
            </FormControl>
</Box>
            <Button 
                variant="contained" 
                color="primary"
                onClick={submit}
            >
                Submit
            </Button>
            {(severity == "success" || severity == "error") &&
              <Alert className={classes.alert} severity={severity}>{statusMsg}</Alert>
            }
        </div>
    )

    async function submit() {
        // setLoading(true);
        setStatusMsg('');
        try {
          const res = await fetch(`/api/score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              upc: parseInt(upc),
              productionDate: productionDate,
              plastics: plastics,
              nonrenewableEnergy: nonrenewableEnergy,
              herbicides: herbicides,
              pesticides: pesticides
            })
          });
          const {error} = await res.json();
          if (!res.ok) {
            setSeverity(`error`);
            setStatusMsg('Uh oh! Your score was not added.')
          } else {
            setSeverity(`success`);
            setStatusMsg(`Success! New score has been added for UPC ${upc} and date ${productionDate}.`);
          }
        } catch(err: any) {
          setStatusMsg(err.stack)
        }
        // setLoading(false);
      }
}

export default AddScore;
import React, { useState } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import { Box, makeStyles, TextField, Typography } from '@material-ui/core';
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
    padding: '10px'
  },
  spinner: {
    padding: '10px'
  }
});

const AddScore = (props: any) => {

    const classes = useStyles();
    const [statusMsg, setStatusMsg] = useState('');
    const [severity, setSeverity] = useState('');
    const [herbicides, setHerbicides] = useState('');
    const [pesticides, setPesticides] = useState('');
    const [nonrenewableEnergy, setNonrenewableEnergy] = useState('');
    const [plastics, setPlastics] = useState('');
    const [productionDate, setProductionDate] = useState('');
    const [upc, setUpc] = useState('');
    const [loading, setLoading] = useState(false);

    return (
        <div className='add-score'>
          <Typography 
            paragraph
            color="textSecondary"
            className={classes.intro}
          >
            Do you need to add a score for a piece of the supply chain you are currently working on? Use this form and 
            enter the UPC and the manufacturing start date to start the process. Next, answer the simple questions below
            regarding what kind of work went into this product for your part of the manufacturing process. Please answer
            all questions.
          </Typography>
          <Box className={classes.container}>
            <Box className={classes.box}>
              <TextField
                id="outlined-basic" 
                placeholder="284756193816"
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
            disabled={loading}
          >
            Submit
          </Button>
          {((severity === "success" || severity === "error") && statusMsg) &&
            <Alert className={classes.alert} severity={severity}>{statusMsg}</Alert>
          }
        </div>
    )

    async function submit() {
        setLoading(true);
        setStatusMsg('');
        
        try {
          let upcExists = await props.checkIfUpcExists(upc);
          if(!upcExists.exists) {
            setSeverity(`error`);
            setStatusMsg('Uh oh! The UPC you entered does not exist.');
          } else {
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
            if (!res.ok) {
              setSeverity(`error`);
              setStatusMsg('Uh oh! Your score was not added.')
            } else {
              setSeverity(`success`);
              setStatusMsg(`Success! New score has been added for UPC ${upc} and date ${productionDate}.`);
            }
          }
        } catch(err: any) {
          setStatusMsg(err.stack)
        }
        setLoading(false);
      }
}

export default AddScore;
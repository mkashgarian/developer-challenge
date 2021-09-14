import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function ProductTable(props: any) {
  const classes = useStyles();

  let [itemList, itemsSet] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMyApi() {
      let response = await props.getAllItems();
      itemsSet(response.product);
    }
    fetchMyApi();
  }, []);



  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="left">UPC</TableCell>
            <TableCell align="left">Manufacturer</TableCell>
            <TableCell align="left">Product Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {itemList.map((item: any) => (
            <TableRow key={item.UPC}>
              <TableCell component="th" scope="row">
                {item.UPC}
              </TableCell>
              <TableCell align="left">{item.manufacturer}</TableCell>
              <TableCell align="left">{item.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

import { Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import priceTableServices from "../../services/PriceTableServices";
import plansServices from "../../services/PlansServices";

function createData(origin, destiny, time, plan, priceWithPlan, priceWithoutPlan) {
  return { origin, destiny, time, plan, priceWithPlan, priceWithoutPlan };
}

function App() {
  const [prices, setPrices] = useState([]);
  const [plans, setPlans] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function getPrices() {
      const result = await priceTableServices.get();
      setPrices(result.data);
    }
    async function getPlans() {
      const result = await plansServices.get();
      setPlans(result.data);
    }
    if(prices.length === 0) {
      getPrices();
    }
    if(plans.length === 0) {
      getPlans();
    }
  }, [prices, plans])

  const formik = useFormik({
    initialValues: {
      origin: "",
      destiny: "",
      plan: "",
      time: ""
    },
    onSubmit: (values) => {
      const { origin, destiny, plan, time } = values;
      const priceFilter = prices.filter(
        (price) => price.origin === origin && price.destiny === destiny
      )[0];
      if(!priceFilter) {
        alert("Origem -> Destino Inválido");
        return;
      }
      const timeLeft = parseInt(time) - parseInt(plan);
      if(isNaN(timeLeft)) {
        alert("Operação Inválida");
        return;
      }
      const amount = parseFloat(priceFilter.price);
      let priceToPayWithPlan = amount * timeLeft;
      priceToPayWithPlan += priceToPayWithPlan * 0.1;
      if(timeLeft <= 0) {
        priceToPayWithPlan = 0;
      };
      const priceToPayWithoutPlan = time * amount;
      setRows([...rows, 
        createData(
          origin, 
          destiny, 
          time, 
          plan, 
          priceToPayWithPlan.toLocaleString('pt-br',{ style: 'currency', currency: 'BRL' }), 
          priceToPayWithoutPlan.toLocaleString('pt-br',{ style: 'currency', currency: 'BRL' })
        )
      ]);
    }
  });


  const TableResult = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Origem</TableCell>
            <TableCell align="right">Destino</TableCell>
            <TableCell align="right">Tempo</TableCell>
            <TableCell align="right">Plano</TableCell>
            <TableCell align="right">Com Plano</TableCell>
            <TableCell align="right">Sem Plano</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.origin}
              </TableCell>
              <TableCell align="right">{row.destiny}</TableCell>
              <TableCell align="right">{row.time}</TableCell>
              <TableCell align="right">Fale Mais {row.plan}</TableCell>
              <TableCell align="right">{row.priceWithPlan}</TableCell>
              <TableCell align="right">{row.priceWithoutPlan}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid 
          container
          alignItems="center"
          justifyContent="center"
        >
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Origem</InputLabel>
            <Select
              name="origin"
              value={formik.values.origin}
              onChange={formik.handleChange}
            >
              {prices.map(price => 
                <MenuItem key={price.id} value={price.origin}>
                  {price.origin}
                </MenuItem>
              )}
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Destino</InputLabel>
            <Select
              name="destiny"
              value={formik.values.destiny}
              onChange={formik.handleChange}
            >
              {prices.map(price => 
                <MenuItem key={price.id} value={price.destiny}>
                  {price.destiny}
                </MenuItem>
              )}
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 3, minWidth: 120 }}>
            <InputLabel>Plano</InputLabel>
            <Select
              name="plan"
              value={formik.values.plan}
              onChange={formik.handleChange}
            >
              {plans.map(plan => 
                <MenuItem key={plan.id} value={plan.time}>
                  {plan.name}
                </MenuItem>
              )}
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <TextField
              label="Tempo" 
              variant="outlined" 
              name="time"
              value={formik.values.time}
              onChange={formik.handleChange}
            />
          </FormControl>
          <Button type="submit" variant="contained">Calcular</Button>
        </Grid>
      </form>
      {rows.length > 0 && <TableResult />}
    </>
  );
}

export default App;

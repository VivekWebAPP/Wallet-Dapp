import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { LoadingButton } from '@mui/lab';
import { Button, Card, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import HttpService from '../../services/HttpService';

export default function NewWallet() {
  const defaultValues = {
    name: '',
    publicAddress: '',
    balance: '',
  };

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [formValues, setFormValues] = useState(defaultValues);
  const [balance, setBalance] = useState(0);
  const wallet = useWallet();
  const { connection } = useConnection();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  async function getBalance() {
    if (wallet.publicKey) {
      const balance = await connection.getBalance(wallet.publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    }
  }

  useEffect(() => {
    getBalance();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    HttpService.postWithAuth('https://wallet-dapp-p0r3.onrender.com/wallet/createNewWallet', formValues.name, formValues.publicAddress || wallet.publicKey, formValues.balance || balance)
      .then((response) => {
        enqueueSnackbar('Wallet created successfully', { variant: 'success' });
        navigate('/wallets');
      })
      .catch((error) => {
        if (error.response?.data?.errors) {
          error.response?.data?.errors.map((e) => enqueueSnackbar(e.message, { variant: 'error' }));
        } else if (error.response?.data?.message) {
          enqueueSnackbar(error.response?.data?.message, { variant: 'error' });
        } else {
          enqueueSnackbar(error.message, { variant: 'error' });
        }
      });
  };

  return (
    <>
      <Helmet>
        <title> New Wallet | e-Wallet </title>
      </Helmet>
      <Container sx={{ minWidth: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
            New Wallet
          </Typography>
        </Stack>
        <Card>
          <Grid container alignItems="left" justify="center" direction="column" sx={{ width: 400, padding: 5 }}>
            <Stack spacing={3}>
              <TextField
                id="name"
                name="name"
                label="Wallet Name"
                autoComplete="given-name"
                autoFocus
                required
                value={formValues.name}
                onChange={handleInputChange}
              />
              <TextField
                id="publicAddress"
                name="publicAddress"
                label="publicAddress"
                autoComplete="publicAddress"
                required
                value={wallet.publicKey || formValues.publicAddress}
                onChange={handleInputChange}
              />
              <TextField
                id="balance"
                name="balance"
                label="Balance"
                autoComplete="balance"
                required
                value={balance || formValues.balance}
                onChange={handleInputChange}
              />
            </Stack>
            <Stack spacing={2} direction="row" alignItems="right" justifyContent="end" sx={{ mt: 4 }}>
              <Button sx={{ width: 120 }} variant="outlined" onClick={() => navigate('/wallets')}>
                Cancel
              </Button>
              <LoadingButton sx={{ width: 120 }} size="large" type="submit" variant="contained" onClick={handleSubmit}>
                Save
              </LoadingButton>
            </Stack>
          </Grid>
        </Card>
      </Container>
    </>
  );
}

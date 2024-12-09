import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, Card, Grid, Stack, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import HttpService from '../../services/HttpService';

const AirDropSolana = () => {
    const defaultValues = {
        amount: '',
        fromWalletIban: '',
        publicKey: '',
        description: '',
        typeId: 1, // set as Transfer by default
    };

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [formValues, setFormValues] = useState(defaultValues);
    const [fromWalletIbans, setFromWalletIbans] = useState([]);
    const [fromWalletIban, setFromWalletIban] = useState();
    const wallet = useWallet();
    const { connection } = useConnection();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    useEffect(() => {
        const userId = AuthService.getCurrentUser()?.id;
        HttpService.getWithAuth(`/wallets/users/${userId}`).then((result) => {
            setFromWalletIbans(result.data);
        });
    }, []);

    const handleWalletChange = (event) => {
        setFromWalletIban(event.iban);
        setFormValues({
            ...formValues,
            fromWalletIban: event.iban,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const publicKey = new PublicKey(formValues.publicKey);

            const signature = await connection.requestAirdrop(publicKey, 1 * 1e9); // The second parameter is the amount in lamports, 10 SOL = 10 * 1e9 lamports
            console.log('Airdrop signature:', signature);
        } catch (error) {
            console.error('Error requesting airdrop:', error);
            enqueueSnackbar('Failed to request airdrop', { variant: 'error' });
        }
    };
    return (
        <>
            <Helmet>
                <title> Air Drop Solana </title>
            </Helmet>
            <Card>
                <Grid container alignItems="left" justify="left" direction="column" sx={{ width: 400, padding: 5 }}>
                    <Stack spacing={3}>
                        <TextField
                            id="amount"
                            name="amount"
                            label="Amount"
                            autoFocus
                            required
                            value={formValues.amount}
                            onChange={handleInputChange}
                        />
                        {/* <Autocomplete
                            ListboxProps={{ style: { maxHeight: 200, overflow: 'auto' } }}
                            required
                            disablePortal
                            id="fromWalletIban"
                            noOptionsText="no records"
                            options={fromWalletIbans}
                            getOptionLabel={(fromWalletIban) => fromWalletIban.name}
                            isOptionEqualToValue={(option, value) => option.name === value.name}
                            onChange={(event, newValue) => {
                                handleWalletChange(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} label="Reciver Wallet Public Key" />}
                        /> */}
                        <TextField
                            id="publicKey"
                            name="publicKey"
                            label="Receiver Wallet Public Key"
                            autoComplete="toWalletIban"
                            required
                            value={formValues.publicKey}
                            onChange={handleInputChange}
                        />
                        {/* <TextField
                            id="description"
                            name="description"
                            label="Description"
                            autoComplete="description"
                            required
                            value={formValues.description}
                            onChange={handleInputChange}
                        /> */}
                    </Stack>
                    <Stack spacing={2} direction="row" alignItems="right" justifyContent="end" sx={{ mt: 4 }}>
                        <Button sx={{ width: 120 }} variant="outlined" onClick={() => navigate('/wallets')}>
                            Cancel
                        </Button>
                        <LoadingButton sx={{ width: 120 }} size="large" type="submit" variant="contained" onClick={handleSubmit}>
                            Send
                        </LoadingButton>
                    </Stack>
                </Grid>
            </Card>
        </>
    )
}

export default AirDropSolana

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js"
import {
  Card,
  Container,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { sentenceCase } from 'change-case';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../components/iconify';
import Label from '../../components/label';
import Scrollbar from '../../components/scrollbar';
import AuthService from '../../services/AuthService';
import HttpService from '../../services/HttpService';
import TransactionListHead from './TransactionListHead';

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false, firstColumn: true },
  { id: 'signature', label: 'Signature', alignRight: false },
  { id: 'time', label: 'Time', alignRight: true },
  { id: 'slot', label: 'Slot', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

export default function Transaction() {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const wallet = useWallet();
  const { connection } = useConnection()

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  useEffect(() => {
    fetchData(wallet.publicKey,10);
  }, []);

  const fetchData = async (address, numTx) => {
    const pubKey = new PublicKey(address);
    const transactionList = await connection.getSignaturesForAddress(pubKey, { limit: numTx }).then((response) => {
      setData(response);
    })
    .catch((error) => {
      if (error?.response?.status === 401) {
        navigate('/login');
      } else if (error.response?.data?.errors) {
        error.response?.data?.errors.map((e) => enqueueSnackbar(e.message, { variant: 'error' }));
      } else if (error.response?.data?.message) {
        enqueueSnackbar(error.response?.data?.message, { variant: 'error' });
      } else {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    });
    // transactionList.forEach((transaction, i) => {
    //   const date = new Date(transaction.blockTime * 1000);
    //   console.log(`Transaction No: ${i + 1}`);
    //   console.log(`Signature: ${transaction.signature}`);
    //   console.log(`Time: ${date}`);
    //   console.log(`Status: ${transaction.confirmationStatus}`);
    //   console.log(("-").repeat(20));
    // });
    // const userId = AuthService.getCurrentUser()?.id;
    // HttpService.getWithAuth(`/transactions/users/${userId}`)
    //   .then((response) => {
    //     setData(response.data.content);
    //   })
    //   .catch((error) => {
    //     if (error?.response?.status === 401) {
    //       navigate('/login');
    //     } else if (error.response?.data?.errors) {
    //       error.response?.data?.errors.map((e) => enqueueSnackbar(e.message, { variant: 'error' }));
    //     } else if (error.response?.data?.message) {
    //       enqueueSnackbar(error.response?.data?.message, { variant: 'error' });
    //     } else {
    //       enqueueSnackbar(error.message, { variant: 'error' });
    //     }
    //   });
  };


  return (
    <>
      <Helmet>
        <title> Transactions | e-Transaction </title>
      </Helmet>
      <Container sx={{ minWidth: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
            My Transactions
          </Typography>
        </Stack>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TransactionListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {data &&
                    data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,index) => {
                      const { id, blockTime, signature, slot, confirmationStatus } = row;
                      const selectedRecord = selected.indexOf(index) !== -1;
                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedRecord}>
                          <TableCell align="left" sx={{ paddingLeft: 5 }}>
                            {index}
                          </TableCell>
                          <TableCell align="left">{`${signature}`}</TableCell>
                          <TableCell align="left">{`${new Date(blockTime * 1000)}`}</TableCell>
                          <TableCell align="left">{slot}</TableCell>
                          <TableCell align="left">
                            <Label color={confirmationStatus === "finalized" ? 'success' : 'warning'}>{sentenceCase(confirmationStatus)}</Label>
                          </TableCell>
                          <TableCell align="right" width="20">
                            <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data?.length > 0 ? data.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}

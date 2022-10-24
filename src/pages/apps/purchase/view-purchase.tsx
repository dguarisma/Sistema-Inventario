import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addDays, format } from 'date-fns';
// material-ui
import {
  Button,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
  MenuItem,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';

import { useFormik, Form, FormikProvider, FormikValues } from 'formik';

// project import
import { useSelector, useDispatch } from 'store';
import MainCard from 'components/MainCard';
import { openSnackbar } from 'store/reducers/snackbar';
import { editPurchase, sendPurchase, resetItemsPurchase, editItemsPurchase, getIDPurchase } from 'store/reducers/purcharse';
import { SendOutlined } from '@ant-design/icons';
import DetailsPurchase from './detailsProduct';
import summary from 'utils/calculation';
import AddSelectProduct from './selectProducts';

// ==============================||VIEW PURCHASE - MAIN ||============================== //

const getInitialValues = (order: FormikValues | null) => {
  const newSubstance = {
    Notes: order?.Notes,
    create_order: order?.create_order,
    DiscountGlobal: order?.DiscountGlobal,
    SupplierID: order?.SupplierID,
    WarehouseID: order?.WarehouseID,
    DiscountEarliyPay: order?.DiscountEarliyPay,
    /*   paymentdate: format(addDays(new Date(), order?.supplier?.DaysPayment), 'dd-MM-yyyy'),*/
    EstimatedDeliveryDateBog: order?.supplier ? format(addDays(new Date(), order?.supplier?.LeadTimeBog), 'dd-MM-yyyy') : '',
    EstimatedDeliveryDateBaq: order?.supplier ? format(addDays(new Date(), order?.supplier?.LeadTimeBaq), 'dd-MM-yyyy') : ''
  };

  return newSubstance;
};

function ViewPurchase() {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [add, setAdd] = useState<boolean>(false);
  const [send, setSend] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getIDPurchase(Number(id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { supplierList } = useSelector((state) => state.supplier);
  const { warehouseList } = useSelector((state) => state.warehouse);
  const { detailsPurchase } = useSelector((state) => state.purchase);
  const { order }: any = useSelector((state) => state.purchase);
  const { products } = useSelector((state) => state.product);

  useMemo(() => dispatch(resetItemsPurchase()), [dispatch]);

  const handleCancel = () => {
    history(`/purchase`);
  };

  const getProduct = (id: number) => {
    if (id) {
      let product: any = products.find((item) => item.ID === id);
      return product;
    }
  };

  const orderPurchase: any = useMemo(() => {
    if (id && order) {
      let supplier: any = supplierList?.find((item: any) => item.ID === order?.SupplierID);
      let Articles: any =
        order?.Articles &&
        order?.Articles?.length > 0 &&
        order?.Articles.map((item: any) => {
          return {
            ...item,
            ID: item?.ProductID,
            Name: getProduct(item.ProductID)?.Name,
            Sku: getProduct(item.ProductID)?.Sku,
            Ean: getProduct(item.ProductID)?.Ean
          };
        });
      return {
        ...order,
        Articles,
        supplier
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let data =
      orderPurchase?.Articles &&
      orderPurchase?.Articles.length > 0 &&
      orderPurchase?.Articles.map((item: any) => ({ ...item, isSelected: true }));
    dispatch(editItemsPurchase(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setAdd(!add);
  };

  const formik = useFormik({
    initialValues: getInitialValues(orderPurchase!),
    onSubmit: (values, { setSubmitting }) => {
      try {
        if (send) {
          const newValue = {
            ...values,
            status: 'Send',
            products: orderPurchase?.Articles
          };
          dispatch(sendPurchase(id, newValue));
          dispatch(
            openSnackbar({
              open: true,
              message: 'Orden Enviada successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        } else {
          const newValue = {
            ...values,
            ...orderPurchase,
            products: detailsPurchase
          };
          dispatch(editPurchase(id, newValue));
          dispatch(
            openSnackbar({
              open: true,
              message: 'Orden Actualizada successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        }
        history(`/purchase`);
        setSubmitting(false);
      } catch (error) {
        console.error(error);
      }
    }
  });
  useEffect(() => {
    const items = detailsPurchase && detailsPurchase.length > 0 && summary(detailsPurchase, orderPurchase?.DiscountGlobal || 0);
    setData(items);
  }, [detailsPurchase, orderPurchase]);

  const { handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <>
      <MainCard>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MainCard>
                  <Typography variant="h5" component="div" sx={{ mb: 3 }}>
                    Detalles de la compra
                  </Typography>
                  <Grid container spacing={1} direction="row">
                    <Grid item xs={4}>
                      <InputLabel sx={{ mb: 1, opacity: 0.5 }}>Proveedor</InputLabel>
                      <TextField placeholder="Seleccionar Proveedor" fullWidth select disabled {...getFieldProps('SupplierID')}>
                        {supplierList
                          .filter((item: any) => item.Status === true)
                          .map((option: any) => (
                            <MenuItem key={option.ID} value={option.ID}>
                              {option.BusinessName}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={3}>
                      <InputLabel sx={{ mb: 1, opacity: 0.5 }}>Bodega</InputLabel>
                      <TextField placeholder="Seleccionar Bodega" fullWidth select disabled {...getFieldProps('WarehouseID')}>
                        {warehouseList
                          .filter((item: any) => item.Status === true)
                          .map((option: any) => (
                            <MenuItem key={option.ID} value={option.ID}>
                              {option.Name}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={2}>
                      <InputLabel sx={{ mb: 1, opacity: 0.5 }}>Descuento</InputLabel>
                      <TextField
                        sx={{ '& .MuiOutlinedInput-input': { opacity: 0.5 } }}
                        {...getFieldProps('DiscountGlobal')}
                        placeholder="Ingresa Descuento %"
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <InputLabel sx={{ mb: 1, opacity: 0.5 }}>Fecha Orden</InputLabel>
                      <TextField
                        sx={{ '& .MuiOutlinedInput-input': { opacity: 0.5 } }}
                        {...getFieldProps('create_order')}
                        placeholder=""
                        fullWidth
                        disabled
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    style={{
                      marginTop: 20
                    }}
                  >
                    <Grid item xs={5}>
                      <InputLabel sx={{ mb: 1, opacity: 0.5 }}>Notas</InputLabel>
                      <TextField
                        sx={{ '& .MuiOutlinedInput-input': { opacity: 0.5 } }}
                        multiline
                        rows={2}
                        placeholder="Ingresar Nota de compras"
                        fullWidth
                        {...getFieldProps('Notes')}
                      />
                    </Grid>
                    <Grid item xs={2} alignSelf="center">
                      <InputLabel sx={{ mb: 1, opacity: 0.5 }}>Descuento pronto Pago</InputLabel>
                      <TextField
                        sx={{ '& .MuiOutlinedInput-input': { opacity: 0.5 } }}
                        {...getFieldProps('DiscountEarliyPay')}
                        placeholder="Descuento pronto Pago %"
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={3} alignSelf="center">
                      <InputLabel sx={{ mb: 1, opacity: 0.5 }}>Fecha Pronto Pago</InputLabel>
                      <TextField
                        sx={{ '& .MuiOutlinedInput-input': { opacity: 0.5 } }}
                        {...getFieldProps('paymentdate')}
                        placeholder=""
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={3} alignSelf="center">
                      <InputLabel sx={{ mb: 1, opacity: 0.5 }}>Fecha Estimada Entrega Bogota</InputLabel>
                      <TextField
                        sx={{ '& .MuiOutlinedInput-input': { opacity: 0.5 } }}
                        {...getFieldProps('EstimatedDeliveryDateBog')}
                        placeholder=""
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={3} alignSelf="center">
                      <InputLabel sx={{ mb: 1, opacity: 0.5 }}>Fecha Estimada Entrega Barranquilla</InputLabel>
                      <TextField
                        sx={{ '& .MuiOutlinedInput-input': { opacity: 0.5 } }}
                        {...getFieldProps('EstimatedDeliveryDateBaq')}
                        placeholder=""
                        fullWidth
                        disabled
                      />
                    </Grid>
                  </Grid>
                  {orderPurchase?.status === 'New' && (
                    <Grid item xs={12} alignSelf="center">
                      <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" sx={{ mt: 3 }}>
                        <Button variant="contained" sx={{ textTransform: 'none' }} onClick={handleAdd}>
                          Agregar Productos
                        </Button>
                      </Stack>
                    </Grid>
                  )}
                </MainCard>
              </Grid>
              <Grid item xs={12}>
                {orderPurchase?.status === 'New' && <DetailsPurchase product={detailsPurchase} />}

                {orderPurchase?.status !== 'New' && orderPurchase?.Articles && orderPurchase?.Articles.length > 0 && (
                  <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>PRODUCTO</TableCell>
                        <TableCell align="center">CANTIDAD</TableCell>
                        <TableCell align="center">PRECIO BASE</TableCell>
                        <TableCell align="center">IVA</TableCell>
                        <TableCell align="center">DESCUENTO NEGOCIADO %</TableCell>
                        <TableCell align="center">DESCUENTO ADICIONAL %</TableCell>
                        <TableCell align="center">BONIFICACIÓN</TableCell>
                        <TableCell align="center">SUBTOTAL</TableCell>
                        <TableCell align="center">TOTAL</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderPurchase?.Articles &&
                        orderPurchase?.Articles.length > 0 &&
                        orderPurchase?.Articles.map((x: any, i: number) => (
                          <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <Stack spacing={0}>
                                  <Typography variant="subtitle1">{x.ID}</Typography>
                                  <Typography variant="subtitle1">{x.Name}</Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    SKU {x.Sku}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    EAN :{x.Ean}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </TableCell>
                            <TableCell align="center">{x.Count}</TableCell>
                            <TableCell align="center">{x.Tax}</TableCell>
                            <TableCell align="center">{x.BasePrice}</TableCell>
                            <TableCell align="center">{x.Discount}</TableCell>
                            <TableCell align="center">{x.DiscountAdditional}</TableCell>
                            <TableCell align="center">{x.Bonus}</TableCell>
                            <TableCell align="center">{x.SubTotal}</TableCell>
                            <TableCell align="center">{x.Total}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </Grid>
              <Grid item xs={12}>
                {orderPurchase?.Articles && orderPurchase?.Articles.length > 0 && (
                  <MainCard>
                    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 6 }}>
                      <Typography variant="subtitle1">Cantidad Total: ({orderPurchase?.Articles.length})</Typography>
                    </Stack>
                  </MainCard>
                )}
              </Grid>
              <Grid item xs={12}>
                {data && orderPurchase?.Articles && orderPurchase?.Articles.length > 0 && (
                  <MainCard>
                    <Stack direction="row" spacing={2} justifyContent="end" alignItems="rigth" sx={{ mt: 6 }}>
                      <Typography variant="subtitle1">Subtotal: $ {data.Subtotal || 0}</Typography>
                    </Stack>
                    {data.DiscountGlobal !== '0' && (
                      <Stack direction="row" spacing={2} justifyContent="end" alignItems="rigth" sx={{ mt: 1 }}>
                        <Typography variant="subtitle1">Descuento: $ {data.DiscountGlobal || 0}</Typography>
                      </Stack>
                    )}
                    {data.SubtotalWithDiscount !== 0 && (
                      <Stack direction="row" spacing={2} justifyContent="end" alignItems="rigth" sx={{ mt: 1 }}>
                        <Typography variant="subtitle1">Subtotal con descuento: $ {data.SubtotalWithDiscount || 0}</Typography>
                      </Stack>
                    )}
                    {data.Tax !== 0 && (
                      <Stack direction="row" spacing={2} justifyContent="end" alignItems="rigth" sx={{ mt: 1 }}>
                        <Typography variant="subtitle1">IVA: $ {data.Tax || 0}</Typography>
                      </Stack>
                    )}
                    <Stack direction="row" spacing={2} justifyContent="end" alignItems="rigth" sx={{ mt: 1 }}>
                      <Typography variant="subtitle1">Total: $ {data.Total || 0}</Typography>
                    </Stack>
                  </MainCard>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" sx={{ mt: 6 }}>
                  <Button variant="outlined" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                  {orderPurchase?.status === 'New' && (
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SendOutlined />}
                      disabled={isSubmitting}
                      onClick={() => setSend(true)}
                    >
                      Enviar
                    </Button>
                  )}
                  {orderPurchase?.status === 'New' && (
                    <Button variant="contained" sx={{ textTransform: 'none' }} type="submit" disabled={isSubmitting}>
                      Guardar
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </MainCard>
      {/* add user dialog */}
      <Dialog maxWidth="lg" fullWidth onClose={handleAdd} open={add} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
        {add && <AddSelectProduct onCancel={handleAdd} />}
      </Dialog>
    </>
  );
}

export default ViewPurchase;

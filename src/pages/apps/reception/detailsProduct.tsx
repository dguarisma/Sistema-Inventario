import { useEffect, useMemo, useState } from 'react';

// material-ui
import { Stack, Typography, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third-party
import NumberFormat from 'react-number-format';

// project import
import ReactTable from 'components/ReactTable';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import IconButton from 'components/@extended/IconButton';

import { useSelector } from 'store';

// assets
import { CheckSquareOutlined } from '@ant-design/icons';

// ==============================|| DETAILS PRODUCT RECEPTION - LIST VIEW ||============================== //

interface PropsProduct {
  products: [];
  handleAdd: (item: any) => void;
}

const DetailsPurchase = ({ products, handleAdd }: PropsProduct) => {
  const theme = useTheme();
  const { reception: itemReception }: any = useSelector((state) => state.reception);

  const TotalItemsCountReception =
    itemReception &&
    itemReception?.Articles?.length > 0 &&
    itemReception?.Articles?.reduce((accumulator: any, obj: any) => accumulator || 0 + obj.CountItemReception, 0);

  const columns = useMemo(
    () => [
      {
        Header: 'PRODUCTO',
        accessor: 'Name',
        Cell: ({ row }: any) => {
          const { original } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Stack spacing={0}>
                <Typography variant="subtitle1">{original?.Name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Sku {original?.Sku}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Ean :{original?.Ean}
                </Typography>
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: 'Cantidad',
        accessor: 'Count'
      },
      {
        Header: 'Precio base',
        accessor: 'BasePrice',
        Cell: ({ value }: any) => <NumberFormat value={value} displayType="text" prefix="$" />
      },
      {
        Header: 'IVA',
        accessor: 'Tax'
      },
      {
        Header: 'Descuento Negociado',
        accessor: 'DiscountNegotiated'
      },
      {
        Header: 'Descuento Adicional',
        accessor: 'DiscountAdditional'
      },
      {
        Header: 'Bonificación',
        accessor: 'Bonus'
      },
      {
        Header: 'SubTotal',
        accessor: 'SubTotal',
        Cell: ({ value }: any) => <NumberFormat value={value} displayType="text" prefix="$" />
      },
      {
        Header: 'Total',
        accessor: 'Total',
        Cell: ({ value }: any) => <NumberFormat value={value} displayType="text" prefix="$" />
      },
      {
        Header: 'Cantidad Recibida',
        accessor: '0',
        Cell: ({ row }: any) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              {TotalItemsCountReception}
            </Stack>
          );
        }
      },
      {
        Header: 'SubTotal Recibido',
        accessor: '1',
        Cell: ({ row }: any) => {
          const { original } = row;
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <NumberFormat value={TotalItemsCountReception * original?.BasePrice} displayType="text" prefix="$" />
            </Stack>
          );
        }
      },
      {
        Header: 'Total Recibido',
        accessor: '2',
        Cell: ({ row }: any) => {
          const { original } = row;
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <NumberFormat value={TotalItemsCountReception * original?.BasePrice + original?.Tax} displayType="text" prefix="$" />
            </Stack>
          );
        }
      },

      {
        Header: 'Acciones',
        className: 'cell-center',
        disableSortBy: true,
        Cell: ({ row }: any) => {
          return (
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
              <Tooltip title="Ingresar">
                <IconButton
                  color="primary"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    handleAdd(row.original);
                  }}
                >
                  <CheckSquareOutlined twoToneColor={theme.palette.primary.main} />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );
  const [data, setData] = useState<any>(products);
  useEffect(() => {
    setData(products);
  }, [products]);

  useEffect(() => {
    window.localStorage.setItem('farmu-productsDetails', JSON.stringify(data));
  }, [data]);
  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable
          columns={columns}
          hideButton={false}
          data={data}
          getHeaderProps={(column: any) => column.getSortByToggleProps()}
          FontSize
        />
      </ScrollX>
    </MainCard>
  );
};

export default DetailsPurchase;

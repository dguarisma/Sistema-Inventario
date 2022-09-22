import { useEffect, useMemo, useState } from 'react';

// material-ui
import { Table, TableBody, TableCell, TableHead, TableRow, Stack, Typography, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// third-party
import { useTable, useFilters, Column } from 'react-table';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import IconButton from 'components/@extended/IconButton';

/* import { deleteItemsPurchase } from 'store/reducers/purcharse';
import { openSnackbar } from 'store/reducers/snackbar'; */

// assets
import { EditTwoTone } from '@ant-design/icons';

// ==============================|| REACT TABLE ||============================== //

interface Props {
  columns: Column[];
  data: [];
}

function ReactTable({ columns, data }: Props) {
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns,
      data
      // @ts-ignore
    },
    useFilters
  );

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: any) => (
              <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row: any, i: number) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map((cell: any) => (
                <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

// ==============================|| REACT TABLE - EDITABLE ||============================== //

interface PropsProduct {
  products: [];
  handleAdd: () => void;
}

const DetailsPurchase = ({ products, handleAdd }: PropsProduct) => {
  const theme = useTheme();

  const columns = useMemo(
    () => [
      {
        Header: 'SKU',
        accessor: 'sku',
        Cell: ({ row }: any) => {
          const { original } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Stack spacing={0}>
                <Typography variant="subtitle1">{original.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  EAN: {original?.ean}
                </Typography>
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: 'Producto',
        accessor: 'name',
        Cell: ({ row }: any) => {
          const { original } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Stack spacing={0}>
                <Typography variant="subtitle1">{original.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  EAN: {original?.ean}
                </Typography>
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: 'Cantidad',
        accessor: 'qty'
      },
      {
        Header: 'Precio base',
        accessor: 'price'
      },
      {
        Header: 'IVA',
        accessor: 'iva'
      },
      {
        Header: 'Descuento Negociado',
        accessor: 'discount'
      },
      {
        Header: 'Descuento Adicional',
        accessor: 'additionalDiscount'
      },
      {
        Header: 'Bonificación',
        accessor: 'bonus'
      },
      {
        Header: 'Subtotal',
        accessor: 'subtotal',
        Cell: ({ row }: any) => {
          const { original } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Stack spacing={0}>
                {original?.qty && original?.price ? <Typography variant="subtitle1">{original?.qty * original?.price}</Typography> : 0}
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: 'Total',
        accessor: 'total',
        Cell: ({ row }: any) => {
          const { original } = row;
          let subtotal = original?.qty * original?.price || 0;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Stack spacing={0}>
                {subtotal ? <Typography variant="subtitle1">{subtotal + (subtotal * original?.iva || 0) / 100}</Typography> : 0}
              </Stack>
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
                    handleAdd();
                  }}
                >
                  <EditTwoTone twoToneColor={theme.palette.primary.main} />
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
    window.localStorage.setItem('productsDetails', JSON.stringify(data));
  }, [data]);
  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable columns={columns} data={data} />
      </ScrollX>
    </MainCard>
  );
};

export default DetailsPurchase;
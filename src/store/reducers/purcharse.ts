// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
// import axios from 'utils/axios';
import { dispatch } from '../index';
import summary from 'utils/calculation';
import { openSnackbar } from './snackbar';
import { useNavigate } from 'react-router-dom';
// types
import { PurchaseStateProps } from 'types/product-type';

// ----------------------------------------------------------------------

const initialState: PurchaseStateProps = {
  error: null,
  detailsPurchase: [],
  listPurchase: [],
  detailsReption: []
};

const slice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET PURCHASES
    getPurchaseSuccess(state, action) {
      state.listPurchase = action.payload;
    },

    // ADD PURCHASE
    addDetailsPurchaseSuccess(state, action) {
      state.detailsPurchase = [...state.detailsPurchase, ...action.payload];
    },
    deleteDetailsPurchaseSuccess(state, action) {
      const { id } = action.payload;
      const index = state.detailsPurchase.findIndex((item) => item.ID === id);
      state.detailsPurchase.splice(index, 1);

      const product = JSON.parse(window.localStorage.getItem('farmu-productsDetails')!);
      const idx = product?.findIndex((item: any) => item.ID === id);
      product.splice(idx, 1);
      window.localStorage.setItem('farmu-productsDetails', JSON.stringify(product));
    },
    updateDetailsPurchaseSuccess(state, action) {
      const { data } = action.payload;
      state.detailsPurchase = data;
    },
    resetDetailsPurchaseSuccess(state) {
      state.detailsPurchase = [];
      window.localStorage.setItem('farmu-productsDetails', JSON.stringify(state.detailsPurchase));
    },
    editDetailsPurchaseSuccess(state, action) {
      state.detailsPurchase = action.payload;
    },
    addPurchaseSuccess(state, action) {
      let summaryOrder = summary(action.payload?.products, action.payload?.discountOrder);
      const data = {
        ...action.payload,
        ...summaryOrder
      };
      state.detailsPurchase = [];
      state.listPurchase.push(data);
      window.localStorage.setItem('farmu-productsDetails', JSON.stringify(state.detailsPurchase));
    },
    updatePurchaseSuccess(state, action) {
      const { name, data } = action.payload;
      const index = state.listPurchase.findIndex((item) => item.nc === name);
      let summaryOrder = summary(data?.products, data?.discountOrder);
      state.listPurchase[index] = { ...data, ...summaryOrder };
    },
    deletePurchaseSuccess(state, action) {
      const { nc } = action.payload;
      const index = state.listPurchase.findIndex((item) => item.nc === nc);
      state.listPurchase[index] = {
        ...state.listPurchase[index],
        nc,
        status: 'Cancelled'
      };
    },
    sendPurchaseSuccess(state, action) {
      const { nc, data } = action.payload;
      const index = state.listPurchase.findIndex((item) => item.nc === nc);
      let summaryOrder = summary(data?.products, data?.discountOrder);
      state.listPurchase[index] = { ...data, ...summaryOrder };
      const NewData = {
        ...data,
        ...state.listPurchase[index],
        ...summaryOrder,
        nc
      };
      state.listPurchase[index] = NewData;
    },
    addReceptionSuccess(state, action) {
      const index = state.listPurchase.findIndex((item) => item.nc === action.payload.nc);
      let data = action.payload.detailsReption.concat(state.listPurchase[index].detailsReption);
      data = data.filter((item: any, index: number) => {
        return data.indexOf(item) === index;
      });
      const uniqueIds: any = [];

      const unique = data.filter((element: any) => {
        const isDuplicate = uniqueIds.includes(element?.lot);

        if (!isDuplicate) {
          uniqueIds.push(element?.lot);

          return true;
        }

        return false;
      });

      state.listPurchase[index] = {
        ...action.payload,
        detailsReption: unique
      };

      state.detailsReption = data;
    },
    confirmationReceptionSuccess(state, action) {
      const { nc, data } = action.payload;
      const index = state.listPurchase.findIndex((item) => item.nc === nc);
      state.listPurchase[index] = { ...data, orderStatus: 'Partial' };
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------
export function getPurchaseList() {
  return async () => {
    try {
      localStorage.getItem('mantis-ts-pack');
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function addPurchase(data: any) {
  return async () => {
    try {
      const history = useNavigate();
      dispatch(
        openSnackbar({
          open: true,
          message: 'Orden Creada successfully.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
      dispatch(slice.actions.addPurchaseSuccess(data));
      history(`/purchase/view/${data.nc}`);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function editPurchase(name: string | undefined, data: any) {
  return async () => {
    try {
      dispatch(
        slice.actions.updatePurchaseSuccess({
          name,
          data
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deletePurchase(nc: string) {
  return async () => {
    try {
      dispatch(
        slice.actions.deletePurchaseSuccess({
          nc
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function sendPurchase(nc: any, data: any) {
  return async () => {
    try {
      dispatch(
        slice.actions.sendPurchaseSuccess({
          nc,
          data
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addItemsPurchase(data: any) {
  return async () => {
    try {
      let products = data.filter((item: any) => item.isSelected === true).map((option: any) => option);
      dispatch(slice.actions.addDetailsPurchaseSuccess(products));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function editItemsPurchase(data: any) {
  return async () => {
    try {
      dispatch(slice.actions.editDetailsPurchaseSuccess(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function updateItemsPurchase(data: any) {
  return async () => {
    try {
      dispatch(slice.actions.updateDetailsPurchaseSuccess({ data }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function deleteItemsPurchase(id: number) {
  return async () => {
    try {
      dispatch(slice.actions.deleteDetailsPurchaseSuccess({ id }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function resetItemsPurchase() {
  return async () => {
    try {
      dispatch(slice.actions.resetDetailsPurchaseSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

/* RECEPTION */
export function addReception(data: any) {
  return async () => {
    try {
      dispatch(slice.actions.addReceptionSuccess(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function confirmationReception(nc: any, data: any) {
  return async () => {
    try {
      dispatch(slice.actions.confirmationReceptionSuccess({ nc, data }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

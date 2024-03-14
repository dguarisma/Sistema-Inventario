// types
import { DefaultConfigProps, DayPaymentPropsOption } from 'types/config';
import { Supplier } from 'types/supplier';
import { Product } from 'types/products';
import { DefaultArticle } from 'types/purchase';

export const drawerWidth = 260;

export const AWS_API = {
  poolId: '',
  appClientId: ''
};
export const AMZSECURITYTOKEN = '';

export const HEADER = {
  headers: {
    'X-Amz-Security-Token': ''
  }
};

export const HOST = '';
export const REDUCERVERSION = '';

export const FILE_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

export enum CATEGORY {
  CategoryOne = 1,
  CategoryTwo = 2,
  CategoryThree = 3
}

export const DATEFORMAT = 'dd-MM-yyyy';

export const ProductDefault: Product[] = [
  {
    HandlesBaq: '',
    HandlesBog: '',
    ID: '',
    Name: '',
    Sku: '',
    Ean: '',
    Maker: '',
    TrademarkID: '',
    TypesProductID: '',
    Variation: '',
    Grupo: '',
    CategoryOneID: '',
    CategoryTwoID: '',
    Pack: '',
    Quantity: '',
    MakerUnit: '',
    Weight: '',
    Width: '',
    PackInfo: '',
    Height: '',
    WrapperUnit: '',
    Depth: '',
    WarehouseIDS: '',
    Substance: '',
    Substitutes: '',
    Keywords: '',
    Tax: 0,
    Status: false,
    IsTaxed: false
  }
];

export const ProductPurchaseDefault: DefaultArticle[] = [
  {
    Sku: '',
    Quantity: 0,
    BasePrice: 0,
    Tax: 0,
    DiscountNegotiated: 0,
    DiscountAdditional: 0,
    Bonus: 0
  }
];

export const DefaultSupplier: Supplier[] = [
  {
    ID: '',
    BusinessName: '',
    Nit: '',
    Cupo: 0,
    DaysPayment: '',
    LeadTimeBaq: 0,
    LeadTimeBog: 0,
    PaymenTerm: '',
    Discount: 0,
    NameContact: '',
    EmailContact: '',
    PhoneContact: 0,
    Status: false
  }
];

export const DayPayment: DayPaymentPropsOption[] = [
  {
    title: 'Pago inmediato',
    id: '0'
  },
  {
    title: '1 Día',
    id: '1'
  },
  {
    title: '2 Días',
    id: '2'
  },
  {
    title: '3 Días',
    id: '3'
  },
  {
    title: '8 Días',
    id: '8'
  },
  {
    title: '15 Días',
    id: '15'
  },
  {
    title: '21 Días',
    id: '21'
  },
  {
    title: '30 Días',
    id: '30'
  },
  {
    title: '45 Días',
    id: '45'
  },
  {
    title: '60 Días',
    id: '60'
  }
];

// ==============================|| THEME CONFIG  ||============================== //

const config: DefaultConfigProps = {
  defaultPath: '/dashboard',
  fontFamily: `'Montserrat', sans-serif`,
  i18n: 'en',
  miniDrawer: false,
  container: true,
  mode: 'light',
  presetColor: 'default',
  themeDirection: 'ltr'
};

export default config;

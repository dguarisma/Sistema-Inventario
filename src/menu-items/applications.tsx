// assets
import { AppstoreOutlined, ReconciliationOutlined, UnorderedListOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = { AppstoreOutlined, ReconciliationOutlined, UnorderedListOutlined, ShoppingCartOutlined, UserOutlined };

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications: NavItemType = {
  id: 'group-applications',
  type: 'group',
  children: [
    {
      id: 'products',
      title: 'Productos',
      type: 'item',
      url: '/p/product-list',
      icon: icons.UnorderedListOutlined
    },
    {
      id: 'AddProduct',
      type: 'item',
      title: 'Agregar Producto',
      url: '/p/product-list/add-new-product',
      hide: true
    },
    {
      id: 'AddCategory',
      type: 'item',
      title: 'Agregar Categorias',
      url: '/p/product-list/add-category',
      hide: true
    },
    {
      id: 'proveedores',
      title: 'Proveedores',
      type: 'item',
      url: '/supplier',
      icon: icons.AppstoreOutlined
    },
    {
      id: 'addPurchase',
      type: 'item',
      title: 'Generar nueva orden de Compras',
      url: '/purchase/add-new-purchase',
      hide: true
    },
    {
      id: 'Compras',
      title: 'Compras',
      type: 'item',
      url: '/purchase',
      icon: icons.ReconciliationOutlined
    },
    {
      id: 'recepcion',
      title: 'Recepción',
      icon: icons.UserOutlined,
      type: 'item',
      url: '/reception'
    },

    {
      id: 'inventario',
      title: 'Inventario',
      type: 'item',
      url: '/maintenance/coming-soon',
      icon: icons.ShoppingCartOutlined
    }
  ]
};

export default applications;

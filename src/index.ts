#!/usr/bin/env node

import { Questions } from './questions';

type productInfo = { productName: string; productStock: string; productPrice: string };

const createProduct = async (product: productInfo) => {
  const productInfo = {
    name: product?.productName,
    stock: Number(product?.productStock),
    price: Number(product?.productPrice),
  };

  const response = await fetch('https://products-api.localhost.com/products', {
    body: JSON.stringify(productInfo),
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
  }).then((res) => res.json());

  return response;
};

const getProductDetails = async (productID: string) => {
  const response = await fetch(`https://products-api.localhost.com/products/${productID}`).then((res) => res.json());
  return response;
};

const deleteProduct = async (productID: string) => {
  const response = await fetch(`https://products-api.localhost.com/products/${productID}`, {
    method: 'DELETE',
  }).then((res) => res.json());
  return response;
};

const updateProductPrice = async (productID: string, price: string) => {
  const response = await fetch(`https://products-api.localhost.com/products/${productID}/price`, {
    method: 'PUT',
    body: JSON.stringify({
      price: Number(price),
    }),
    headers: {
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
  return response;
};

const updateProductStock = async (productID: string, stock: string) => {
  const response = await fetch(`https://products-api.localhost.com/products/${productID}/stock`, {
    method: 'PUT',
    body: JSON.stringify({
      stock: Number(stock),
    }),
    headers: {
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
  return response;
};

const onCreateOperation = async (entity: string) => {
  const product: productInfo = (await Questions.askEntityDetails(entity)) as productInfo;
  // todo: call the create api for the product
  createProduct(product).then(async (data) => {
    if (data.id) {
      console.log(`Product got Created with ID: ${data.id}`);
      await onEntitySelected(entity);
    } else {
      console.error(`failed to create the product with error: ${data.error}`);
      await onEntitySelected(entity);
    }
  });
};

const onListOperation = async (entity: string) => {
  const selectedItem = await Questions.showEntityList(entity);
  if (selectedItem === 'back') {
    await onEntitySelected(entity);
  } else {
    // todo: show product details
    getProductDetails(selectedItem).then(async (responseData) => {
      console.table(responseData);
      await onItemOperationSelected(await Questions.askItemOperations(), selectedItem, entity);
    });
    // console.log(`Selected Item ID: ${selectedItem}`);
  }
};

const onItemOperationSelected = async (operation: string, item: string, entity: string) => {
  switch (operation) {
    case 'delete':
      {
        const data = await deleteProduct(item);
        console.log(data);
        onEntitySelected(entity);
      }
      break;
    case 'update-stock':
      {
        const answer = await Questions.askStockToBeUpdated();
        const responseData = await updateProductStock(item, answer);
        console.log(responseData);
        onEntitySelected(entity);
      }
      break;
    case 'update-price':
      {
        const answer = await Questions.askPriceToBeUpdated();
        const responseData = await updateProductPrice(item, answer);
        console.log(responseData);
        onEntitySelected(entity);
      }
      break;
    default:
      await onEntitySelected(entity);
  }
};

const onEntiyOperationSelected = async (operation: string, entity: string) => {
  switch (operation) {
    case 'create':
      await onCreateOperation(entity);
      break;
    case 'list':
      await onListOperation(entity);
      break;
    case 'change':
      await onStart();
      break;
  }
};

const onEntitySelected = async (entity: string) => {
  switch (entity) {
    case 'product':
      await onEntiyOperationSelected(await Questions.askEntityOperationQuestion(), entity);
      break;
    default:
      console.log('Goodbye !');
      break;
  }
};
const onStart = async () => {
  await onEntitySelected(await Questions.askEntitiesQuestion());
};

(async () => {
  await onStart();
})();

/*
  - Which entity you want to manage? - Options
  - Select an Operation: Create / Update / Delete / List / Get By ID - Options
  - Create: 
    - Product Name: - String
    - Product Price: - String
    - Product Stock: - String
    - Confirm ? - Yes / No - Options
  - Update:
    - What to Update? Price / Stock - Options
    - Price:
      - Enter the Price: - String
      - Enter the Product ID: - String
      - Confirm ? - Yes / No - Options
    - Stock:
      - Enter the Stock: - String
      - Enter the Product ID: - String
      - Confirm ? - Yes / No - Options
  - Delete
    - Select Product
      - List of Products:
      - Next Page
      - Previous Page
  - List
  - Get By ID    
*/

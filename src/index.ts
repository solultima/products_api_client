#!/usr/bin/env node
import axios from 'axios';
import { Questions } from './questions';

const onCreateOperation = async (entity: string) => {
  const product = await Questions.askEntityDetails(entity);
  const productInfo = {
    name : product?.productName,
    stock: Number(product?.productStock),
    price: Number(product?.productPrice),
  }
  const { data } = await axios.post('http://localhost:5000/products', productInfo);
  console.log(data);
};

const onUpdateStockOperation = async (entity: string, pid:string ) => {

  const id= pid
  const product = await Questions.askStockDetails();
  const updatedStock = {
    stock : Number(product?.productStock)
  }
  
  const { data } = await axios.put(`http://localhost:5000/products/${id}/stock`, updatedStock);
  console.log(data);
   
};

const onUpdatePriceOperation = async (entity: string, pid:string ) => {

  const id= pid
  const product = await Questions.askPriceDetails();
  const updatedPrice = {
    price : Number(product?.productPrice)
  }
  const { data } = await axios.put(`http://localhost:5000/products/${id}/price`, updatedPrice);
  console.log(data);
};

const onDeleteOperation = async (entity: string, pid:string ) => {

  const id= pid;
  const { data } = await axios.delete(`http://localhost:5000/products/${id}`);
  console.log(data);
};

const onListOperation = async (entity: string) => {
  const selectedItem = await Questions.showEntityList(entity);
  if (selectedItem === 'back') {
    await onEntitySelected(entity);
  } else {
    console.log(`Selected Item ID: ${selectedItem}`);
    const selectedOperation = await Questions.askEntityProductOperationQuestion();
    if (selectedOperation == 'stock')
    {
      await onUpdateStockOperation(entity,selectedItem);
    }
    else if (selectedOperation == 'price')
    {
      await onUpdatePriceOperation(entity,selectedItem);
    }
    else if (selectedOperation == 'delete')
    {
      await onDeleteOperation(entity,selectedItem);
    }
    else  if (selectedOperation === 'back') {
      await onEntitySelected(entity);
    }
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

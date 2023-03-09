#!/usr/bin/env node

import { Questions } from './questions';

const onCreateOperation = async (entity: string) => {
  const product = await Questions.askEntityDetails(entity);
  console.log(product);
};

const onListOperation = async (entity: string) => {
  const selectedItem = await Questions.showEntityList(entity);
  if (selectedItem === 'back') {
    await onEntitySelected(entity);
  } else {
    console.log(`Selected Item ID: ${selectedItem}`);
  }
};

const onListByIdOperation = async (entity: string) => {
  const pID = await Questions.askId(entity);
  const selectedItem = await Questions.showProductDetails(entity, pID);

  console.log(`product details: `, selectedItem);

};
const onDeleteProductOperation = async (entity: string) => {
  const selectedItem = await Questions.showEntityList(entity);
  if (selectedItem === 'back') {
    await onEntitySelected(entity);
  } else {

    await Questions.deleteProduct(entity, selectedItem);
  }
  console.log(`product deleted sucessfully...`, selectedItem)
}

const onPriceUpdateOperation = async (entity: string) => {

    const productID = await Questions.askId(entity);
    const price = await Questions.askPrice(entity);
    const confirmation = await Questions.askOptionsQuestion('Confirm update?', ['Yes', 'No']);

    if (confirmation === 'Yes') {
      const updatedProduct = await Questions.updatePrice( productID, price);
      console.log(`Product ${updatedProduct} updated successfully...`,);
    } else {
      console.log('Update operation cancelled...');
    }
  }

const onEntiyOperationSelected = async (operation: string, entity: string) => {
  switch (operation) {
    case 'create':
      await onCreateOperation(entity);
      break;
    case 'list':
      await onListOperation(entity);
      break;
    case 'listbyid':
      await onListByIdOperation(entity);
      break;
    case 'updateprice':
      await onPriceUpdateOperation(entity);
      break;
    case 'delete':
      await onDeleteProductOperation(entity);
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
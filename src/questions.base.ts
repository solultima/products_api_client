import { ListQuestion, InputQuestion, Separator } from 'inquirer';

export class QuestionsBase {
  protected static entities: ListQuestion = {
    type: 'list',
    name: 'entities',
    message: 'Select Entity:',
    validate: (input, answers) => {
      console.log(input, answers);
      return false;
    },
    choices: () => {
      return [
        {
          name: 'Product',
          value: 'product',
          short: 'Product',
        },
        new Separator(),
        {
          name: 'Exit',
          value: 'exit',
          short: 'Exit Application',
        },
      ];
    },
  };

  protected static entityOperations: ListQuestion = {
    type: 'list',
    name: 'operations',
    message: 'Select Operation:',
    validate: (input, answers) => {
      console.log(input, answers);
      return false;
    },
    choices: () => {
      return [
        {
          name: 'List Items',
          value: 'list',
          short: 'List',
        },
          {
          name:'List By Id',
          value:'listbyid',
          short:'List By Id'
        },

        {
          name: 'Create New Item',
          value: 'create',
          short: 'Create',
        },
        new Separator(),
        {
          name: 'Select Different Entity',
          value: 'change',
          short: 'Create Entity',
        },
      ];
    },
  };

  protected static productOperations: ListQuestion = {
    type: 'list',
    name: 'operation',
    message: 'Select Operation:',
    validate: (input, answers) => {
      console.log(input, answers);
      return false;
    },
    choices: () => {
      return [
        {
          name: 'Update Stock of the Product',
          value: 'stock',
          short: 'stock',
        },
        {
          name: 'Update Price of the Product',
          value: 'price',
          short: 'price',
        },
        {
          name: 'Delete the Product',
          value: 'delete',
          short: 'delete',
        },

        new Separator(),
        {
          name: 'Go Back',
          value: 'back',
          short: 'Go Back',
        },

        // new Separator(),
      ];
    },
  };

  protected static buildProductListQuestion = (
    products: Array<{ name: string; _id: string }>,
    showNextPage: boolean,
    showPrevPage: boolean
  ) => {
    const productList: ListQuestion = {
      type: 'list',
      name: 'itemID',
      message: 'Select Item:',
      loop: false,
      pageSize: 9,
      validate: (input, answers) => {
        console.log(input, answers);
        return false;
      },
      choices: () => {
        const options = [];

        options.push(new Separator());

        if (showPrevPage) {
          options.push({
            name: 'Previous Page',
            value: 'previous',
            short: 'Previous Page',
          });
        }
        if (showNextPage) {
          options.push({
            name: 'Next Page',
            value: 'next',
            short: 'Next Page',
          });
        }

        options.push(new Separator());

        products.forEach((product) => {
          options.push({
            name: `- ${product.name} (${product._id})`,
            value: product._id,
            short: product.name,
          });
        });

        options.push(new Separator());

        options.push({
          name: 'Go Back',
          value: 'back',
          short: 'Go Back',
        });

        options.push(new Separator());

        return options;
      },
    };
    return productList;
  };


  protected static productName: InputQuestion = {
    type: 'input',
    name: 'productName',
    message: 'Provide Product Name:',
  };

  protected static productID: InputQuestion = {
    type: 'input',
    name: 'productID',
    message: 'Provide Product ID:',
  };


  protected static productStock: InputQuestion = {
    type: 'input',
    name: 'productStock',
    message: 'Provide Product Stock:',
  };

  protected static productPrice: InputQuestion = {
    type: 'input',
    name: 'productPrice',
    message: 'Provide Product Price:',
  };
}
import axios from 'axios';
import * as inquirer from 'inquirer';

import { Answers } from 'inquirer';
import { QuestionsBase } from './questions.base';

export class Questions extends QuestionsBase {
  public static askEntitiesQuestion = async () => {
    return inquirer.prompt(Questions.entities).then((answers: Answers) => {
      return answers.entities;
    });
  };
  public static askOptionsQuestion = async (message: string, options: string[]) => {
    const question = {
      type: 'list',
      name: 'answer',
      message: message,
      choices: options,
    };

    return inquirer.prompt([question]).then((answers: Answers) => {
      return answers.answer;
    });
  };

  public static askEntityOperationQuestion = async () => {
    return inquirer.prompt(Questions.entityOperations).then((answers: Answers) => {
      return answers.operations;
    });
  };

  public static askEntityDetails = async (entity: string) => {
    if (entity === 'product') {
      return inquirer.prompt([Questions.productName, Questions.productStock, Questions.productPrice]).then((answers: Answers) => {
        return answers;
      });
    }
  };
  public static askId = async (entity: string) => {
    if (entity === 'product') {
      return inquirer.prompt([Questions.productID]).then((id: Answers) => {
        return id.productID;
      });
    }
  }
  public static askStock = async (entity: string) => {
    if (entity === 'product') {
      return inquirer.prompt([Questions.productStock]).then((answers: Answers) => {
        return answers.productStock;
      });
    }
  }
  public static askPrice = async (entity: string) => {
    if (entity === 'product') {
      return inquirer.prompt([Questions.productPrice]).then((answers: Answers) => {
        return answers.productPrice;
      });
    }
  }
  public static showEntityList = async (entity: string, page?: number): Promise<string> => {
    if (!page) page = 1;
    const products = await fetch(`http://localhost:5000/products?page=${page}`).then((res) => res.json());
    const haveNextPage = products.pageNumber * products.pageSize < products.totalItemCount;
    const havePreviousPage = products.pageNumber > 1;

    const question = Questions.buildProductListQuestion(products.items, haveNextPage, havePreviousPage);

    return await inquirer.prompt(question).then(async (answers: Answers) => {
      if (answers.itemID === 'next') {
        return await Questions.showEntityList(entity, products.pageNumber + 1);
      } else if (answers.itemID === 'previous') {
        return await Questions.showEntityList(entity, products.pageNumber - 1);
      } else if (answers.itemID === 'back') {
        return 'back';
      } else {
        return answers.itemID;
      }
    });
  };
  public static showProductDetails = async (entity: string, id: string) => {

    const items = await axios.get(`http://localhost:5000/products/${id}`).then((res) => res.data);


    return items;
  };
  /*public static updatePrice = async (id:string,pRICE:string) => {
    
    const items = await axios.post(`http://localhost:5000/products/${id}/${pRICE}`).then((res) => res.data);
     
  
     return items;
    };*/


  public static updatePrice = async (id: string, price: string) => {
    const updatedPrice = {
      price : Number(price)
    }
    try {
      const response = await axios.put(`http://localhost:5000/products/${id}/price`, updatedPrice, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      console.log(`updated price is `);
      console.log(updatedPrice)
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update price');
    }
  };

  /*public static updateStock = async (id: string, sTOCK: string) => {

    const items = await axios.post(`http://localhost:5000/products/${id}/${sTOCK}`).then((res) => res.data);


    return items;
  };*/


  public static updateStock = async (id: string, stock: string) => {
    const updatedStock = {
      stock: Number(stock)
    }
    try {
      const response = await axios.put(`http://localhost:5000/products/${id}/stock`, updatedStock, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log(response.data);
      console.log(`updated stock is `);
      console.log(updatedStock)
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update stock');
    }
  };
  


  public static deleteProduct = async (entity: string, id: string) => {

    const items = await axios.delete(`http://localhost:5000/products/${id}`).then((res) => res.data);


    return items;
  };
}
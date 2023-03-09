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
  public static askId = async(entity:string)=>{
    if(entity === 'product') {
      return inquirer.prompt([Questions.productID]).then((id: Answers) =>{
        return id.productID;
      });
    }
  }
  public static askStock = async(entity:string)=>{
    if(entity === 'product') {
      return inquirer.prompt([Questions.productStock]).then((answer: Answers) =>{
        return answer.productStock;
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
  public static createProductDetails = async (entity: string) => {
    const items = await axios.post(`http://localhost:5000/products`).then((res) => res.data);
    return items;
    };
  public static showProductDetails = async (id:string) => {
  const items = await axios.get(`http://localhost:5000/products/${id}`).then((res) => res.data);
  return items;
  };
  public static deleteProduct = async (entity: string,id:string) => {
  const items = await axios.delete(`http://localhost:5000/products/${id}`).then((res) => res.data);
  return items;
    };
    public static updateStock = async (id:string,stock:number) => {
      
      const items = await axios.put(`http://localhost:5000/products/${id}/stock`,stock,{
        
      }).then((res) => res.data);
      return items;
        };
    
  }

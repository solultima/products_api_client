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

  public static askEntityProductOperationQuestion = async () => {
    return inquirer.prompt(Questions.productOperations).then((answers: Answers) => {
      if (answers.itemID === 'back') {
        return 'back';
      } else {
      return answers.operation;
    }});
  };

  public static askEntityDetails = async (entity: string) => {
    if (entity === 'product') {
      return inquirer.prompt([Questions.productName, Questions.productStock, Questions.productPrice]).then((answers: Answers) => {
      return answers;
      });
    }
  };

  public static askStockDetails = async () => {
    {
      return inquirer.prompt([Questions.productStock]).then((answers: Answers) => {
        console.log(answers);
        return answers;
      
      })
    }
  };

  public static askPriceDetails = async () => {
    {
      return inquirer.prompt([Questions.productPrice]).then((answers: Answers) => {
        console.log(answers);
        return answers;
      })
    }
  };

  public static findid = async (products: Array<{ _id: string }>) => {
    products.forEach((product) => {
      const id = `${product._id}`
      return id;
    });
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
}
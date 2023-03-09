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

  public static askPriceToBeUpdated = async () => {
    return inquirer.prompt(Questions.productPrice).then((answers: Answers) => {
      return answers.productPrice;
    });
  };

  public static askStockToBeUpdated = async () => {
    return inquirer.prompt(Questions.productStock).then((answers: Answers) => {
      return answers.productStock;
    });
  };

  public static askItemOperations = async () => {
    return inquirer.prompt(Questions.itemOperations).then((answers: Answers) => {
      return answers.operations;
    });
  };

  public static showEntityList = async (entity: string, page?: number): Promise<string> => {
    if (!page) page = 1;
    const products = await fetch(`https://products-api.localhost.com/products?page=${page}`, {}).then((res) => res.json());
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

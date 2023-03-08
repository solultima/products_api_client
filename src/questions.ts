
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

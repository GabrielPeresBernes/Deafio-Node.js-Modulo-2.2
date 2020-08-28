import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const { total: balanceTotal } = await transactionsRepository.getBalance();

    if (type === 'outcome' && balanceTotal - value < 0)
      throw new AppError("There's not enough money to make this withdraw");

    let category_id: string;

    const existingCategory = await categoriesRepository.findOne({
      title: category,
    });

    if (existingCategory === undefined) {
      const newCategory = categoriesRepository.create({
        title: category,
      });

      const { id } = await categoriesRepository.save(newCategory);

      category_id = id;
    } else category_id = existingCategory.id;

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

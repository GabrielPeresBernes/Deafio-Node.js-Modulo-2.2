import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    let income = 0;
    let outcome = 0;

    const transactions = await this.find();

    transactions.forEach(transaction => {
      const { type, value } = transaction;

      const parsedValue = typeof value === 'string' ? parseFloat(value) : value;

      if (type === 'income') income += parsedValue;
      else outcome += parsedValue;
    });

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;

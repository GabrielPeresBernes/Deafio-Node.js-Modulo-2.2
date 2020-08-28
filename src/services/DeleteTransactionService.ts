import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const deletion = await transactionsRepository.delete(id);

    if (deletion.affected === null)
      throw new AppError('A valid id must be informed to perform a deletion');
  }
}

export default DeleteTransactionService;

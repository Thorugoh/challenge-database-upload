// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository'
import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
interface Request{
  title: string,
  value: number,
  type: 'income' | 'outcome';
  category: string
}

class CreateTransactionService {
  public async execute({ title, value, type, category}: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);

    if(type === 'outcome') {
      
      const { total } = await transactionsRepository.getBalance();

      if(value > total)
      {
        throw new AppError('Not authorized transaction');
      }
    }
    
    const transaction = transactionsRepository.create({
      title, 
      value, 
      type, 
      category
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

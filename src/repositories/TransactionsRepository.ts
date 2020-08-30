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
    const incomeTransactions = await this.find({
      where: {type: 'income'}
    });
    
    const outcomeTransactions = await this.find({
      where: {type: 'outcome'}
    });
    
    const income = incomeTransactions.reduce((income, transaction) => income += transaction.value, 0);
    const outcome = outcomeTransactions.reduce((outcome, transaction) => outcome += transaction.value, 0);

    return {income, outcome, total: income - outcome};
    
  }
}

export default TransactionsRepository;

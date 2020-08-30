import { Router } from 'express';
import multer from "multer";
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import CreateCategoryService from '../services/CreateCategoryService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);

interface RequestDTO {
  title: string,
  type: 'income' | 'outcome',
  value: number,
  category: string
}

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  return response.json({transactions, balance});
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category: categoryTitle} = request.body;

  const createTransactionService = new CreateTransactionService();
  
  const createCategoryService = new CreateCategoryService();

  const { id } = await createCategoryService.execute({title: categoryTitle});

  const transaction = await createTransactionService.execute({title, value, type, category: id});

  return response.json(transaction);

});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  
  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute(id);

  return response.status(204).send();
});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  
  // const transactions: RequestDTO[] = [
  //   { title: 'Loan1', type:'income', value: 600, category: 'Others' },
  //   { title: 'Loan2', type:'income', value: 700, category: 'Others' },
  //   { title: 'Loan3', type:'income', value: 800, category: 'Others' },
  //   { title: 'Loan4', type:'income', value: 900, category: 'Others4' },
  // ]

  const importTransactionService = new ImportTransactionsService();
  const transactions =  await importTransactionService.execute(request.file.path);

  return response.json(transactions);
});

export default transactionsRouter;

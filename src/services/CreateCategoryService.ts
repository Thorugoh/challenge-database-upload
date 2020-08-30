import Category from "../models/Category";
import { getRepository } from "typeorm";

interface Request{
    title: string
}

class CreateCategoryService {
    public async execute({title}: Request):Promise<Category> {

        const categoryRepository = getRepository(Category);

        const checkCategoryExists = await categoryRepository.findOne({
            where: {title},
        });

        if(checkCategoryExists !== undefined){
            return checkCategoryExists;
        }

        const category = categoryRepository.create({
            title,
        });

        await categoryRepository.save(category);

        return category;
    }
}

export default CreateCategoryService;
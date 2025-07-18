import axios from '../utils/axios';
import type { Category } from '../types/product';

export interface GetCategoriesResponse {
  message: string;
  totalCategories: number;
  categories: Category[];
}

export interface GetCategoryByIdResponse {
  message: string;
  category: Category;
}

export const getCategoryByIdAPI = async (id: string): Promise<GetCategoryByIdResponse> => {
  const { data } = await axios.get(`/categories/${id}`);
  return data;
};


export const getCategoriesAPI = async (): Promise<GetCategoriesResponse> => {
  const { data } = await axios.get('/categories');
  return data;
};

export const createCategoryAPI = async (category: Partial<Category>): Promise<Category> => {
  const { data } = await axios.post('/categories', category);
  return data;
};

export const updateCategoryAPI = async (id: string, category: Partial<Category>): Promise<Category> => {
  const { data } = await axios.put(`/categories/${id}`, category);
  return data;
};

export const deleteCategoryAPI = async (id: string): Promise<void> => {
  await axios.delete(`/categories/${id}`);
}; 
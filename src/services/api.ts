import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Department {
  id: number;
  name: string;
  parent_department_id: number | null;
  parent_department_name: string | null;
  level: number;
  employees_count: number;
  sub_departments_count: number;
  ambassador_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface DepartmentsResponse {
  data: Department[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  total_employees: number;
}

export interface DepartmentFilters {
  search?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  perPage?: number;
  page?: number;
  filters?: Record<string, string[]>;
}

export const departmentsApi = {
  getAll: (params?: DepartmentFilters) => 
    api.get<DepartmentsResponse>('/departments', { params }),
  
  getOne: (id: number) => 
    api.get<{ data: Department }>(`/departments/${id}`),
  
  create: (data: Partial<Department>) => 
    api.post<{ message: string; data: Department }>('/departments', data),
  
  update: (id: number, data: Partial<Department>) => 
    api.put<{ message: string; data: Department }>(`/departments/${id}`, data),
  
  delete: (id: number) => 
    api.delete<{ message: string }>(`/departments/${id}`),
  
  getSubdepartments: (id: number) => 
    api.get<{ data: Department[] }>(`/departments/${id}/subdepartments`),
};

export default api;


import { toast } from "sonner";
import {
  Department,
  Process,
  SubProcess,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  CreateProcessDto,
  UpdateProcessDto,
  CreateSubProcessDto,
  UpdateSubProcessDto,
} from "../types/models";

const API_BASE_URL = "https://localhost:7006/api";

// Utilitário para tratamento de erros
const handleApiError = (error: any, message: string) => {
  console.error(`${message}:`, error);
  toast.error(message);
  throw error;
};

// Serviço para Departamentos
export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (error) {
      return handleApiError(error, "Falha ao carregar departamentos");
    }
  },

  getById: async (id: number): Promise<Department> => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments/${id}`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (error) {
      return handleApiError(error, `Falha ao carregar departamento ${id}`);
    }
  },

  create: async (department: CreateDepartmentDto): Promise<Department> => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(department),
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      toast.success("Departamento criado com sucesso");
      return await response.json();
    } catch (error) {
      return handleApiError(error, "Falha ao criar departamento");
    }
  },

  update: async (id: number, department: UpdateDepartmentDto): Promise<Department> => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(department),
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      toast.success("Departamento atualizado com sucesso");
      return await response.json();
    } catch (error) {
      return handleApiError(error, `Falha ao atualizar departamento ${id}`);
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      toast.success("Departamento excluído com sucesso");
    } catch (error) {
      handleApiError(error, `Falha ao excluir departamento ${id}`);
    }
  },
};

// Serviço para Processos
export const processService = {
  getAll: async (): Promise<Process[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/processes`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (error) {
      return handleApiError(error, "Falha ao carregar processos");
    }
  },

  getById: async (id: number): Promise<Process> => {
    try {
      const response = await fetch(`${API_BASE_URL}/processes/${id}`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (error) {
      return handleApiError(error, `Falha ao carregar processo ${id}`);
    }
  },

  create: async (process: CreateProcessDto): Promise<Process> => {
    try {
      const response = await fetch(`${API_BASE_URL}/processes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(process),
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      toast.success("Processo criado com sucesso");
      return await response.json();
    } catch (error) {
      return handleApiError(error, "Falha ao criar processo");
    }
  },

  update: async (id: number, process: UpdateProcessDto): Promise<Process> => {
    try {
      const response = await fetch(`${API_BASE_URL}/processes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(process),
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      toast.success("Processo atualizado com sucesso");
      return await response.json();
    } catch (error) {
      return handleApiError(error, `Falha ao atualizar processo ${id}`);
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/processes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      toast.success("Processo excluído com sucesso");
    } catch (error) {
      handleApiError(error, `Falha ao excluir processo ${id}`);
    }
  },
};

// Serviço para Subprocessos
export const subProcessService = {
  getAll: async (): Promise<SubProcess[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/subprocesses`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (error) {
      return handleApiError(error, "Falha ao carregar subprocessos");
    }
  },

  getById: async (id: number): Promise<SubProcess> => {
    try {
      const response = await fetch(`${API_BASE_URL}/subprocesses/${id}`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (error) {
      return handleApiError(error, `Falha ao carregar subprocesso ${id}`);
    }
  },

  create: async (subprocess: CreateSubProcessDto): Promise<SubProcess> => {
    try {
      const response = await fetch(`${API_BASE_URL}/subprocesses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subprocess),
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      toast.success("Subprocesso criado com sucesso");
      return await response.json();
    } catch (error) {
      return handleApiError(error, "Falha ao criar subprocesso");
    }
  },

  update: async (id: number, subprocess: UpdateSubProcessDto): Promise<SubProcess> => {
    try {
      const response = await fetch(`${API_BASE_URL}/subprocesses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subprocess),
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      toast.success("Subprocesso atualizado com sucesso");
      return await response.json();
    } catch (error) {
      return handleApiError(error, `Falha ao atualizar subprocesso ${id}`);
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/subprocesses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      toast.success("Subprocesso excluído com sucesso");
    } catch (error) {
      handleApiError(error, `Falha ao excluir subprocesso ${id}`);
    }
  },
};

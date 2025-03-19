
export interface Department {
  id: number;
  name: string;
  processes: Process[];
}

export interface Process {
  id: number;
  name: string;
  departmentId: number;
  department?: Department;
  subProcesses: SubProcess[];
}

export interface SubProcess {
  id: number;
  name: string;
  processId: number;
  process?: Process;
  description?: string;
  tools?: string;
  responsibles?: string;
  documentation?: string;
}

// Tipos para criação e atualização
export type CreateDepartmentDto = Omit<Department, 'id' | 'processes'>;
export type UpdateDepartmentDto = Partial<CreateDepartmentDto>;

export type CreateProcessDto = Omit<Process, 'id' | 'department' | 'subProcesses'>;
export type UpdateProcessDto = Partial<CreateProcessDto>;

export type CreateSubProcessDto = Omit<SubProcess, 'id' | 'process'>;
export type UpdateSubProcessDto = Partial<CreateSubProcessDto>;

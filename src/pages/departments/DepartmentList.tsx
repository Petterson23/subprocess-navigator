
import React, { useEffect, useState } from 'react';
import { Plus, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/layout/PageHeader';
import DepartmentCard from '@/components/cards/DepartmentCard';
import EmptyState from '@/components/lists/EmptyState';
import ItemList from '@/components/lists/ItemList';
import ConfirmationDialog from '@/components/modals/ConfirmationDialog';
import FormDialog from '@/components/modals/FormDialog';
import DepartmentForm from '@/components/forms/DepartmentForm';
import { Department, CreateDepartmentDto } from '@/types/models';
import { departmentService } from '@/services/api';

const DepartmentList = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDepartment = async (data: CreateDepartmentDto) => {
    setIsSubmitting(true);
    try {
      await departmentService.create(data);
      await fetchDepartments();
      setFormDialogOpen(false);
    } catch (error) {
      console.error('Failed to create department:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDepartment = async (data: CreateDepartmentDto) => {
    if (!selectedDepartment) return;
    
    setIsSubmitting(true);
    try {
      await departmentService.update(selectedDepartment.id, data);
      await fetchDepartments();
      setFormDialogOpen(false);
      setSelectedDepartment(null);
    } catch (error) {
      console.error('Failed to update department:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return;
    
    setIsDeleting(true);
    try {
      await departmentService.delete(selectedDepartment.id);
      await fetchDepartments();
      setDeleteDialogOpen(false);
      setSelectedDepartment(null);
    } catch (error) {
      console.error('Failed to delete department:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (department: Department) => {
    setSelectedDepartment(department);
    setFormDialogOpen(true);
  };

  const handleDeleteClick = (department: Department) => {
    setSelectedDepartment(department);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: CreateDepartmentDto) => {
    if (selectedDepartment) {
      handleUpdateDepartment(data);
    } else {
      handleCreateDepartment(data);
    }
  };

  const handleAddNew = () => {
    setSelectedDepartment(null);
    setFormDialogOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Departamentos"
        description="Gerencie os departamentos da organização"
        actions={
          <Button onClick={handleAddNew} className="hover-scale">
            <Plus className="mr-2 h-4 w-4" />
            Novo Departamento
          </Button>
        }
      />

      <ItemList
        items={departments}
        renderItem={(department) => (
          <DepartmentCard
            department={department}
            onEdit={() => handleEditClick(department)}
            onDelete={() => handleDeleteClick(department)}
          />
        )}
        emptyState={
          <EmptyState
            title="Nenhum departamento encontrado"
            description="Crie um departamento para começar a mapear os processos da organização."
            actionLabel="Criar Departamento"
            icon={<Briefcase className="h-8 w-8 text-primary" />}
            onAction={handleAddNew}
          />
        }
        isLoading={isLoading}
        gridCols={3}
      />

      <FormDialog
        isOpen={formDialogOpen}
        title={selectedDepartment ? "Editar Departamento" : "Novo Departamento"}
        onClose={() => {
          setFormDialogOpen(false);
          setSelectedDepartment(null);
        }}
      >
        <DepartmentForm
          initialData={selectedDepartment || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setFormDialogOpen(false);
            setSelectedDepartment(null);
          }}
          isSubmitting={isSubmitting}
        />
      </FormDialog>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        title="Excluir Departamento"
        description={`Tem certeza que deseja excluir o departamento "${selectedDepartment?.name}"? Esta ação não pode ser desfeita.`}
        cancelText="Cancelar"
        confirmText="Excluir"
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedDepartment(null);
        }}
        onConfirm={handleDeleteDepartment}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DepartmentList;

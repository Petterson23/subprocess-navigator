
import React, { useEffect, useState } from 'react';
import { Plus, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/layout/PageHeader';
import ProcessCard from '@/components/cards/ProcessCard';
import EmptyState from '@/components/lists/EmptyState';
import ItemList from '@/components/lists/ItemList';
import ConfirmationDialog from '@/components/modals/ConfirmationDialog';
import FormDialog from '@/components/modals/FormDialog';
import ProcessForm from '@/components/forms/ProcessForm';
import { Process, CreateProcessDto } from '@/types/models';
import { processService } from '@/services/api';

const ProcessList = () => {
  const navigate = useNavigate();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    setIsLoading(true);
    try {
      const data = await processService.getAll();
      setProcesses(data);
    } catch (error) {
      console.error('Failed to fetch processes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProcess = async (data: CreateProcessDto) => {
    setIsSubmitting(true);
    try {
      await processService.create(data);
      await fetchProcesses();
      setFormDialogOpen(false);
    } catch (error) {
      console.error('Failed to create process:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProcess = async (data: CreateProcessDto) => {
    if (!selectedProcess) return;
    
    setIsSubmitting(true);
    try {
      await processService.update(selectedProcess.id, data);
      await fetchProcesses();
      setFormDialogOpen(false);
      setSelectedProcess(null);
    } catch (error) {
      console.error('Failed to update process:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProcess = async () => {
    if (!selectedProcess) return;
    
    setIsDeleting(true);
    try {
      await processService.delete(selectedProcess.id);
      await fetchProcesses();
      setDeleteDialogOpen(false);
      setSelectedProcess(null);
    } catch (error) {
      console.error('Failed to delete process:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (process: Process) => {
    setSelectedProcess(process);
    setFormDialogOpen(true);
  };

  const handleDeleteClick = (process: Process) => {
    setSelectedProcess(process);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: CreateProcessDto) => {
    if (selectedProcess) {
      handleUpdateProcess(data);
    } else {
      handleCreateProcess(data);
    }
  };

  const handleAddNew = () => {
    setSelectedProcess(null);
    setFormDialogOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Processos"
        description="Gerencie os processos da organização"
        actions={
          <Button onClick={handleAddNew} className="hover-scale">
            <Plus className="mr-2 h-4 w-4" />
            Novo Processo
          </Button>
        }
      />

      <ItemList
        items={processes}
        renderItem={(process) => (
          <ProcessCard
            process={process}
            onEdit={() => handleEditClick(process)}
            onDelete={() => handleDeleteClick(process)}
          />
        )}
        emptyState={
          <EmptyState
            title="Nenhum processo encontrado"
            description="Crie um processo para começar a mapear as atividades da organização."
            actionLabel="Criar Processo"
            icon={<Layers className="h-8 w-8 text-primary" />}
            onAction={handleAddNew}
          />
        }
        isLoading={isLoading}
        gridCols={3}
      />

      <FormDialog
        isOpen={formDialogOpen}
        title={selectedProcess ? "Editar Processo" : "Novo Processo"}
        onClose={() => {
          setFormDialogOpen(false);
          setSelectedProcess(null);
        }}
      >
        <ProcessForm
          initialData={selectedProcess || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setFormDialogOpen(false);
            setSelectedProcess(null);
          }}
          isSubmitting={isSubmitting}
        />
      </FormDialog>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        title="Excluir Processo"
        description={`Tem certeza que deseja excluir o processo "${selectedProcess?.name}"? Esta ação não pode ser desfeita e todos os subprocessos relacionados serão excluídos.`}
        cancelText="Cancelar"
        confirmText="Excluir"
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedProcess(null);
        }}
        onConfirm={handleDeleteProcess}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProcessList;


import React, { useEffect, useState } from 'react';
import { Plus, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/layout/PageHeader';
import SubProcessCard from '@/components/cards/SubProcessCard';
import EmptyState from '@/components/lists/EmptyState';
import ItemList from '@/components/lists/ItemList';
import ConfirmationDialog from '@/components/modals/ConfirmationDialog';
import FormDialog from '@/components/modals/FormDialog';
import SubProcessForm from '@/components/forms/SubProcessForm';
import { SubProcess, CreateSubProcessDto } from '@/types/models';
import { subProcessService } from '@/services/api';

const SubProcessList = () => {
  const navigate = useNavigate();
  const [subprocesses, setSubprocesses] = useState<SubProcess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSubprocess, setSelectedSubprocess] = useState<SubProcess | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSubprocesses();
  }, []);

  const fetchSubprocesses = async () => {
    setIsLoading(true);
    try {
      const data = await subProcessService.getAll();
      setSubprocesses(data);
    } catch (error) {
      console.error('Failed to fetch subprocesses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubprocess = async (data: CreateSubProcessDto) => {
    setIsSubmitting(true);
    try {
      await subProcessService.create(data);
      await fetchSubprocesses();
      setFormDialogOpen(false);
    } catch (error) {
      console.error('Failed to create subprocess:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubprocess = async (data: CreateSubProcessDto) => {
    if (!selectedSubprocess) return;
    
    setIsSubmitting(true);
    try {
      await subProcessService.update(selectedSubprocess.id, data);
      await fetchSubprocesses();
      setFormDialogOpen(false);
      setSelectedSubprocess(null);
    } catch (error) {
      console.error('Failed to update subprocess:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubprocess = async () => {
    if (!selectedSubprocess) return;
    
    setIsDeleting(true);
    try {
      await subProcessService.delete(selectedSubprocess.id);
      await fetchSubprocesses();
      setDeleteDialogOpen(false);
      setSelectedSubprocess(null);
    } catch (error) {
      console.error('Failed to delete subprocess:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (subprocess: SubProcess) => {
    setSelectedSubprocess(subprocess);
    setFormDialogOpen(true);
  };

  const handleDeleteClick = (subprocess: SubProcess) => {
    setSelectedSubprocess(subprocess);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: CreateSubProcessDto) => {
    if (selectedSubprocess) {
      handleUpdateSubprocess(data);
    } else {
      handleCreateSubprocess(data);
    }
  };

  const handleAddNew = () => {
    setSelectedSubprocess(null);
    setFormDialogOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Subprocessos"
        description="Gerencie os subprocessos da organização"
        actions={
          <Button onClick={handleAddNew} className="hover-scale">
            <Plus className="mr-2 h-4 w-4" />
            Novo Subprocesso
          </Button>
        }
      />

      <ItemList
        items={subprocesses}
        renderItem={(subprocess) => (
          <SubProcessCard
            subprocess={subprocess}
            onEdit={() => handleEditClick(subprocess)}
            onDelete={() => handleDeleteClick(subprocess)}
          />
        )}
        emptyState={
          <EmptyState
            title="Nenhum subprocesso encontrado"
            description="Crie um subprocesso para detalhar as etapas dos processos da organização."
            actionLabel="Criar Subprocesso"
            icon={<LayoutGrid className="h-8 w-8 text-primary" />}
            onAction={handleAddNew}
          />
        }
        isLoading={isLoading}
        gridCols={2}
      />

      <FormDialog
        isOpen={formDialogOpen}
        title={selectedSubprocess ? "Editar Subprocesso" : "Novo Subprocesso"}
        onClose={() => {
          setFormDialogOpen(false);
          setSelectedSubprocess(null);
        }}
      >
        <SubProcessForm
          initialData={selectedSubprocess || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setFormDialogOpen(false);
            setSelectedSubprocess(null);
          }}
          isSubmitting={isSubmitting}
        />
      </FormDialog>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        title="Excluir Subprocesso"
        description={`Tem certeza que deseja excluir o subprocesso "${selectedSubprocess?.name}"? Esta ação não pode ser desfeita.`}
        cancelText="Cancelar"
        confirmText="Excluir"
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedSubprocess(null);
        }}
        onConfirm={handleDeleteSubprocess}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default SubProcessList;

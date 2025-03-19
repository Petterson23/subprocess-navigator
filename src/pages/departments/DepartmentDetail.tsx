
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Briefcase, 
  Edit, 
  Layers, 
  Plus, 
  RefreshCw, 
  Trash2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/layout/PageHeader';
import ProcessCard from '@/components/cards/ProcessCard';
import EmptyState from '@/components/lists/EmptyState';
import ItemList from '@/components/lists/ItemList';
import ConfirmationDialog from '@/components/modals/ConfirmationDialog';
import FormDialog from '@/components/modals/FormDialog';
import DepartmentForm from '@/components/forms/DepartmentForm';
import ProcessForm from '@/components/forms/ProcessForm';
import { Department, Process, CreateDepartmentDto, CreateProcessDto } from '@/types/models';
import { departmentService, processService } from '@/services/api';

const DepartmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const departmentId = parseInt(id || '0');
  
  const [department, setDepartment] = useState<Department | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [departmentFormOpen, setDepartmentFormOpen] = useState(false);
  const [processFormOpen, setProcessFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [processDeleteDialogOpen, setProcessDeleteDialogOpen] = useState(false);
  
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (departmentId) {
      fetchDepartment();
    }
  }, [departmentId]);

  const fetchDepartment = async () => {
    setIsLoading(true);
    try {
      const data = await departmentService.getById(departmentId);
      setDepartment(data);
      setProcesses(data.processes || []);
    } catch (error) {
      console.error('Failed to fetch department:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDepartment();
    setIsRefreshing(false);
  };

  const handleUpdateDepartment = async (data: CreateDepartmentDto) => {
    if (!department) return;
    
    setIsSubmitting(true);
    try {
      await departmentService.update(department.id, data);
      await fetchDepartment();
      setDepartmentFormOpen(false);
    } catch (error) {
      console.error('Failed to update department:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDepartment = async () => {
    if (!department) return;
    
    setIsDeleting(true);
    try {
      await departmentService.delete(department.id);
      setDeleteDialogOpen(false);
      navigate('/departments');
    } catch (error) {
      console.error('Failed to delete department:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateProcess = async (data: CreateProcessDto) => {
    setIsSubmitting(true);
    try {
      await processService.create(data);
      await fetchDepartment();
      setProcessFormOpen(false);
      setSelectedProcess(null);
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
      await fetchDepartment();
      setProcessFormOpen(false);
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
      await fetchDepartment();
      setProcessDeleteDialogOpen(false);
      setSelectedProcess(null);
    } catch (error) {
      console.error('Failed to delete process:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleProcessFormSubmit = (data: CreateProcessDto) => {
    if (selectedProcess) {
      handleUpdateProcess(data);
    } else {
      handleCreateProcess(data);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Carregando departamento...</p>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Departamento não encontrado</h2>
        <Button asChild>
          <Link to="/departments">Voltar para Departamentos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          asChild
          className="mb-4 hover-scale"
        >
          <Link to="/departments">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Departamentos
          </Link>
        </Button>

        <PageHeader
          title={department.name}
          description="Detalhes do departamento e seus processos"
          actions={
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="hover-scale"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setDepartmentFormOpen(true)}
                className="hover-scale"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive hover:text-destructive hover-scale"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </div>
          }
        />
      </div>

      <Card className="mb-8 overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Briefcase className="mr-2 h-5 w-5 text-primary" />
            Informações do Departamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome</p>
              <p className="font-medium">{department.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Processos</p>
              <p className="font-medium">
                <Badge variant="secondary">
                  {processes.length} processo{processes.length !== 1 ? 's' : ''}
                </Badge>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Processos</h2>
        <Button onClick={() => {
          setSelectedProcess(null);
          setProcessFormOpen(true);
        }} className="hover-scale">
          <Plus className="mr-2 h-4 w-4" />
          Novo Processo
        </Button>
      </div>

      <ItemList
        items={processes}
        renderItem={(process) => (
          <ProcessCard
            process={process}
            onEdit={() => {
              setSelectedProcess(process);
              setProcessFormOpen(true);
            }}
            onDelete={() => {
              setSelectedProcess(process);
              setProcessDeleteDialogOpen(true);
            }}
          />
        )}
        emptyState={
          <EmptyState
            title="Nenhum processo encontrado"
            description={`Adicione processos ao departamento "${department.name}".`}
            actionLabel="Adicionar Processo"
            icon={<Layers className="h-8 w-8 text-primary" />}
            onAction={() => {
              setSelectedProcess(null);
              setProcessFormOpen(true);
            }}
          />
        }
        isLoading={false}
        gridCols={2}
      />

      {/* Department Form Dialog */}
      <FormDialog
        isOpen={departmentFormOpen}
        title="Editar Departamento"
        onClose={() => setDepartmentFormOpen(false)}
      >
        <DepartmentForm
          initialData={department}
          onSubmit={handleUpdateDepartment}
          onCancel={() => setDepartmentFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      </FormDialog>

      {/* Process Form Dialog */}
      <FormDialog
        isOpen={processFormOpen}
        title={selectedProcess ? "Editar Processo" : "Novo Processo"}
        onClose={() => {
          setProcessFormOpen(false);
          setSelectedProcess(null);
        }}
      >
        <ProcessForm
          initialData={selectedProcess || undefined}
          onSubmit={handleProcessFormSubmit}
          onCancel={() => {
            setProcessFormOpen(false);
            setSelectedProcess(null);
          }}
          isSubmitting={isSubmitting}
        />
      </FormDialog>

      {/* Department Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        title="Excluir Departamento"
        description={`Tem certeza que deseja excluir o departamento "${department.name}"? Esta ação não pode ser desfeita e todos os processos relacionados também serão excluídos.`}
        cancelText="Cancelar"
        confirmText="Excluir"
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteDepartment}
        isLoading={isDeleting}
      />

      {/* Process Delete Confirmation */}
      <ConfirmationDialog
        isOpen={processDeleteDialogOpen}
        title="Excluir Processo"
        description={`Tem certeza que deseja excluir o processo "${selectedProcess?.name}"? Esta ação não pode ser desfeita e todos os subprocessos relacionados também serão excluídos.`}
        cancelText="Cancelar"
        confirmText="Excluir"
        onCancel={() => {
          setProcessDeleteDialogOpen(false);
          setSelectedProcess(null);
        }}
        onConfirm={handleDeleteProcess}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DepartmentDetail;

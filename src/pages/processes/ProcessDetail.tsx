
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Layers, 
  Edit, 
  LayoutGrid, 
  Plus, 
  RefreshCw, 
  Trash2,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/layout/PageHeader';
import SubProcessCard from '@/components/cards/SubProcessCard';
import EmptyState from '@/components/lists/EmptyState';
import ItemList from '@/components/lists/ItemList';
import ConfirmationDialog from '@/components/modals/ConfirmationDialog';
import FormDialog from '@/components/modals/FormDialog';
import ProcessForm from '@/components/forms/ProcessForm';
import SubProcessForm from '@/components/forms/SubProcessForm';
import { Process, SubProcess, CreateProcessDto, CreateSubProcessDto } from '@/types/models';
import { processService, subProcessService } from '@/services/api';

const ProcessDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const processId = parseInt(id || '0');
  
  const [process, setProcess] = useState<Process | null>(null);
  const [subprocesses, setSubprocesses] = useState<SubProcess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [processFormOpen, setProcessFormOpen] = useState(false);
  const [subprocessFormOpen, setSubprocessFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subprocessDeleteDialogOpen, setSubprocessDeleteDialogOpen] = useState(false);
  
  const [selectedSubprocess, setSelectedSubprocess] = useState<SubProcess | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (processId) {
      fetchProcess();
    }
  }, [processId]);

  const fetchProcess = async () => {
    setIsLoading(true);
    try {
      const data = await processService.getById(processId);
      setProcess(data);
      setSubprocesses(data.subProcesses || []);
    } catch (error) {
      console.error('Failed to fetch process:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProcess();
    setIsRefreshing(false);
  };

  const handleUpdateProcess = async (data: CreateProcessDto) => {
    if (!process) return;
    
    setIsSubmitting(true);
    try {
      await processService.update(process.id, data);
      await fetchProcess();
      setProcessFormOpen(false);
    } catch (error) {
      console.error('Failed to update process:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProcess = async () => {
    if (!process) return;
    
    setIsDeleting(true);
    try {
      await processService.delete(process.id);
      setDeleteDialogOpen(false);
      navigate('/processes');
    } catch (error) {
      console.error('Failed to delete process:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateSubprocess = async (data: CreateSubProcessDto) => {
    setIsSubmitting(true);
    try {
      await subProcessService.create(data);
      await fetchProcess();
      setSubprocessFormOpen(false);
      setSelectedSubprocess(null);
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
      await fetchProcess();
      setSubprocessFormOpen(false);
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
      await fetchProcess();
      setSubprocessDeleteDialogOpen(false);
      setSelectedSubprocess(null);
    } catch (error) {
      console.error('Failed to delete subprocess:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubprocessFormSubmit = (data: CreateSubProcessDto) => {
    if (selectedSubprocess) {
      handleUpdateSubprocess(data);
    } else {
      handleCreateSubprocess(data);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Carregando processo...</p>
        </div>
      </div>
    );
  }

  if (!process) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Processo não encontrado</h2>
        <Button asChild>
          <Link to="/processes">Voltar para Processos</Link>
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
          <Link to="/processes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Processos
          </Link>
        </Button>

        <PageHeader
          title={process.name}
          description="Detalhes do processo e seus subprocessos"
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
                onClick={() => setProcessFormOpen(true)}
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
            <Layers className="mr-2 h-5 w-5 text-primary" />
            Informações do Processo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome</p>
              <p className="font-medium">{process.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Departamento</p>
              <p>
                {process.department ? (
                  <Badge variant="secondary" className="flex items-center w-fit">
                    <Briefcase className="h-3 w-3 mr-1" />
                    <Link to={`/departments/${process.departmentId}`} className="hover:underline">
                      {process.department.name}
                    </Link>
                  </Badge>
                ) : (
                  <span className="text-muted-foreground italic">Não definido</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subprocessos</p>
              <p className="font-medium">
                <Badge variant="secondary">
                  {subprocesses.length} subprocesso{subprocesses.length !== 1 ? 's' : ''}
                </Badge>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Subprocessos</h2>
        <Button onClick={() => {
          setSelectedSubprocess(null);
          setSubprocessFormOpen(true);
        }} className="hover-scale">
          <Plus className="mr-2 h-4 w-4" />
          Novo Subprocesso
        </Button>
      </div>

      <ItemList
        items={subprocesses}
        renderItem={(subprocess) => (
          <SubProcessCard
            subprocess={subprocess}
            onEdit={() => {
              setSelectedSubprocess(subprocess);
              setSubprocessFormOpen(true);
            }}
            onDelete={() => {
              setSelectedSubprocess(subprocess);
              setSubprocessDeleteDialogOpen(true);
            }}
          />
        )}
        emptyState={
          <EmptyState
            title="Nenhum subprocesso encontrado"
            description={`Adicione subprocessos ao processo "${process.name}".`}
            actionLabel="Adicionar Subprocesso"
            icon={<LayoutGrid className="h-8 w-8 text-primary" />}
            onAction={() => {
              setSelectedSubprocess(null);
              setSubprocessFormOpen(true);
            }}
          />
        }
        isLoading={false}
        gridCols={2}
      />

      {/* Process Form Dialog */}
      <FormDialog
        isOpen={processFormOpen}
        title="Editar Processo"
        onClose={() => setProcessFormOpen(false)}
      >
        <ProcessForm
          initialData={process}
          onSubmit={handleUpdateProcess}
          onCancel={() => setProcessFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      </FormDialog>

      {/* Subprocess Form Dialog */}
      <FormDialog
        isOpen={subprocessFormOpen}
        title={selectedSubprocess ? "Editar Subprocesso" : "Novo Subprocesso"}
        onClose={() => {
          setSubprocessFormOpen(false);
          setSelectedSubprocess(null);
        }}
      >
        <SubProcessForm
          initialData={selectedSubprocess || undefined}
          onSubmit={handleSubprocessFormSubmit}
          onCancel={() => {
            setSubprocessFormOpen(false);
            setSelectedSubprocess(null);
          }}
          isSubmitting={isSubmitting}
        />
      </FormDialog>

      {/* Process Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        title="Excluir Processo"
        description={`Tem certeza que deseja excluir o processo "${process.name}"? Esta ação não pode ser desfeita e todos os subprocessos relacionados também serão excluídos.`}
        cancelText="Cancelar"
        confirmText="Excluir"
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteProcess}
        isLoading={isDeleting}
      />

      {/* Subprocess Delete Confirmation */}
      <ConfirmationDialog
        isOpen={subprocessDeleteDialogOpen}
        title="Excluir Subprocesso"
        description={`Tem certeza que deseja excluir o subprocesso "${selectedSubprocess?.name}"? Esta ação não pode ser desfeita.`}
        cancelText="Cancelar"
        confirmText="Excluir"
        onCancel={() => {
          setSubprocessDeleteDialogOpen(false);
          setSelectedSubprocess(null);
        }}
        onConfirm={handleDeleteSubprocess}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProcessDetail;

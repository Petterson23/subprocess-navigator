
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  LayoutGrid, 
  Edit, 
  RefreshCw, 
  Trash2,
  Layers,
  Tool,
  Users,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/layout/PageHeader';
import ConfirmationDialog from '@/components/modals/ConfirmationDialog';
import FormDialog from '@/components/modals/FormDialog';
import SubProcessForm from '@/components/forms/SubProcessForm';
import { SubProcess, CreateSubProcessDto } from '@/types/models';
import { subProcessService } from '@/services/api';

const SubProcessDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const subprocessId = parseInt(id || '0');
  
  const [subprocess, setSubprocess] = useState<SubProcess | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (subprocessId) {
      fetchSubprocess();
    }
  }, [subprocessId]);

  const fetchSubprocess = async () => {
    setIsLoading(true);
    try {
      const data = await subProcessService.getById(subprocessId);
      setSubprocess(data);
    } catch (error) {
      console.error('Failed to fetch subprocess:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSubprocess();
    setIsRefreshing(false);
  };

  const handleUpdateSubprocess = async (data: CreateSubProcessDto) => {
    if (!subprocess) return;
    
    setIsSubmitting(true);
    try {
      await subProcessService.update(subprocess.id, data);
      await fetchSubprocess();
      setFormDialogOpen(false);
    } catch (error) {
      console.error('Failed to update subprocess:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubprocess = async () => {
    if (!subprocess) return;
    
    setIsDeleting(true);
    try {
      await subProcessService.delete(subprocess.id);
      setDeleteDialogOpen(false);
      navigate('/subprocesses');
    } catch (error) {
      console.error('Failed to delete subprocess:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Carregando subprocesso...</p>
        </div>
      </div>
    );
  }

  if (!subprocess) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Subprocesso não encontrado</h2>
        <Button asChild>
          <Link to="/subprocesses">Voltar para Subprocessos</Link>
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
          <Link to="/subprocesses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Subprocessos
          </Link>
        </Button>

        <PageHeader
          title={subprocess.name}
          description="Detalhes do subprocesso"
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
                onClick={() => setFormDialogOpen(true)}
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
            <LayoutGrid className="mr-2 h-5 w-5 text-primary" />
            Informações do Subprocesso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome</p>
              <p className="font-medium">{subprocess.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Processo</p>
              <p>
                {subprocess.process ? (
                  <Badge variant="secondary" className="flex items-center w-fit">
                    <Layers className="h-3 w-3 mr-1" />
                    <Link to={`/processes/${subprocess.processId}`} className="hover:underline">
                      {subprocess.process.name}
                    </Link>
                  </Badge>
                ) : (
                  <span className="text-muted-foreground italic">Não definido</span>
                )}
              </p>
            </div>
          </div>

          {subprocess.description && (
            <div>
              <h3 className="text-lg font-medium mb-2">Descrição</h3>
              <div className="p-4 bg-muted/30 rounded-md">
                <p className="whitespace-pre-line">{subprocess.description}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subprocess.tools && (
              <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Tool className="mr-2 h-4 w-4 text-primary" />
                    Ferramentas Utilizadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{subprocess.tools}</p>
                </CardContent>
              </Card>
            )}
            
            {subprocess.responsibles && (
              <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Users className="mr-2 h-4 w-4 text-primary" />
                    Responsáveis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{subprocess.responsibles}</p>
                </CardContent>
              </Card>
            )}
            
            {subprocess.documentation && (
              <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-primary" />
                    Documentação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{subprocess.documentation}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subprocess Form Dialog */}
      <FormDialog
        isOpen={formDialogOpen}
        title="Editar Subprocesso"
        onClose={() => setFormDialogOpen(false)}
      >
        <SubProcessForm
          initialData={subprocess}
          onSubmit={handleUpdateSubprocess}
          onCancel={() => setFormDialogOpen(false)}
          isSubmitting={isSubmitting}
        />
      </FormDialog>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        title="Excluir Subprocesso"
        description={`Tem certeza que deseja excluir o subprocesso "${subprocess.name}"? Esta ação não pode ser desfeita.`}
        cancelText="Cancelar"
        confirmText="Excluir"
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteSubprocess}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default SubProcessDetail;

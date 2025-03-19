
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SubProcess, CreateSubProcessDto, Process } from '@/types/models';
import { processService } from '@/services/api';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Nome do subprocesso é obrigatório' }),
  processId: z.string().min(1, { message: 'Processo é obrigatório' }),
  description: z.string().optional(),
  tools: z.string().optional(),
  responsibles: z.string().optional(),
  documentation: z.string().optional(),
});

interface SubProcessFormProps {
  initialData?: SubProcess;
  onSubmit: (data: CreateSubProcessDto) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const SubProcessForm: React.FC<SubProcessFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      processId: initialData?.processId ? String(initialData.processId) : '',
      description: initialData?.description || '',
      tools: initialData?.tools || '',
      responsibles: initialData?.responsibles || '',
      documentation: initialData?.documentation || '',
    }
  });

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const data = await processService.getAll();
        setProcesses(data);
      } catch (error) {
        console.error('Failed to fetch processes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcesses();
  }, []);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      name: values.name,
      processId: parseInt(values.processId),
      description: values.description,
      tools: values.tools,
      responsibles: values.responsibles,
      documentation: values.documentation,
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">Carregando processos...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Subprocesso</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Triagem de currículos" 
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="processId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Processo</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Selecione um processo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {processes.map((process) => (
                      <SelectItem key={process.id} value={String(process.id)}>
                        {process.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva o subprocesso detalhadamente" 
                  {...field}
                  className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="tools"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ferramentas Utilizadas</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Trello, Notion, Excel" 
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="responsibles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsáveis</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Equipe de Recrutamento" 
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="documentation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documentação</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ex: Fluxos, modelos, guias" 
                  {...field}
                  className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="hover-scale"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="hover-scale"
          >
            {initialData ? 'Atualizar' : 'Criar'} Subprocesso
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SubProcessForm;

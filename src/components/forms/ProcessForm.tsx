
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
import { Process, CreateProcessDto, Department } from '@/types/models';
import { departmentService } from '@/services/api';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Nome do processo é obrigatório' }),
  departmentId: z.string().min(1, { message: 'Departamento é obrigatório' }),
});

interface ProcessFormProps {
  initialData?: Process;
  onSubmit: (data: CreateProcessDto) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ProcessForm: React.FC<ProcessFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      departmentId: initialData?.departmentId ? String(initialData.departmentId) : '',
    }
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await departmentService.getAll();
        setDepartments(data);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      name: values.name,
      departmentId: parseInt(values.departmentId),
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">Carregando departamentos...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 animate-fade-in">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Processo</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Recrutamento e Seleção" 
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
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departamento</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Selecione um departamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={String(department.id)}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            {initialData ? 'Atualizar' : 'Criar'} Processo
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProcessForm;

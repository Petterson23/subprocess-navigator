
import React from 'react';
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
import { Input } from '@/components/ui/input';
import { Department, CreateDepartmentDto } from '@/types/models';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Nome do departamento é obrigatório' })
});

interface DepartmentFormProps {
  initialData?: Department;
  onSubmit: (data: CreateDepartmentDto) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Departamento</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Recursos Humanos" 
                  {...field} 
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  autoFocus
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
            {initialData ? 'Atualizar' : 'Criar'} Departamento
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DepartmentForm;


import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Department } from '@/types/models';
import { cn } from '@/lib/utils';

interface DepartmentCardProps {
  department: Department;
  onEdit: () => void;
  onDelete: () => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({ department, onEdit, onDelete }) => {
  return (
    <Card className={cn(
      "overflow-hidden hover:shadow-lg transition-all duration-300 group", 
      "bg-opacity-95 hover:bg-opacity-100 hover:-translate-y-1",
      "animate-fade-in"
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Briefcase className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">{department.name}</CardTitle>
          </div>
          <Badge variant="outline" className="bg-primary/5">
            {department.processes?.length || 0} Processos
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {department.processes && department.processes.length > 0 ? (
          <ul className="space-y-1">
            {department.processes.slice(0, 3).map((process) => (
              <li key={process.id} className="flex items-center text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mr-2" />
                {process.name}
              </li>
            ))}
            {department.processes.length > 3 && (
              <li className="text-sm text-muted-foreground italic">
                + {department.processes.length - 3} outros processos
              </li>
            )}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Nenhum processo cadastrado
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-4 border-t">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
        <Button asChild variant="ghost" size="sm" className="ml-auto group-hover:bg-primary/10">
          <Link to={`/departments/${department.id}`}>
            Detalhes
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DepartmentCard;

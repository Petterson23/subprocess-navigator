
import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, ChevronRight, Edit, Trash2, Tool, Users, FileText } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SubProcess } from '@/types/models';
import { cn } from '@/lib/utils';

interface SubProcessCardProps {
  subprocess: SubProcess;
  onEdit: () => void;
  onDelete: () => void;
}

const SubProcessCard: React.FC<SubProcessCardProps> = ({ subprocess, onEdit, onDelete }) => {
  return (
    <Card className={cn(
      "overflow-hidden hover:shadow-lg transition-all duration-300 group", 
      "bg-opacity-95 hover:bg-opacity-100 hover:-translate-y-1",
      "animate-fade-in"
    )}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">{subprocess.name}</CardTitle>
          </div>
          {subprocess.process && (
            <Badge variant="secondary">
              {subprocess.process.name}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-3">
        {subprocess.description && (
          <div className="text-sm text-muted-foreground">
            {subprocess.description.length > 120 
              ? `${subprocess.description.substring(0, 120)}...` 
              : subprocess.description
            }
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {subprocess.tools && (
            <div className="flex items-start gap-2">
              <Tool className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium">Ferramentas</p>
                <p className="text-sm">{subprocess.tools}</p>
              </div>
            </div>
          )}
          
          {subprocess.responsibles && (
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium">Responsáveis</p>
                <p className="text-sm">{subprocess.responsibles}</p>
              </div>
            </div>
          )}
          
          {subprocess.documentation && (
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium">Documentação</p>
                <p className="text-sm">
                  {subprocess.documentation.length > 40 
                    ? `${subprocess.documentation.substring(0, 40)}...` 
                    : subprocess.documentation
                  }
                </p>
              </div>
            </div>
          )}
        </div>
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
          <Link to={`/subprocesses/${subprocess.id}`}>
            Detalhes
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubProcessCard;

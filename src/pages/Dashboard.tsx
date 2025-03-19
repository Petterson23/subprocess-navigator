
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { departmentService, processService, subProcessService } from '@/services/api';
import { Department, Process, SubProcess } from '@/types/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/layout/PageHeader';
import { Briefcase, ChevronRight, Layers, LayoutGrid, Plus } from 'lucide-react';

const Dashboard = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [subprocesses, setSubprocesses] = useState<SubProcess[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depts, procs, subprocs] = await Promise.all([
          departmentService.getAll(),
          processService.getAll(),
          subProcessService.getAll(),
        ]);
        setDepartments(depts);
        setProcesses(procs);
        setSubprocesses(subprocs);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const recentItems = (type: 'departments' | 'processes' | 'subprocesses') => {
    switch(type) {
      case 'departments':
        return departments.slice(0, 5);
      case 'processes':
        return processes.slice(0, 5);
      case 'subprocesses':
        return subprocesses.slice(0, 5);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Dashboard"
        description="Visão geral do mapeamento de processos da organização"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Departamentos" 
          value={departments.length} 
          icon={<Briefcase className="h-8 w-8" />}
          link="/departments"
          isLoading={isLoading}
        />
        <StatCard 
          title="Processos" 
          value={processes.length}
          icon={<Layers className="h-8 w-8" />}
          link="/processes"
          isLoading={isLoading}
        />
        <StatCard 
          title="Subprocessos" 
          value={subprocesses.length}
          icon={<LayoutGrid className="h-8 w-8" />}
          link="/subprocesses"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentItemsCard 
          title="Departamentos recentes"
          items={recentItems('departments')}
          emptyText="Nenhum departamento cadastrado"
          createPath="/departments/new"
          createText="Criar departamento"
          viewAllPath="/departments"
          isLoading={isLoading}
          type="department"
        />
        <RecentItemsCard 
          title="Processos recentes"
          items={recentItems('processes')}
          emptyText="Nenhum processo cadastrado"
          createPath="/processes/new"
          createText="Criar processo"
          viewAllPath="/processes"
          isLoading={isLoading}
          type="process"
        />
        <RecentItemsCard 
          title="Subprocessos recentes"
          items={recentItems('subprocesses')}
          emptyText="Nenhum subprocesso cadastrado"
          createPath="/subprocesses/new"
          createText="Criar subprocesso"
          viewAllPath="/subprocesses"
          isLoading={isLoading}
          type="subprocess"
        />
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  link: string;
  isLoading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, link, isLoading }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/10 text-primary mr-3">
              {icon}
            </div>
            {isLoading ? (
              <div className="w-16 h-10 bg-muted/50 rounded animate-pulse"></div>
            ) : (
              <span className="text-3xl font-bold">{value}</span>
            )}
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to={link} className="flex items-center">
              <span className="mr-1">Ver todos</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface RecentItemsCardProps {
  title: string;
  items: (Department | Process | SubProcess)[];
  emptyText: string;
  createPath: string;
  createText: string;
  viewAllPath: string;
  isLoading: boolean;
  type: 'department' | 'process' | 'subprocess';
}

const RecentItemsCard: React.FC<RecentItemsCardProps> = ({ 
  title, items, emptyText, createPath, createText, viewAllPath, isLoading, type 
}) => {
  // Determine the correct path and icon for each type
  const getPathAndIcon = (item: Department | Process | SubProcess) => {
    switch(type) {
      case 'department':
        return { 
          path: `/departments/${item.id}`,
          icon: <Briefcase className="h-4 w-4" />
        };
      case 'process':
        return { 
          path: `/processes/${item.id}`,
          icon: <Layers className="h-4 w-4" />
        };
      case 'subprocess':
        return { 
          path: `/subprocesses/${item.id}`,
          icon: <LayoutGrid className="h-4 w-4" />
        };
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link to={viewAllPath}>
            <span className="text-sm">Ver todos</span>
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-full h-8 bg-muted/50 rounded animate-pulse"></div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <ul className="space-y-3">
            {items.map(item => {
              const { path, icon } = getPathAndIcon(item);
              return (
                <li key={item.id} className="group">
                  <Link to={path} className="flex items-center p-2 rounded-md hover:bg-muted/80 transition-colors">
                    <div className="mr-3 p-1.5 rounded-md bg-primary/10 text-primary">
                      {icon}
                    </div>
                    <span className="flex-1 text-sm font-medium">{item.name}</span>
                    <ChevronRight className="h-4 w-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center py-4 text-center">
            <p className="text-sm text-muted-foreground mb-3">{emptyText}</p>
            <Button asChild size="sm">
              <Link to={createPath}>
                <Plus className="h-4 w-4 mr-1" />
                {createText}
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { IndumentariaForm } from './components/IndumentariaForm';
import { User, UniformRecord, AuditLog } from './types';
import { Download, Upload, Plus, Edit2, LogOut, History } from 'lucide-react';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'TABLE' | 'FORM' | 'AUDIT'>('TABLE');
  const [records, setRecords] = useState<UniformRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [editingRecord, setEditingRecord] = useState<UniformRecord | undefined>(undefined);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('altepetl_records');
    const savedLogs = localStorage.getItem('altepetl_logs');
    if (savedRecords) setRecords(JSON.parse(savedRecords));
    if (savedLogs) setAuditLogs(JSON.parse(savedLogs));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('altepetl_records', JSON.stringify(records));
    localStorage.setItem('altepetl_logs', JSON.stringify(auditLogs));
  }, [records, auditLogs]);

  const addAuditLog = (action: AuditLog['action'], details: string) => {
    if (!currentUser) return;
    const newLog: AuditLog = {
      date: new Date().toISOString(),
      user: currentUser.username,
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleSaveRecord = (record: UniformRecord) => {
    if (editingRecord) {
      setRecords(prev => prev.map(r => r.id === record.id ? record : r));
      addAuditLog('UPDATE', `Modificó registro de: ${record.nombreCompleto}`);
    } else {
      setRecords(prev => [...prev, record]);
      addAuditLog('CREATE', `Creó registro de: ${record.nombreCompleto}`);
    }
    setView('TABLE');
    setEditingRecord(undefined);
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Control Indumentaria");
    XLSX.writeFile(wb, "Control_Indumentaria_Altepetl.xlsx");
    addAuditLog('IMPORT', 'Exportó base de datos a Excel');
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws) as any[];
          
          // Basic mapping/validation could go here. Assuming simple structure match for demo.
          const importedRecords: UniformRecord[] = data.map((row: any) => ({
             ...row,
             id: row.id || crypto.randomUUID(),
             createdAt: row.createdAt || new Date().toISOString(),
             updatedAt: new Date().toISOString(),
             createdBy: row.createdBy || currentUser?.username || 'IMPORT',
             lastModifiedBy: currentUser?.username || 'IMPORT'
          }));

          setRecords(prev => [...prev, ...importedRecords]);
          addAuditLog('IMPORT', `Importó ${importedRecords.length} registros desde Excel`);
          alert('Importación exitosa');
        } catch (error) {
          console.error(error);
          alert('Error al leer el archivo Excel');
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  if (!currentUser) {
    return <LoginForm onLogin={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-cdmx-guinda text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">CONTROL DE INDUMENTARIA</h1>
            <p className="text-sm text-cdmx-gold font-semibold">"PROGRAMA ALTEPETL BIENESTAR"</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-right hidden md:block">
              <p className="font-bold">{currentUser.fullName}</p>
              <p className="text-xs opacity-80">{currentUser.username}</p>
            </div>
            <button 
              onClick={() => { setCurrentUser(null); setView('TABLE'); }}
              className="p-2 hover:bg-[#851b35] rounded-full transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        
        {/* Toolbar */}
        {view === 'TABLE' && (
          <div className="mb-6 flex flex-wrap gap-4 justify-between items-center bg-white p-4 rounded-lg shadow-sm">
            <div className="flex gap-2">
              <button
                onClick={() => { setEditingRecord(undefined); setView('FORM'); }}
                className="flex items-center gap-2 bg-cdmx-gold text-white px-4 py-2 rounded hover:bg-[#967d3e] transition-colors font-semibold"
              >
                <Plus size={18} /> Nuevo Registro
              </button>
              <button
                onClick={() => setView('AUDIT')}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                <History size={18} /> Historial
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <label className="cursor-pointer flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                <Upload size={18} /> Importar Excel
                <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleImportExcel} />
              </label>
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                <Download size={18} /> Exportar Excel
              </button>
            </div>
          </div>
        )}

        {/* View Switching */}
        {view === 'FORM' && (
          <IndumentariaForm
            initialData={editingRecord}
            currentUser={currentUser.username}
            onSave={handleSaveRecord}
            onCancel={() => { setEditingRecord(undefined); setView('TABLE'); }}
          />
        )}

        {view === 'AUDIT' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
             <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Historial de Cambios</h2>
                <button onClick={() => setView('TABLE')} className="text-cdmx-guinda hover:underline">Volver</button>
             </div>
             <div className="overflow-x-auto">
               <table className="min-w-full">
                 <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                    </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                    {auditLogs.map((log, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(log.date), 'dd/MM/yyyy HH:mm')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.user}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${log.action === 'CREATE' ? 'bg-green-100 text-green-800' : 
                              log.action === 'UPDATE' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-blue-100 text-blue-800'}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{log.details}</td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">Sin historial registrado</td></tr>
                    )}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {view === 'TABLE' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CURP</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Componente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prendas (Resumen)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Mod.</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => { setEditingRecord(record); setView('FORM'); }}
                          className="text-cdmx-guinda hover:text-[#851b35]"
                        >
                          <Edit2 size={18} />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.nombreCompleto}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.curp}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.componente}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {[
                          record.tallaPlayeraMangaLarga && `Playera: ${record.tallaPlayeraMangaLarga}`,
                          record.tallaPantalonCarga && `Pant: ${record.tallaPantalonCarga}`,
                          record.tallaBotas && `Botas: ${record.tallaBotas}`,
                          record.tallaChamarra && `Cham: ${record.tallaChamarra}`
                        ].filter(Boolean).join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         <div className="flex flex-col">
                           <span>{record.lastModifiedBy}</span>
                           <span className="text-xs">{format(new Date(record.updatedAt), 'dd/MM HH:mm')}</span>
                         </div>
                      </td>
                    </tr>
                  ))}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No hay registros. Comience agregando uno o importando un Excel.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Gobierno de la Ciudad de México - Programa Altepetl Bienestar</p>
        </div>
      </footer>
    </div>
  );
}
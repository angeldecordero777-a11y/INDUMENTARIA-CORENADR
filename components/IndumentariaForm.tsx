import React, { useState, useEffect } from 'react';
import { UniformRecord, ComponenteType } from '../types';
import { 
  TALLAS_LETRAS, TALLAS_PANTALON, TALLAS_BOTAS, TALLAS_IMPERMEABLE, 
  CATEGORIAS_BIENESTAR, VESTIMENTA_TYPES, LINEAS_AYUDA, CIIC_OPTIONS, ROLES_FACILITADORES 
} from '../constants';
import { Save, X } from 'lucide-react';

interface Props {
  initialData?: UniformRecord;
  currentUser: string;
  onSave: (record: UniformRecord) => void;
  onCancel: () => void;
}

export const IndumentariaForm: React.FC<Props> = ({ initialData, currentUser, onSave, onCancel }) => {
  // Common Fields
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [curp, setCurp] = useState('');
  const [areaResponsable, setAreaResponsable] = useState('');
  const [nombreResponsable, setNombreResponsable] = useState('');
  const [componente, setComponente] = useState<ComponenteType>('BIENESTAR PARA EL BOSQUE');

  // Bienestar Specific
  const [categoria, setCategoria] = useState('');
  const [tipoVestimenta, setTipoVestimenta] = useState('');
  const [lineaAyuda, setLineaAyuda] = useState('');
  const [ciic, setCiic] = useState('');
  const [brigada, setBrigada] = useState('');

  // Facilitadores Specific
  const [rolFacilitador, setRolFacilitador] = useState('');

  // Sizes
  const [tallaPlayeraMangaLarga, setTallaPlayeraMangaLarga] = useState('');
  const [tallaChamarra, setTallaChamarra] = useState('');
  const [tallaPantalonCarga, setTallaPantalonCarga] = useState('');
  const [tallaCamisola, setTallaCamisola] = useState('');
  const [tallaBotas, setTallaBotas] = useState('');
  const [tallaImpermeable, setTallaImpermeable] = useState('');
  const [tallaPlayeraPolo, setTallaPlayeraPolo] = useState('');
  const [tallaCamisaBlusa, setTallaCamisaBlusa] = useState('');
  const [tallaChaleco, setTallaChaleco] = useState('');

  useEffect(() => {
    if (initialData) {
      setNombreCompleto(initialData.nombreCompleto);
      setCurp(initialData.curp);
      setAreaResponsable(initialData.areaResponsable);
      setNombreResponsable(initialData.nombreResponsable);
      setComponente(initialData.componente);
      setCategoria(initialData.categoria || '');
      setTipoVestimenta(initialData.tipoVestimenta || '');
      setLineaAyuda(initialData.lineaAyuda || '');
      setCiic(initialData.ciic || '');
      setBrigada(initialData.brigada || '');
      setRolFacilitador(initialData.rolFacilitador || '');
      setTallaPlayeraMangaLarga(initialData.tallaPlayeraMangaLarga || '');
      setTallaChamarra(initialData.tallaChamarra || '');
      setTallaPantalonCarga(initialData.tallaPantalonCarga || '');
      setTallaCamisola(initialData.tallaCamisola || '');
      setTallaBotas(initialData.tallaBotas || '');
      setTallaImpermeable(initialData.tallaImpermeable || '');
      setTallaPlayeraPolo(initialData.tallaPlayeraPolo || '');
      setTallaCamisaBlusa(initialData.tallaCamisaBlusa || '');
      setTallaChaleco(initialData.tallaChaleco || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    
    const record: UniformRecord = {
      id: initialData?.id || crypto.randomUUID(),
      nombreCompleto,
      curp,
      areaResponsable,
      nombreResponsable,
      componente,
      // Bienestar fields
      ...(componente === 'BIENESTAR PARA EL BOSQUE' && {
        categoria,
        tipoVestimenta: tipoVestimenta as any,
        lineaAyuda: lineaAyuda as any,
        ciic,
        brigada,
        tallaPlayeraMangaLarga,
        tallaCamisola,
        tallaPantalonCarga,
        tallaBotas,
      }),
      // Facilitadores fields
      ...(componente === 'FACILITADORES DE SERVICIOS' && {
        rolFacilitador,
        tallaPlayeraPolo,
        tallaCamisaBlusa,
        tallaChaleco,
      }),
      // Vigilancia fields
      ...(componente === 'VIGILANCIA AMBIENTAL' && {
        tallaPlayeraPolo,
        tallaBotas,
        tallaPantalonCarga,
      }),
      // Common sizes based on component (Chamarra & Impermeable exist in all or some)
      tallaChamarra,
      tallaImpermeable,

      createdBy: initialData ? initialData.createdBy : currentUser,
      lastModifiedBy: currentUser,
      createdAt: initialData ? initialData.createdAt : now,
      updatedAt: now,
    };

    onSave(record);
  };

  const SelectField = ({ label, value, onChange, options }: any) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cdmx-gold focus:ring-cdmx-gold p-2 border"
        required
      >
        <option value="">Seleccione...</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6 border-b pb-2 border-gray-200">
        <h2 className="text-xl font-bold text-cdmx-guinda">
          {initialData ? 'Editar Registro' : 'Nuevo Registro'}
        </h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* General Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-cdmx-gold mb-3">Datos Generales</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input type="text" required value={nombreCompleto} onChange={e => setNombreCompleto(e.target.value.toUpperCase())} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:ring-cdmx-gold focus:border-cdmx-gold" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">CURP</label>
            <input type="text" required value={curp} onChange={e => setCurp(e.target.value.toUpperCase())} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:ring-cdmx-gold focus:border-cdmx-gold" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Área Responsable</label>
            <input type="text" required value={areaResponsable} onChange={e => setAreaResponsable(e.target.value.toUpperCase())} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:ring-cdmx-gold focus:border-cdmx-gold" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Responsable</label>
            <input type="text" required value={nombreResponsable} onChange={e => setNombreResponsable(e.target.value.toUpperCase())} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:ring-cdmx-gold focus:border-cdmx-gold" />
          </div>
        </div>

        {/* Logic Branching */}
        <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-200">
           <SelectField 
            label="COMPONENTE" 
            value={componente} 
            onChange={setComponente} 
            options={['BIENESTAR PARA EL BOSQUE', 'FACILITADORES DE SERVICIOS', 'VIGILANCIA AMBIENTAL']} 
          />

          {/* Bienestar Fields */}
          {componente === 'BIENESTAR PARA EL BOSQUE' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
               <SelectField label="Categoría" value={categoria} onChange={setCategoria} options={CATEGORIAS_BIENESTAR} />
               <SelectField label="Tipo de Vestimenta" value={tipoVestimenta} onChange={setTipoVestimenta} options={VESTIMENTA_TYPES} />
               <SelectField label="Línea de Ayuda" value={lineaAyuda} onChange={setLineaAyuda} options={LINEAS_AYUDA} />
               <SelectField label="CIIC" value={ciic} onChange={setCiic} options={CIIC_OPTIONS} />
               <div>
                  <label className="block text-sm font-medium text-gray-700">Brigada (Nombre)</label>
                  <input type="text" required value={brigada} onChange={e => setBrigada(e.target.value.toUpperCase())} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm" />
               </div>
            </div>
          )}

          {/* Facilitadores Fields */}
          {componente === 'FACILITADORES DE SERVICIOS' && (
             <div className="animate-fadeIn">
               <SelectField label="Rol" value={rolFacilitador} onChange={setRolFacilitador} options={ROLES_FACILITADORES} />
             </div>
          )}
          
           {/* Vigilancia Ambiental has only Component title, no extra sub-roles in description other than the title itself implies the role */}
        </div>

        {/* Sizes Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-cdmx-gold mb-3">Tallas y Prendas ({componente})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            
            {/* Logic for BIENESTAR */}
            {componente === 'BIENESTAR PARA EL BOSQUE' && (
              <>
                <SelectField label="Playera Manga Larga" value={tallaPlayeraMangaLarga} onChange={setTallaPlayeraMangaLarga} options={TALLAS_LETRAS} />
                <SelectField label="Chamarra" value={tallaChamarra} onChange={setTallaChamarra} options={TALLAS_LETRAS} />
                <SelectField label="Pantalón Carga" value={tallaPantalonCarga} onChange={setTallaPantalonCarga} options={TALLAS_PANTALON} />
                <SelectField label="Camisola" value={tallaCamisola} onChange={setTallaCamisola} options={TALLAS_PANTALON} />
                <SelectField label="Botas" value={tallaBotas} onChange={setTallaBotas} options={TALLAS_BOTAS} />
                <SelectField label="Impermeable" value={tallaImpermeable} onChange={setTallaImpermeable} options={TALLAS_IMPERMEABLE} />
              </>
            )}

            {/* Logic for FACILITADORES */}
            {componente === 'FACILITADORES DE SERVICIOS' && (
              <>
                <SelectField label="Playera Polo" value={tallaPlayeraPolo} onChange={setTallaPlayeraPolo} options={TALLAS_LETRAS} />
                <SelectField label="Chamarra" value={tallaChamarra} onChange={setTallaChamarra} options={TALLAS_LETRAS} />
                <SelectField label="Camisa/Blusa" value={tallaCamisaBlusa} onChange={setTallaCamisaBlusa} options={TALLAS_LETRAS} />
                <SelectField label="Chaleco" value={tallaChaleco} onChange={setTallaChaleco} options={TALLAS_LETRAS} />
                <SelectField label="Impermeable" value={tallaImpermeable} onChange={setTallaImpermeable} options={TALLAS_IMPERMEABLE} />
              </>
            )}

            {/* Logic for VIGILANCIA */}
            {componente === 'VIGILANCIA AMBIENTAL' && (
              <>
                 <SelectField label="Playera Polo" value={tallaPlayeraPolo} onChange={setTallaPlayeraPolo} options={TALLAS_LETRAS} />
                 <SelectField label="Chamarra" value={tallaChamarra} onChange={setTallaChamarra} options={TALLAS_LETRAS} />
                 <SelectField label="Impermeable" value={tallaImpermeable} onChange={setTallaImpermeable} options={TALLAS_IMPERMEABLE} />
                 <SelectField label="Botas" value={tallaBotas} onChange={setTallaBotas} options={TALLAS_BOTAS} />
                 <SelectField label="Pantalón Carga" value={tallaPantalonCarga} onChange={setTallaPantalonCarga} options={TALLAS_PANTALON} />
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-cdmx-guinda text-white rounded-md hover:bg-[#851b35] flex items-center gap-2"
          >
            <Save size={20} />
            {initialData ? 'Guardar Cambios' : 'Registrar'}
          </button>
        </div>
      </form>
    </div>
  );
};
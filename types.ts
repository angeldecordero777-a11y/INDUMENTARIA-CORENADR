export type ComponenteType = 'BIENESTAR PARA EL BOSQUE' | 'FACILITADORES DE SERVICIOS' | 'VIGILANCIA AMBIENTAL';

export interface User {
  username: string;
  fullName: string;
  role: 'ADMIN' | 'USER'; // Though prompt implies all are admins
}

export interface AuditLog {
  date: string;
  user: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT';
  details: string;
}

export interface UniformRecord {
  id: string;
  // General Info
  nombreCompleto: string;
  curp: string;
  areaResponsable: string;
  nombreResponsable: string;
  
  // Selection Logic
  componente: ComponenteType;
  
  // Specific to Bienestar
  categoria?: string; // Sembrador en jefe, etc.
  tipoVestimenta?: 'INCENDIOS' | 'GUINDA' | 'TÉCNICO';
  lineaAyuda?: 'V' | 'VI';
  ciic?: string;
  brigada?: string;

  // Specific to Facilitadores
  rolFacilitador?: string; // Facilitador del cambio, U.T.O.

  // Sizes (Union of all possible fields)
  tallaPlayeraMangaLarga?: string;
  tallaChamarra?: string;
  tallaPantalonCarga?: string;
  tallaCamisola?: string;
  tallaBotas?: string;
  tallaImpermeable?: string;
  tallaPlayeraPolo?: string;
  tallaCamisaBlusa?: string;
  tallaChaleco?: string;

  // Metadata
  createdBy: string;
  lastModifiedBy: string;
  createdAt: string;
  updatedAt: string;
}
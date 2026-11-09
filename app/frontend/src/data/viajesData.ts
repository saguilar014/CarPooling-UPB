export interface Viaje {
  id: string;
  conductor: {
    nombre: string;
    avatar: string;
    calificacion: number;
    resenas: number;
    vehiculo: string;
    carrera: string;
    semestre: string;
    telefono: string;
    verificado: boolean;
  };
  origen: string;
  destino: string;
  horaSalida: string;
  fecha: string;
  puntoEncuentro: string;
  cuposDisponibles: number;
}

export const TODOS_LOS_VIAJES: Viaje[] = [
  {
    id: '1',
    conductor: {
      nombre: 'Andrés Morales',
      avatar: 'AM',
      calificacion: 4.6,
      resenas: 9,
      vehiculo: 'Chevrolet Spark • Azul • ABC 123',
      carrera: 'Ing. Sistemas',
      semestre: '6° semestre',
      telefono: '+57 300 123 4567',
      verificado: true,
    },
    origen: 'Bello',
    destino: 'UPB Medellín',
    horaSalida: '6:30 AM',
    fecha: 'Hoy',
    puntoEncuentro: 'Estación del Metro de Bello',
    cuposDisponibles: 2,
  },
  {
    id: '2',
    conductor: {
      nombre: 'Mateo Restrepo',
      avatar: 'MR',
      calificacion: 4.8,
      resenas: 14,
      vehiculo: 'Mazda 2 • Gris • XYZ 789',
      carrera: 'Administración',
      semestre: '8° semestre',
      telefono: '+57 311 987 6543',
      verificado: true,
    },
    origen: 'Bello',
    destino: 'UPB Medellín',
    horaSalida: '7:00 AM',
    fecha: 'Hoy',
    puntoEncuentro: 'Centro Comercial Puerta del Norte',
    cuposDisponibles: 3,
  },
  {
    id: '3',
    conductor: {
      nombre: 'Valentina Ríos',
      avatar: 'VR',
      calificacion: 5.0,
      resenas: 31,
      vehiculo: 'Toyota Yaris • Rojo • MNO 456',
      carrera: 'Diseño Industrial',
      semestre: '5° semestre',
      telefono: '+57 320 555 0192',
      verificado: true,
    },
    origen: 'El Poblado',
    destino: 'UPB Medellín',
    horaSalida: '6:45 AM',
    fecha: 'Hoy',
    puntoEncuentro: "Parque El Poblado, frente a McDonald's",
    cuposDisponibles: 3,
  },
  {
    id: '4',
    conductor: {
      nombre: 'Camila Ospina',
      avatar: 'CO',
      calificacion: 4.9,
      resenas: 22,
      vehiculo: 'Kia Picanto • Blanco • QWE 321',
      carrera: 'Medicina',
      semestre: '7° semestre',
      telefono: '+57 315 444 8899',
      verificado: true,
    },
    origen: 'UPB Medellín',
    destino: 'El Poblado',
    horaSalida: '12:15 PM',
    fecha: 'Hoy',
    puntoEncuentro: 'Portería Circular 1 (UPB)',
    cuposDisponibles: 1,
  },
  {
    id: '5',
    conductor: {
      nombre: 'Santiago Gómez',
      avatar: 'SG',
      calificacion: 4.7,
      resenas: 18,
      vehiculo: 'Renault Logan • Negro • RTY 654',
      carrera: 'Derecho',
      semestre: '4° semestre',
      telefono: '+57 301 777 2211',
      verificado: true,
    },
    origen: 'UPB Medellín',
    destino: 'El Poblado',
    horaSalida: '4:30 PM',
    fecha: 'Hoy',
    puntoEncuentro: 'Portería Nutibara (UPB)',
    cuposDisponibles: 4,
  },
  {
    id: '6',
    conductor: {
      nombre: 'Daniela Calle',
      avatar: 'DC',
      calificacion: 4.9,
      resenas: 40,
      vehiculo: 'Nissan March • Rojo • UIO 987',
      carrera: 'Psicología',
      semestre: '8° semestre',
      telefono: '+57 318 333 6655',
      verificado: true,
    },
    origen: 'Sabaneta',
    destino: 'UPB Medellín',
    horaSalida: '6:15 AM',
    fecha: 'Hoy',
    puntoEncuentro: 'Parque de Sabaneta',
    cuposDisponibles: 2,
  },
];
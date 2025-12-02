/**
 * Data: Profesionales del Staff CEFIB
 * Versión: 1.0
 * Autor: Franz (@franzmr1)
 * Fecha: 2025-11-27
 */

export interface Profesional {
  id: number;
  nombre: string;
  especialidad: string;
  descripcionCorta: string;
  descripcionCompleta: string;
  imagen: string;
  linkedin?: string;
  email?: string;
  certificaciones?: string[];
  experiencia?: string;
}

export const PROFESIONALES: Profesional[] = [
  {
    id: 1,
    nombre: 'Yuleisi Macalupu',
    especialidad: 'Especialista Gestión de Seguridad',
    descripcionCorta: 'Ingeniera ambiental, experiencia en la implementación y auditoría de sistemas de gestión bajo normas ISO (9001, 14001, 45001, entre otras).',
    descripcionCompleta: `Ingeniera Ambiental con amplia experiencia en la implementación y auditoría de sistemas de gestión bajo normas ISO 9001, 14001, 45001, entre otras. Especialista en diseño e implementación de programas de seguridad y salud ocupacional. 

Actualmente cursa una Maestría en Gerencia Empresarial en la Universidad Nacional de Piura, fortaleciendo sus competencias en liderazgo estratégico y gestión de procesos organizacionales. 

Con más de 8 años de trayectoria profesional, ha liderado proyectos de certificación para empresas de diversos sectores, garantizando el cumplimiento normativo y la mejora continua de los procesos.`,
    imagen: '/images/profesionales/yuleisi-macalupu.jpg',
    experiencia: '8+ años',
    certificaciones: [
      'Auditor ISO 9001:2015',
      'Auditor ISO 14001:2015',
      'Auditor ISO 45001:2018',
      'Maestría en Gerencia Empresarial (en curso)'
    ],
  },
  {
    id: 2,
    nombre: 'Dennis Paredes',
    especialidad: 'Especialista Gestión Pública',
    descripcionCorta: 'Ingeniero de sistemas colegiado con más de 15 años de experiencia en sectores público y privado.',
    descripcionCompleta: `Ingeniero de Sistemas Colegiado con más de 15 años de experiencia en sectores público y privado. Posee una Maestría y un Doctorado en Gestión Pública y Gobernabilidad, siendo un referente en transformación digital gubernamental.

Especialista en diseño e implementación de sistemas de gestión documentaria, modernización del Estado y gobierno electrónico. Ha liderado proyectos de gran envergadura en entidades públicas a nivel nacional.

Su experiencia abarca consultoría en planificación estratégica, gestión por resultados y optimización de procesos administrativos bajo el enfoque de calidad total y mejora continua.`,
    imagen: '/images/profesionales/dennis-paredes.jpg',
    experiencia: '15+ años',
    certificaciones: [
      'Doctorado en Gestión Pública y Gobernabilidad',
      'Maestría en Gestión Pública',
      'Ingeniero de Sistemas Colegiado',
      'Especialista en Gobierno Electrónico'
    ],
  },
  {
    id: 3,
    nombre: 'Liliana Perez',
    especialidad: 'Especialista Gestión Pedagógica',
    descripcionCorta: 'Especialista Pedagógico Regional, capacitador docente en Temas de Gestión Escolar y Liderazgo Pedagógico.',
    descripcionCompleta: `Especialista Pedagógico Regional con amplia trayectoria como capacitador docente en Gestión Escolar y Liderazgo Pedagógico. Evaluadora Formativa certificada en el CNEB (Currículo Nacional de la Educación Básica) en la Universidad Nacional de Tumbes.

Con más de 12 años de experiencia en el sector educativo, ha liderado procesos de formación continua para directivos y docentes, promoviendo prácticas pedagógicas innovadoras y centradas en el aprendizaje. 

Especialista en diseño curricular, evaluación por competencias y desarrollo de programas de acompañamiento pedagógico.  Comprometida con la calidad educativa y la mejora de los aprendizajes. `,
    imagen: '/images/profesionales/liliana-perez.jpg',
    experiencia: '12+ años',
    certificaciones: [
      'Evaluadora Formativa CNEB - UNT',
      'Especialista en Liderazgo Pedagógico',
      'Capacitador en Gestión Escolar',
      'Diplomado en Diseño Curricular'
    ],
  },
  {
    id: 4,
    nombre: 'Daniel Alva',
    especialidad: 'Especialista en Investigación',
    descripcionCorta: 'Ingeniero de Sistemas, docente y analista de datos con experiencia en análisis de datos para el banco de la nación, MEF, Servir y Migraciones.',
    descripcionCompleta: `Ingeniero de Sistemas, Docente Universitario y Analista de Datos con amplia experiencia en análisis de datos para instituciones de gran envergadura como el Banco de la Nación, MEF (Ministerio de Economía y Finanzas), SERVIR y Migraciones.

Especialista en Business Intelligence, Big Data y metodologías de investigación científica. Ha desarrollado sistemas de análisis predictivo y dashboards estratégicos para la toma de decisiones en el sector público.

Con más de 10 años de experiencia docente, combina su expertise técnico con habilidades pedagógicas para formar profesionales en ciencia de datos, investigación aplicada y transformación digital.`,
    imagen: '/images/profesionales/daniel-alva.jpg',
    experiencia: '10+ años',
    certificaciones: [
      'Ingeniero de Sistemas',
      'Especialista en Business Intelligence',
      'Certificación en Big Data Analytics',
      'Docente Universitario'
    ],
  },
  {
    id: 5,
    nombre: 'Edith Pérez',
    especialidad: 'Especialista Gestión Pública',
    descripcionCorta: 'Profesional altamente capacitada y experimentada en los campos de la gestión pública, la educación y la salud comunitaria.',
    descripcionCompleta: `Profesional altamente capacitada y experimentada en los campos de la gestión pública, la educación y la salud comunitaria. Con una sólida formación académica y práctica, se destaca por su compromiso con el desarrollo sostenible y la mejora de la calidad de vida en las comunidades.

Especialista en diseño e implementación de políticas públicas con enfoque en salud comunitaria y educación. Ha liderado proyectos de intervención social en zonas rurales y urbano-marginales, promoviendo el empoderamiento ciudadano y la participación activa. 

Su experiencia abarca la gestión de programas sociales, planificación estratégica sectorial y articulación intersectorial para el logro de objetivos de desarrollo sostenible.`,
    imagen: '/images/profesionales/edith-perez.jpg',
    experiencia: '10+ años',
    certificaciones: [
      'Especialista en Gestión Pública',
      'Diplomado en Salud Comunitaria',
      'Certificación en Políticas Públicas',
      'Gestión de Programas Sociales'
    ],
  },
  {
    id: 6,
    nombre: 'Juan Uceda',
    especialidad: 'Especialista Metodología de la Investigación',
    descripcionCorta: 'Con 15 años de experiencia en Educación Básica Regular y Universitaria, especialista en Didáctica de la Matemática, Didáctica de las Ciencias Sociales y Metodología de la Investigación.',
    descripcionCompleta: `Con 15 años de experiencia en Educación Básica Regular y Universitaria, es especialista en Didáctica de la Matemática, Didáctica de las Ciencias Sociales y Metodología de la Investigación. 

Docente formador con amplia trayectoria en capacitación a profesionales de la educación en metodologías activas, investigación educativa y diseño de proyectos de innovación pedagógica.

Ha desarrollado e implementado programas de formación continua para docentes y estudiantes universitarios, promoviendo el pensamiento crítico, la investigación científica y el desarrollo de competencias investigativas aplicadas a la realidad educativa peruana.`,
    imagen: '/images/profesionales/juan-uceda.jpg',
    experiencia: '15+ años',
    certificaciones: [
      'Especialista en Metodología de la Investigación',
      'Didáctica de la Matemática',
      'Didáctica de Ciencias Sociales',
      'Docente Universitario'
    ],
  },
];
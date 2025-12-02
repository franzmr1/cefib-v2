export const SITE_CONFIG = {
  name: 'CEFIB',
  fullName: 'Centro de Formación y Especialización Profesional Iberoamericano',
  tagline: 'TRAIN WIN LEADERS',
  description: 'Centro de formación profesional de excelencia',
  url: 'https://cefib.pe',
  
  contact: {
    phones: ['973594951', '962294240'],
    email: 'informes@cefib.pe',
    whatsapp: '51973594951',
    schedule: '08:00 am - 20:00 pm',
  },
  
  social: {
    facebook: 'https://facebook.com/cefib.sac',
    instagram: 'https://instagram.com/cefibsac',
    
  },
} as const;

export const WHATSAPP_MESSAGE = encodeURIComponent(
  '¡Hola! Me interesa conocer más sobre los cursos de CEFIB.'
);

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN: '/admin',
  ADMIN_CURSOS: '/admin/cursos',
} as const;
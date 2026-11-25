import type {
  AudioSample,
  CharacterId,
  InterestAreaId,
  Locale,
  SiteContentConfig,
} from '../types';

export const OFFICIAL_ASSETS = {
  quintetLineup: '/assets/aistudio/Quinteto_de_personajes_con_detalles_ajustados_737dfba4.png',
  heroScene: '/src/assets/images/hero_quintet_courtyard_1795647504622.jpg',
  pillarAudio: '/src/assets/images/pillar_audio_sanctuary_1795647506699.jpg',
  pillarPractice: '/src/assets/images/pillar_practical_steps_1795647508065.jpg',
  pillarSupport: '/src/assets/images/pillar_human_accompaniment_1795647508479.jpg',
} as const;

export interface CharacterMeta {
  id: CharacterId;
  name: string;
  color: string;
  softBgLight: string;
  softBgDark: string;
  roleEs: string;
  roleEn: string;
  // Exact framing coordinates on the 16:9 official lineup (width: 520% of square frame)
  cropLeftPct: number;
  cropTopPct: number;
}

export const CHARACTERS: Record<CharacterId, CharacterMeta> = {
  nico: {
    id: 'nico',
    name: 'Nico',
    color: '#7C3AED',
    softBgLight: 'rgba(124, 58, 237, 0.08)',
    softBgDark: 'rgba(124, 58, 237, 0.18)',
    roleEs: 'Autoestima y mirada interior',
    roleEn: 'Self-esteem and inner clarity',
    cropLeftPct: -14,
    cropTopPct: -4,
  },
  bruno: {
    id: 'bruno',
    name: 'Bruno',
    color: '#17A96D',
    softBgLight: 'rgba(23, 169, 109, 0.08)',
    softBgDark: 'rgba(23, 169, 109, 0.18)',
    roleEs: 'Vínculos y límites sanos',
    roleEn: 'Relationships and healthy boundaries',
    cropLeftPct: -110,
    cropTopPct: -12,
  },
  tito: {
    id: 'tito',
    name: 'Tito',
    color: '#F5B700',
    softBgLight: 'rgba(245, 183, 0, 0.10)',
    softBgDark: 'rgba(245, 183, 0, 0.16)',
    roleEs: 'Acción y foco cotidiano',
    roleEn: 'Action and daily focus',
    cropLeftPct: -207,
    cropTopPct: -40,
  },
  mateo: {
    id: 'mateo',
    name: 'Mateo',
    color: '#2270E2',
    softBgLight: 'rgba(34, 112, 226, 0.08)',
    softBgDark: 'rgba(34, 112, 226, 0.18)',
    roleEs: 'Hábitos y dirección personal',
    roleEn: 'Habits and personal direction',
    cropLeftPct: -306,
    cropTopPct: -16,
  },
  aurelio: {
    id: 'aurelio',
    name: 'Aurelio',
    color: '#F44356',
    softBgLight: 'rgba(244, 67, 86, 0.08)',
    softBgDark: 'rgba(244, 67, 86, 0.18)',
    roleEs: 'Regulación emocional y calma',
    roleEn: 'Emotional regulation and calm',
    cropLeftPct: -402,
    cropTopPct: -38,
  },
};

export interface InterestTopicItem {
  id: InterestAreaId;
  character: CharacterId | 'quintet';
  accentColor: string;
  label: Record<Locale, string>;
  description: Record<Locale, string>;
}

export const INTEREST_TOPICS: InterestTopicItem[] = [
  {
    id: 'procrastination',
    character: 'tito',
    accentColor: '#F5B700',
    label: {
      es: 'Dejar de procrastinar',
      en: 'Stop procrastinating',
    },
    description: {
      es: 'Entender qué frena tus tareas importantes y dar pasos pequeños sin bloquearte.',
      en: 'Understand what holds back important tasks and take small steps without freezing.',
    },
  },
  {
    id: 'self_esteem',
    character: 'nico',
    accentColor: '#7C3AED',
    label: {
      es: 'Mejorar mi autoestima',
      en: 'Improve my self-esteem',
    },
    description: {
      es: 'Cuestionar la autocrítica constante y construir una relación más justa contigo.',
      en: 'Question constant self-criticism and build a fairer relationship with yourself.',
    },
  },
  {
    id: 'emotions',
    character: 'aurelio',
    accentColor: '#F44356',
    label: {
      es: 'Gestionar mis emociones',
      en: 'Manage my emotions',
    },
    description: {
      es: 'Identificar lo que sientes con mayor claridad antes de reaccionar en automático.',
      en: 'Identify what you feel with greater clarity before reacting on autopilot.',
    },
  },
  {
    id: 'relationships',
    character: 'bruno',
    accentColor: '#17A96D',
    label: {
      es: 'Mejorar mis relaciones',
      en: 'Improve my relationships',
    },
    description: {
      es: 'Comunicar lo que necesitas y sostener límites claros con serenidad.',
      en: 'Communicate what you need and maintain clear boundaries with calm.',
    },
  },
  {
    id: 'habits',
    character: 'mateo',
    accentColor: '#2270E2',
    label: {
      es: 'Construir mejores hábitos',
      en: 'Build better habits',
    },
    description: {
      es: 'Pasar de la intención suelta a rutinas realistas que encajen en tu semana.',
      en: 'Move from vague intentions to realistic routines that fit your week.',
    },
  },
  {
    id: 'direction',
    character: 'mateo',
    accentColor: '#2270E2',
    label: {
      es: 'Encontrar mi rumbo',
      en: 'Find my direction',
    },
    description: {
      es: 'Ordenar tus prioridades cuando sientes estancamiento o incertidumbre sobre tu siguiente etapa.',
      en: 'Sort out priorities when feeling stuck or uncertain about your next chapter.',
    },
  },
  {
    id: 'unsure',
    character: 'quintet',
    accentColor: '#1A2035',
    label: {
      es: 'No sé cómo explicarlo todavía',
      en: 'I do not know how to explain it yet',
    },
    description: {
      es: 'Un punto de partida abierto si solo sabes que algo necesita cambiar, sin tener aún las palabras exactas.',
      en: 'An open starting point when you simply know something needs to shift, even without exact words.',
    },
  },
];

export const DEFAULT_AUDIO_SAMPLES: AudioSample[] = [
  {
    id: 'sample-calma-mateo',
    title: 'Comprender sin exigirte de más',
    description:
      'Una pausa sonora de muestra diseñada para bajar el ritmo y observar qué necesitas hoy antes de actuar.',
    character: 'mateo',
    durationLabel: '0:24',
    audioUrl: '/audio/primer-paso-calma.wav',
    active: true,
  },
  {
    id: 'sample-procrastinacion-tito',
    title: 'Cuando pospones lo que te importa',
    description:
      'Espacio breve de enfoque sereno para transformar la saturación inicial en una acción mínima posible.',
    character: 'tito',
    durationLabel: '0:24',
    audioUrl: '/audio/pausa-procrastinacion.wav',
    active: true,
  },
  {
    id: 'sample-emociones-aurelio',
    title: 'Bajar el ruido mental al final del día',
    description:
      'Cadencia respiratoria suave para acompañar momentos de sobrecarga emocional y recuperar perspectiva.',
    character: 'aurelio',
    durationLabel: '0:24',
    audioUrl: '/audio/respiracion-claridad.wav',
    active: true,
  },
];

export const DEFAULT_SITE_CONTENT: SiteContentConfig = {
  heroTitle: 'Quieres cambiar algo en tu vida, pero no sabes por dónde empezar.',
  heroSubtitle:
    'Descubre un camino adaptado a ti para comprender lo que te sucede y comenzar a construir el cambio que necesitas.',
  launchNote: 'Próximo lanzamiento · Lista de acceso anticipado abierta',
  philosophyQuote:
    'Comprender es importante. Pero el cambio comienza cuando das el primer paso.',
  audioSamples: DEFAULT_AUDIO_SAMPLES,
};

export interface PillarItem {
  id: string;
  number: string;
  image: string;
  characters: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
}

export const PILLARS: PillarItem[] = [
  {
    id: 'audios',
    number: '01',
    image: OFFICIAL_ASSETS.pillarAudio,
    characters: 'Nico · Mateo',
    title: {
      es: 'Audios y programas personalizados',
      en: 'Personalized audios and programs',
    },
    description: {
      es: 'Contenido guiado de reflexión, relajación y desarrollo personal, adaptado a las necesidades y objetivos de cada persona.',
      en: 'Guided reflection, relaxation, and personal development audio tailored to your current needs and goals.',
    },
  },
  {
    id: 'activities',
    number: '02',
    image: OFFICIAL_ASSETS.pillarPractice,
    characters: 'Tito · Bruno',
    title: {
      es: 'Actividades prácticas',
      en: 'Practical activities',
    },
    description: {
      es: 'Ejercicios, pequeños retos, objetivos y herramientas de seguimiento que permiten convertir el conocimiento en acciones concretas.',
      en: 'Exercises, small challenges, clear goals, and tracking tools that turn insight into concrete daily actions.',
    },
  },
  {
    id: 'professional',
    number: '03',
    image: OFFICIAL_ASSETS.pillarSupport,
    characters: 'Aurelio',
    title: {
      es: 'Acompañamiento profesional',
      en: 'Professional accompaniment',
    },
    description: {
      es: 'Posibilidad de recibir orientación y realizar sesiones individuales con profesionales de la psicología.',
      en: 'Option to receive guidance and schedule individual sessions with licensed psychology professionals.',
    },
  },
];

export interface StepItem {
  number: string;
  character: CharacterId;
  title: Record<Locale, string>;
  caption: Record<Locale, string>;
}

export const HOW_IT_WORKS_STEPS: StepItem[] = [
  {
    number: '01',
    character: 'tito',
    title: {
      es: 'Identifica qué quieres trabajar.',
      en: 'Identify what you want to work on.',
    },
    caption: {
      es: 'Elige un área concreta o comienza desde una exploración abierta.',
      en: 'Pick a concrete area or start from an open exploration.',
    },
  },
  {
    number: '02',
    character: 'nico',
    title: {
      es: 'Descubre un camino adaptado a tus necesidades.',
      en: 'Discover a path adapted to your needs.',
    },
    caption: {
      es: 'Recibe una secuencia clara y manejable según tu momento actual.',
      en: 'Receive a clear, manageable sequence suited to where you are.',
    },
  },
  {
    number: '03',
    character: 'mateo',
    title: {
      es: 'Escucha, comprende y realiza pequeñas acciones.',
      en: 'Listen, understand, and take small actions.',
    },
    caption: {
      es: 'Combina audios breves con ejercicios aplicables en tu día real.',
      en: 'Combine concise audios with practical exercises for real life.',
    },
  },
  {
    number: '04',
    character: 'bruno',
    title: {
      es: 'Observa tu evolución a tu propio ritmo.',
      en: 'Observe your evolution at your own pace.',
    },
    caption: {
      es: 'Revisa tus pasos con perspectiva, sin prisas ni exigencias rígidas.',
      en: 'Review your steps with perspective, without pressure or rigid timelines.',
    },
  },
];

export interface FaqItem {
  id: string;
  question: Record<Locale, string>;
  answer: Record<Locale, string>;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'what-is',
    question: {
      es: '¿Qué es Te cuento tu primer paso?',
      en: 'What is Te cuento tu primer paso?',
    },
    answer: {
      es: 'Es una plataforma de desarrollo personal perteneciente a la marca Te cuento el porqué. Está pensada para ayudarte a comprender tus comportamientos cotidianos, destrabar bloqueos frecuentes y transformar hábitos mediante audios guiados, actividades prácticas y acompañamiento profesional opcional.',
      en: 'It is a personal development platform by Te cuento el porqué designed to help you understand everyday behaviors, work through common blocks, and build habits through guided audios, practical activities, and optional professional guidance.',
    },
  },
  {
    id: 'how-programs',
    question: {
      es: '¿Cómo funcionan los programas personalizados?',
      en: 'How do personalized programs work?',
    },
    answer: {
      es: 'A partir de lo que eliges trabajar y de unas preguntas iniciales breves, la plataforma organiza una ruta paso a paso con audios comprensibles y propuestas prácticas adaptadas a tu punto de partida, que podrás ajustar en cualquier momento.',
      en: 'Based on what you choose to work on and a few short initial questions, the platform organizes a step-by-step route with clear audios and practical exercises adapted to your starting point, adjustable at any time.',
    },
  },
  {
    id: 'experience',
    question: {
      es: '¿Necesito experiencia previa?',
      en: 'Do I need prior experience?',
    },
    answer: {
      es: 'No necesitas conocimientos previos de psicología ni haber probado otras herramientas de desarrollo personal. Todo está explicado en un lenguaje claro, cotidiano y directo.',
      en: 'You do not need prior knowledge of psychology or other personal growth tools. Everything is presented in clear, everyday language.',
    },
  },
  {
    id: 'own-pace',
    question: {
      es: '¿Puedo avanzar a mi propio ritmo?',
      en: 'Can I move at my own pace?',
    },
    answer: {
      es: 'Sí. La plataforma está diseñada para acompañarte sin presión ni penalizaciones. Puedes escuchar un audio cuando tengas un momento tranquilo, pausar o retomar tus actividades cuando te resulte viable.',
      en: 'Yes. The platform is built to accompany you without pressure. You can listen when you have a quiet moment and pause or resume activities whenever it fits your week.',
    },
  },
  {
    id: 'professional-support',
    question: {
      es: '¿Puedo recibir acompañamiento profesional?',
      en: 'Can I receive professional accompaniment?',
    },
    answer: {
      es: 'La futura plataforma contemplará la opción de solicitar orientación y sesiones individuales con profesionales de la psicología para quienes deseen un acompañamiento más profundo y personalizado.',
      en: 'The upcoming platform will include the option to request guidance and individual sessions with psychology professionals for those seeking deeper personal support.',
    },
  },
  {
    id: 'therapy-disclaimer',
    question: {
      es: '¿Esto sustituye una terapia psicológica?',
      en: 'Does this replace psychological therapy?',
    },
    answer: {
      es: 'No. Los audios, actividades y contenidos de desarrollo personal de Te cuento tu primer paso tienen un enfoque educativo y de acompañamiento cotidiano, pero no constituyen un diagnóstico ni sustituyen la atención psicológica, psiquiátrica o médica profesional cuando esta sea necesaria.',
      en: 'No. The audios, activities, and personal development resources on Te cuento tu primer paso are educational and supportive, and do not constitute a diagnosis or replace professional psychological or medical care when needed.',
    },
  },
  {
    id: 'availability',
    question: {
      es: '¿Cuándo estará disponible la plataforma?',
      en: 'When will the platform be available?',
    },
    answer: {
      es: 'Actualmente estamos construyendo la primera versión de la plataforma. Si dejas tu registro de interés en el formulario de esta página, te avisaremos con prioridad en cuanto abramos el acceso.',
      en: 'We are currently building the first version of the platform. Leave your interest registration in the form below and we will notify you first as soon as early access opens.',
    },
  },
];

export const UI_COPY = {
  es: {
    brandName: 'Te cuento tu primer paso',
    parentBrand: 'Te cuento el porqué',
    brandSlogan: 'Todo tiene un porqué. Yo te lo cuento.',
    philosophyTagline: 'Ya sabes qué necesitas cambiar. Ahora te enseñamos cómo empezar.',
    nav: {
      home: 'Inicio',
      howItWorks: 'Cómo funciona',
      whatToWorkOn: 'Qué puedes trabajar',
      faq: 'Preguntas frecuentes',
      cta: 'Da tu primer paso',
    },
    hero: {
      primaryCta: 'Da tu primer paso',
      secondaryLink: 'Escuchar una muestra',
      charactersCaption: 'Nico · Bruno · Tito · Mateo · Aurelio',
    },
    identification: {
      kicker: 'Punto de partida',
      title: '¿Qué te gustaría cambiar en tu vida?',
      subtitle:
        'Elige el área que mejor refleje tu momento actual. Guardaremos tu elección para que des tu primer paso con mayor claridad.',
      cardAction: 'Elegir este punto de partida',
      selectedBadge: 'Seleccionado',
    },
    proposal: {
      kicker: 'Nuestra propuesta',
      title: 'Tres pilares claros para pasar de entender a actuar',
      subtitle:
        'Sin ruido ni fórmulas mágicas: herramientas comprensibles que se adaptan a tu ritmo real.',
    },
    howItWorks: {
      kicker: 'Cómo funciona',
      title: 'Un recorrido sencillo en cuatro pasos',
      subtitle: 'Diseñado para reducir la sobrecarga inicial y ayudarte a sostener avances reales.',
    },
    preview: {
      kicker: 'Vista previa de la futura plataforma',
      title: 'Así será tu espacio cotidiano',
      subtitle:
        'Pantallas demostrativas del concepto en desarrollo. No representan datos reales de usuarios ni resultados garantizados.',
      demoNote: 'Vista demostrativa · Plataforma en desarrollo',
      tabs: {
        myDay: 'Mi día',
        myPrograms: 'Mis programas',
        myProgress: 'Mi progreso',
      },
    },
    audioSection: {
      kicker: 'Experiencia de audio',
      title: 'Escucha una muestra de nuestra propuesta sonora',
      subtitle:
        'Un adelanto real de nuestro ambiente de escucha calmada. Puedes reproducir, avanzar en la pista y ajustar el volumen.',
      play: 'Reproducir',
      pause: 'Pausar',
      volume: 'Volumen',
      mute: 'Silenciar',
      unmute: 'Activar sonido',
      trackListLabel: 'Muestras disponibles',
      disclaimer:
        'Muestras sonoras ilustrativas de ambiente y calma. Los programas hablados completos estarán disponibles en el lanzamiento.',
    },
    philosophy: {
      kicker: 'Nuestra filosofía',
      body: 'Leer consejos o acumular información rara vez basta por sí solo. El desarrollo personal genuino requiere comprender qué hay detrás de tus bloqueos, elegir una acción concreta a tu alcance y avanzar paso a paso, sin exigencias irreales ni promesas de transformación instantánea.',
      cta: 'Quiero empezar a mi ritmo',
    },
    faq: {
      kicker: 'Preguntas frecuentes',
      title: 'Respuestas claras antes de empezar',
      scopeNotice:
        'Alcance de los contenidos: Te cuento tu primer paso ofrece herramientas de reflexión y desarrollo personal. Sus contenidos no sustituyen la evaluación, el diagnóstico ni el tratamiento psicológico o médico profesional cuando sea necesario.',
    },
    leadForm: {
      kicker: 'Acceso anticipado',
      title: 'Da tu primer paso cuando abramos las puertas',
      subtitle:
        'Déjanos tus datos para recibir novedades sobre el lanzamiento y contarnos qué área te gustaría trabajar primero. No recopilamos información clínica sensible en este formulario.',
      selectedBanner: 'Has elegido trabajar en:',
      nameLabel: 'Nombre',
      namePlaceholder: 'Tu nombre',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'tu@correo.com',
      areaLabel: 'Área que deseas trabajar',
      areaPlaceholder: 'Selecciona una opción',
      consentText:
        'Acepto recibir información por correo electrónico sobre el lanzamiento y novedades de Te cuento tu primer paso.',
      submitButton: 'Quiero dar mi primer paso',
      submitting: 'Guardando tu registro...',
      successTitle: 'Hemos guardado tu primer paso.',
      successBody:
        'Gracias por tu interés. Te avisaremos por correo electrónico en cuanto la plataforma esté disponible.',
      sharePrompt: '¿Conoces a alguien a quien podría servirle este proyecto? Compártelo:',
      copyLink: 'Copiar enlace',
      copiedLink: 'Enlace copiado',
      shareNative: 'Compartir',
      registerAnother: 'Registrar otro correo',
    },
    footer: {
      contactTitle: 'Contacto',
      legalTitle: 'Información legal',
      socialTitle: 'Redes sociales',
      privacy: 'Política de privacidad',
      terms: 'Términos y condiciones',
      scope: 'Alcance de los contenidos',
      adminLink: 'Acceso administrativo',
      themeLabel: 'Tema',
      themeSystem: 'Sistema',
      themeLight: 'Claro',
      themeDark: 'Oscuro',
      languageLabel: 'Idioma',
      rights: 'Te cuento el porqué · Todos los derechos reservados.',
    },
  },
  en: {
    brandName: 'Te cuento tu primer paso',
    parentBrand: 'Te cuento el porqué',
    brandSlogan: 'Todo tiene un porqué. Yo te lo cuento.',
    philosophyTagline: 'You already know what you want to change. Now we help you start.',
    nav: {
      home: 'Home',
      howItWorks: 'How it works',
      whatToWorkOn: 'What you can work on',
      faq: 'FAQ',
      cta: 'Take your first step',
    },
    hero: {
      primaryCta: 'Take your first step',
      secondaryLink: 'Listen to a sample',
      charactersCaption: 'Nico · Bruno · Tito · Mateo · Aurelio',
    },
    identification: {
      kicker: 'Starting point',
      title: 'What would you like to change in your life?',
      subtitle:
        'Choose the area that best reflects your current moment. We will keep your selection ready in the registration form.',
      cardAction: 'Choose this starting point',
      selectedBadge: 'Selected',
    },
    proposal: {
      kicker: 'Our approach',
      title: 'Three clear pillars to move from insight to action',
      subtitle: 'Grounded tools without noise or exaggerated promises, adapted to your daily rhythm.',
    },
    howItWorks: {
      kicker: 'How it works',
      title: 'A clear four-step journey',
      subtitle: 'Designed to ease overwhelm and support sustainable everyday progress.',
    },
    preview: {
      kicker: 'Upcoming platform preview',
      title: 'A glimpse of your future space',
      subtitle:
        'Demonstrative preview screens of the platform in development. They do not represent real user records or guaranteed outcomes.',
      demoNote: 'Demonstrative preview · Platform in development',
      tabs: {
        myDay: 'My day',
        myPrograms: 'My programs',
        myProgress: 'My progress',
      },
    },
    audioSection: {
      kicker: 'Audio experience',
      title: 'Listen to a sample of our calm audio space',
      subtitle: 'A real sound preview you can play, seek, and adjust at your own pace.',
      play: 'Play',
      pause: 'Pause',
      volume: 'Volume',
      mute: 'Mute',
      unmute: 'Unmute',
      trackListLabel: 'Available samples',
      disclaimer:
        'Illustrative calm soundscapes. Full guided voice programs will be available at launch.',
    },
    philosophy: {
      kicker: 'Our philosophy',
      body: 'Consuming advice alone rarely creates change. Genuine personal growth means understanding what sits behind your blocks, choosing one concrete action within reach, and advancing step by step without unrealistic promises.',
      cta: 'Start at my own pace',
    },
    faq: {
      kicker: 'Frequently asked questions',
      title: 'Clear answers before you begin',
      scopeNotice:
        'Content scope: Te cuento tu primer paso provides personal development and reflection tools. Its content does not substitute professional psychological or medical care when needed.',
    },
    leadForm: {
      kicker: 'Early access',
      title: 'Take your first step when we open the doors',
      subtitle:
        'Leave your contact details to hear about the launch and tell us which area matters most to you. Please do not share sensitive clinical information here.',
      selectedBanner: 'Selected focus area:',
      nameLabel: 'Name',
      namePlaceholder: 'Your name',
      emailLabel: 'Email address',
      emailPlaceholder: 'you@example.com',
      areaLabel: 'Area you want to work on',
      areaPlaceholder: 'Select an option',
      consentText:
        'I agree to receive email updates regarding the launch of Te cuento tu primer paso.',
      submitButton: 'I want to take my first step',
      submitting: 'Saving your registration...',
      successTitle: 'Your first step is registered.',
      successBody:
        'Thank you for your interest. We will reach out by email as soon as early access opens.',
      sharePrompt: 'Know someone who might appreciate this project? Share it:',
      copyLink: 'Copy link',
      copiedLink: 'Link copied',
      shareNative: 'Share',
      registerAnother: 'Register another email',
    },
    footer: {
      contactTitle: 'Contact',
      legalTitle: 'Legal & scope',
      socialTitle: 'Social',
      privacy: 'Privacy policy',
      terms: 'Terms and conditions',
      scope: 'Content scope',
      adminLink: 'Admin panel',
      themeLabel: 'Theme',
      themeSystem: 'System',
      themeLight: 'Light',
      themeDark: 'Dark',
      languageLabel: 'Language',
      rights: 'Te cuento el porqué · All rights reserved.',
    },
  },
} as const;

export function getInterestLabel(id: InterestAreaId, locale: Locale = 'es'): string {
  const found = INTEREST_TOPICS.find((t) => t.id === id);
  return found ? found.label[locale] : id;
}

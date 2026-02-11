export enum Gender {
  MALE = "Masculino",
  FEMALE = "Femenino",
}

export enum SkillLevel {
  BEGINNER = "principiante",
  INTERMEDIATE = "intermedio",
  ADVANCED = "avanzado",
}

export const SkillLevelDict = {
  [SkillLevel.BEGINNER]: "Principiante (Sin experiencia o primeras clases)",
  [SkillLevel.INTERMEDIATE]: "Intermedio (Ya navegas pero querés mejorar)",
  [SkillLevel.ADVANCED]:
    "Avanzado (Hacés maniobras y buscás perfeccionamiento)",
};

export enum DetailedSkillLevel {
  THEORY_AND_SAFETY = "teoria-y-seguridad",
  BODY_DRAGS = "body-drags",
  WATER_START = "water-start",
  SHORT_RIDES = "navego-metros",
  NAVIGATION_WITH_DRIFT = "navego-con-deriva",
  UPWIND_LEARNING_TRANSITIONS = "upwind-aprendiendo-transiciones",
  TRANSITIONS = "hago-transiciones",
  SMALL_JUMPS = "pequenos-saltos",
  CONTROLLED_JUMPS_AND_MANEUVERS = "saltos-controlados-maniobras",
}

export enum MainObjective {
  LEARN_TO_NAVIGATE = "aprender-a-navegar",
  BEING_INDEPENDENT = "ser-independiente",
  IMPROVE_RIDING = "mejorar-mi-riding",
  MAKE_TRANSITIONS = "hacer-transiciones",
  LEARN_JUMP = "aprender-a-saltar",
  LEARN_NEW_MANEUVERS = "aprender-nuevas-maniobras",
  KITELOOPS = "kiteloops",
}

export const DetailedSkillLevelDict = {
  [DetailedSkillLevel.THEORY_AND_SAFETY]:
    "1) Teoría y seguridad y primeros vuelos",
  [DetailedSkillLevel.BODY_DRAGS]:
    "2) Body Drags (desplazarme sobre el agua solo con el kite)",
  [DetailedSkillLevel.WATER_START]:
    "3) Water Start: Intentando pararme sobre la tabla",
  [DetailedSkillLevel.SHORT_RIDES]:
    "4) Me levanto y navego algunos metros hacia uno o ambos lados",
  [DetailedSkillLevel.NAVIGATION_WITH_DRIFT]:
    "5) Navego con facilidad hacia ambos lados pero a veces derivo",
  [DetailedSkillLevel.UPWIND_LEARNING_TRANSITIONS]:
    "6) Upwind con facilidad y estoy aprendiendo transiciones",
  [DetailedSkillLevel.TRANSITIONS]: "7) Hago transiciones",
  [DetailedSkillLevel.SMALL_JUMPS]: "8) Hago pequeños saltos",
  [DetailedSkillLevel.CONTROLLED_JUMPS_AND_MANEUVERS]:
    "9) Hago saltos controlados y maniobras en el aire",
};

export enum ReferralSource {
  INSTAGRAM = "instagram",
  GOOGLE = "google",
  RECOMMENDATION = "recomendacion",
  CUESTA_DEL_VIENTO = "cuesta-del-viento",
  OTHER = "otro",
}

export const ReferralSourceDict = {
  [ReferralSource.INSTAGRAM]: "Instagram",
  [ReferralSource.GOOGLE]: "Google",
  [ReferralSource.RECOMMENDATION]: "Por Amigos / Conocidos",
  [ReferralSource.CUESTA_DEL_VIENTO]: "Los conocí en Cuesta del Viento",
  [ReferralSource.OTHER]: "Otro",
};

export enum CourseType {
  INDIVIDUAL = "curso-individual",
  DOUBLE = "curso-doble",
  INTENSIVE = "curso-intensivo",
  INDIVIDUAL_CLASS = "clase-individual",
  ADVANCED = "clase-avanzada",
  TEST = "clase-prueba",

  GUEST = "invitado",
  EQUIPMENT_RENTAL = "alquiler-equipo",
}

export const CourseTypeDict = {
  [CourseType.INDIVIDUAL]: "Curso Individual 9hs",
  [CourseType.DOUBLE]: "Curso Doble 9hs",
  [CourseType.INTENSIVE]: "Curso Intensivo",
  [CourseType.INDIVIDUAL_CLASS]: "Clases Individuales",
  [CourseType.ADVANCED]: "Clases Avanzadas / Big Air",
  [CourseType.TEST]: "Clases de Prueba",

  [CourseType.GUEST]: "Invitado",
  [CourseType.EQUIPMENT_RENTAL]: "Alquiler equipo",
};

export interface Booking {
  id?: string;
  createdAt: Date;

  // ============================================================================
  // SECTION 1: CUSTOMER PERSONAL DATA
  // ============================================================================
  customerName: string;
  birthDate: Date;
  gender?: Gender | null;
  customerEmail: string;
  province: string;
  customerPhone?: string;

  // ============================================================================
  // SECTION 2: RESERVATION DETAILS
  // ============================================================================
  courseType?: CourseType | null;
  hoursReserved?: number;
  arrivalDate: Date;
  arrivalTime: string;
  departureDate: Date;
  departureTime?: string;

  // ============================================================================
  // SECTION 3: SPORTS PROFILE
  // ============================================================================
  weightKg?: number;
  heightCm?: number;
  currentLevel?: SkillLevel | null;

  // ============================================================================
  // SECTION 4: DETAILED SKILL ASSESSMENT
  // ============================================================================
  detailedSkillLevel?: DetailedSkillLevel | null;

  // ============================================================================
  // SECTION 5: GOALS & PREFERENCES
  // ============================================================================
  mainObjective?: string | null;
  additionalNotes?: string;

  // ============================================================================
  // SECTION 6: MARKETING & COMMUNICATION
  // ============================================================================
  referralSource?: ReferralSource | null;
  referralSourceOther?: string;
  newsletterOptIn: boolean;
}

export type CreateBookingData = Omit<Booking, "id" | "createdAt">;

export function createBookingEntity(data: CreateBookingData): Booking {
  return {
    ...data,
    createdAt: new Date(),
  };
}

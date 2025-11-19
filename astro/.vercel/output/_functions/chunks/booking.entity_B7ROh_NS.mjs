var Gender = /* @__PURE__ */ ((Gender2) => {
  Gender2["MALE"] = "Masculino";
  Gender2["FEMALE"] = "Femenino";
  return Gender2;
})(Gender || {});
var SkillLevel = /* @__PURE__ */ ((SkillLevel2) => {
  SkillLevel2["BEGINNER"] = "principiante";
  SkillLevel2["INTERMEDIATE"] = "intermedio";
  SkillLevel2["ADVANCED"] = "avanzado";
  return SkillLevel2;
})(SkillLevel || {});
const SkillLevelDict = {
  ["principiante" /* BEGINNER */]: "Principiante (Sin experiencia o primeras clases)",
  ["intermedio" /* INTERMEDIATE */]: "Intermedio (Ya navegas pero querés mejorar)",
  ["avanzado" /* ADVANCED */]: "Avanzado (Hacés maniobras y buscás perfeccionamiento)"
};
var DetailedSkillLevel = /* @__PURE__ */ ((DetailedSkillLevel2) => {
  DetailedSkillLevel2["THEORY_AND_SAFETY"] = "teoria-y-seguridad";
  DetailedSkillLevel2["BODY_DRAGS"] = "body-drags";
  DetailedSkillLevel2["WATER_START"] = "water-start";
  DetailedSkillLevel2["SHORT_RIDES"] = "navego-metros";
  DetailedSkillLevel2["NAVIGATION_WITH_DRIFT"] = "navego-con-deriva";
  DetailedSkillLevel2["UPWIND_LEARNING_TRANSITIONS"] = "upwind-aprendiendo-transiciones";
  DetailedSkillLevel2["TRANSITIONS"] = "hago-transiciones";
  DetailedSkillLevel2["SMALL_JUMPS"] = "pequenos-saltos";
  DetailedSkillLevel2["CONTROLLED_JUMPS_AND_MANEUVERS"] = "saltos-controlados-maniobras";
  return DetailedSkillLevel2;
})(DetailedSkillLevel || {});
const DetailedSkillLevelDict = {
  ["teoria-y-seguridad" /* THEORY_AND_SAFETY */]: "1) Teoría y seguridad y primeros vuelos",
  ["body-drags" /* BODY_DRAGS */]: "2) Body Drags (desplazarme sobre el agua solo con el kite)",
  ["water-start" /* WATER_START */]: "3) Water Start: Intentando pararme sobre la tabla",
  ["navego-metros" /* SHORT_RIDES */]: "4) Me levanto y navego algunos metros hacia uno o ambos lados",
  ["navego-con-deriva" /* NAVIGATION_WITH_DRIFT */]: "5) Navego con facilidad hacia ambos lados pero a veces derivo",
  ["upwind-aprendiendo-transiciones" /* UPWIND_LEARNING_TRANSITIONS */]: "6) Upwind con facilidad y estoy aprendiendo transiciones",
  ["hago-transiciones" /* TRANSITIONS */]: "7) Hago transiciones",
  ["pequenos-saltos" /* SMALL_JUMPS */]: "8) Hago pequeños saltos",
  ["saltos-controlados-maniobras" /* CONTROLLED_JUMPS_AND_MANEUVERS */]: "9) Hago saltos controlados y maniobras en el aire"
};
var ReferralSource = /* @__PURE__ */ ((ReferralSource2) => {
  ReferralSource2["INSTAGRAM"] = "instagram";
  ReferralSource2["GOOGLE"] = "google";
  ReferralSource2["RECOMMENDATION"] = "recomendacion";
  ReferralSource2["CUESTA_DEL_VIENTO"] = "cuesta-del-viento";
  ReferralSource2["OTHER"] = "otro";
  return ReferralSource2;
})(ReferralSource || {});
const ReferralSourceDict = {
  ["instagram" /* INSTAGRAM */]: "Instagram",
  ["google" /* GOOGLE */]: "Google",
  ["recomendacion" /* RECOMMENDATION */]: "Por Amigos / Conocidos",
  ["cuesta-del-viento" /* CUESTA_DEL_VIENTO */]: "Los conocí en Cuesta del Viento",
  ["otro" /* OTHER */]: "Otro"
};
var CourseType = /* @__PURE__ */ ((CourseType2) => {
  CourseType2["INDIVIDUAL"] = "curso-individual";
  CourseType2["DOUBLE"] = "curso-doble";
  CourseType2["INTENSIVE"] = "curso-intensivo";
  CourseType2["INDIVIDUAL_CLASS"] = "clase-individual";
  CourseType2["ADVANCED"] = "clase-avanzada";
  CourseType2["TEST"] = "clase-prueba";
  CourseType2["GUEST"] = "invitado";
  CourseType2["EQUIPMENT_RENTAL"] = "alquiler-equipo";
  return CourseType2;
})(CourseType || {});
const CourseTypeDict = {
  ["curso-individual" /* INDIVIDUAL */]: "Curso Individual 9hs",
  ["curso-doble" /* DOUBLE */]: "Curso Doble 9hs",
  ["curso-intensivo" /* INTENSIVE */]: "Curso Intensivo",
  ["clase-individual" /* INDIVIDUAL_CLASS */]: "Clases Individuales",
  ["clase-avanzada" /* ADVANCED */]: "Clases Avanzadas / Big Air",
  ["clase-prueba" /* TEST */]: "Clases de Prueba",
  ["invitado" /* GUEST */]: "Invitado",
  ["alquiler-equipo" /* EQUIPMENT_RENTAL */]: "Alquiler equipo"
};
function createBookingEntity(data) {
  return {
    ...data,
    createdAt: /* @__PURE__ */ new Date()
  };
}

export { CourseType as C, DetailedSkillLevel as D, Gender as G, ReferralSource as R, SkillLevel as S, CourseTypeDict as a, SkillLevelDict as b, createBookingEntity as c, DetailedSkillLevelDict as d, ReferralSourceDict as e };

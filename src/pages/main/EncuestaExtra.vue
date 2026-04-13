<template>
  <div class="encuesta">
    <v-card
      subtitle="Por favor, responde la siguiente encuesta"
      title="Información complementaria"
    >
      <template v-slot:prepend>
        <v-icon color="primary" icon="mdi-help-circle"></v-icon>
      </template>
    </v-card>

    <!-- Alerta con información automática -->
    <v-alert v-if="userInfo.sexo" type="info" variant="tonal" class="mb-4">
      <div class="text-subtitle-2 font-weight-bold mb-2">
        📋 Información automática del sistema
      </div>
      <div class="text-body-2">
        <strong>Sexo:</strong>
        {{ userInfo.sexo === "M" ? "Masculino" : "Femenino" }}<br />
        <strong>Edad:</strong> {{ userInfo.edad }} años<br />
        <strong>Estado Civil:</strong> {{ userInfo.estado_civil }}
      </div>
      <div class="text-caption mt-2 text-grey-darken-1">
        <em>Estos datos se guardarán automáticamente con tu encuesta</em>
      </div>
    </v-alert>

    <v-form v-model="form_valid" v-if="!completado" class="preguntas">

      <!-- ══════════════════════════════════════════════ -->
      <!-- CATEGORÍA: ACADÉMICA                          -->
      <!-- ══════════════════════════════════════════════ -->
      <v-card variant="tonal" color="blue" class="categoria-header">
        <template v-slot:prepend>
          <v-icon icon="mdi-school"></v-icon>
        </template>
        <v-card-title class="text-subtitle-1 font-weight-bold">
          Información académica
        </v-card-title>
        <v-card-subtitle>Datos sobre tu situación escolar actual</v-card-subtitle>
      </v-card>

      <!-- CARRERA -->
      <v-card title="Carrera" subtitle="Selecciona la carrera que estás estudiando." variant="plain">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-school-outline"></v-icon>
        </template>
        <v-card-text>
          <v-select v-model="carrera" label="Carrera" :items="carreras"
            item-value="value" item-title="label" :rules="basicRules"></v-select>
        </v-card-text>
      </v-card>

      <!-- MODALIDAD DE ESTUDIO -->
      <v-card title="Modalidad de estudio"
        subtitle="Selecciona la modalidad en la que cursas tu carrera." variant="plain">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-laptop"></v-icon>
        </template>
        <v-card-text>
          <v-radio-group v-model="modalidad" inline :rules="basicRules">
            <v-radio label="Presencial" value="presencial"></v-radio>
            <v-radio label="En línea" value="en_linea"></v-radio>
          </v-radio-group>
        </v-card-text>
      </v-card>

      <!-- PROMEDIO -->
      <v-card title="Promedio del semestre anterior (0-100)"
        subtitle="Ingresa el promedio del semestre anterior." variant="plain">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-star-outline"></v-icon>
        </template>
        <v-card-text>
          <v-text-field label="Promedio (0-100)" rounded="lg" v-model="promedio"
            :rules="promedioRules" @keypress="soloNumerosDecimal"></v-text-field>
        </v-card-text>
      </v-card>

      <!-- SEMESTRE -->
      <v-card title="Semestre actual"
        subtitle="Ingresa el semestre que estás cursando actualmente." variant="plain">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-numeric"></v-icon>
        </template>
        <v-card-text>
          <v-select label="Semestre" v-model="semestre"
            :items="semestreOpciones" :rules="basicRules"></v-select>
        </v-card-text>
      </v-card>

      <!-- MATERIAS -->
      <v-card title="Cantidad de materias"
        subtitle="Ingresa la cantidad de materias que cursas en este semestre." variant="plain">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-book-multiple"></v-icon>
        </template>
        <v-card-text>
          <v-select label="Materias" v-model="materias"
            :items="materiasOpciones" :rules="basicRules"></v-select>
        </v-card-text>
      </v-card>

      <!-- MAESTROS ESTRICTOS -->
      <v-card variant="plain">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-human-male-board"></v-icon>
        </template>
        <v-card-title>
          <div class="d-flex align-center gap-2">
            ¿Cuántos maestros estrictos tienes este semestre?
            <!-- Botón de información -->
            <v-tooltip location="bottom" max-width="320">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  icon="mdi-information-outline"
                  color="grey"
                  size="small"
                  style="cursor: pointer;"
                ></v-icon>
              </template>
              <div>
                <div class="text-subtitle-2 font-weight-bold mb-1">
                  ¿Qué es un maestro estricto?
                </div>
                <div class="text-body-2">
                  Como tipo de profesor estricto se identifican aquellos que presentan las siguientes características:
                </div>
                <ul class="text-body-2 mt-1" style="padding-left: 1rem;">
                  <li>No es claro en la forma de evaluación</li>
                  <li>Exige un ritmo de trabajo acelerado</li>
                  <li>Poca flexibilidad ante imprevistos del alumno</li>
                </ul>
              </div>
            </v-tooltip>
          </div>
        </v-card-title>
        <v-card-subtitle>Indica cuántos de tus profesores actuales consideras estrictos</v-card-subtitle>
        <v-card-text>
          <v-select
            v-model="maestros_estrictos"
            label="Número de maestros estrictos"
            :items="maestrosOpciones"
            :rules="basicRules">
          </v-select>
        </v-card-text>
      </v-card>

      <!-- ══════════════════════════════════════════════ -->
      <!-- CATEGORÍA: SOCIOECONÓMICA                     -->
      <!-- ══════════════════════════════════════════════ -->
      <v-card variant="tonal" color="green" class="categoria-header mt-2">
        <template v-slot:prepend>
          <v-icon icon="mdi-currency-usd"></v-icon>
        </template>
        <v-card-title class="text-subtitle-1 font-weight-bold">
          Información socioeconómica
        </v-card-title>
        <v-card-subtitle>Datos sobre tu situación laboral y económica</v-card-subtitle>
      </v-card>

      <!-- TRABAJO -->
      <v-card title="Trabajo" subtitle="Selecciona si trabajas mientras estudias." variant="plain">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-briefcase-outline"></v-icon>
        </template>
        <v-card-text>
          <v-radio-group v-model="trabajo" inline>
            <v-radio label="No trabajo" value="0"></v-radio>
            <v-radio label="Trabajo y estudio" value="1"></v-radio>
          </v-radio-group>
        </v-card-text>
      </v-card>

      <!-- BECA -->
      <v-card title="Beca" subtitle="Selecciona si tienes alguna beca." variant="plain">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-account-school"></v-icon>
        </template>
        <v-card-text>
          <v-radio-group v-model="beca" inline>
            <v-radio label="No tengo beca" value="0"></v-radio>
            <v-radio label="Estoy becado" value="1"></v-radio>
          </v-radio-group>
        </v-card-text>
      </v-card>

      <!-- INGRESO MENSUAL -->
      <v-card
        title="Ingreso mensual"
        subtitle="¿Cuál es tu ingreso mensual aproximado (incluyendo apoyo familiar, beca o trabajo)?"
        variant="plain">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-cash-multiple"></v-icon>
        </template>
        <v-card-text>
          <v-select v-model="ingreso_mensual" label="Ingreso mensual"
            :items="ingresosOpciones" item-value="value" item-title="label"
            :rules="basicRules"></v-select>
        </v-card-text>
      </v-card>

      <!-- TRANSPORTE -->
      <v-card title="Transporte"
        subtitle="Selecciona la forma en que te transportas al instituto." variant="plain">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-train-car"></v-icon>
        </template>
        <v-card-text>
          <v-select v-model="transporte" label="Transporte" :items="transportes"
            item-value="value" item-title="label" :rules="basicRules"></v-select>
        </v-card-text>
      </v-card>

      <!-- ══════════════════════════════════════════════ -->
      <!-- CATEGORÍA: DEMOGRÁFICA                        -->
      <!-- ══════════════════════════════════════════════ -->
      <v-card variant="tonal" color="orange" class="categoria-header mt-2">
        <template v-slot:prepend>
          <v-icon icon="mdi-account-group"></v-icon>
        </template>
        <v-card-title class="text-subtitle-1 font-weight-bold">
          Información demográfica
        </v-card-title>
        <v-card-subtitle>Datos sobre tu situación personal y de vida</v-card-subtitle>
      </v-card>

      <!-- HOGAR -->
      <v-card title="Hogar" subtitle="Selecciona con quiénes vives." variant="plain">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-home"></v-icon>
        </template>
        <v-card-text>
          <v-select v-model="familiares" label="Personas" :items="familiaresOpciones"
            item-value="value" item-title="label" :rules="basicRules"></v-select>
        </v-card-text>
      </v-card>

      <!-- TIENE HIJOS -->
      <v-card title="Hijos" subtitle="¿Tienes hijos actualmente?" variant="plain">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-baby-carriage"></v-icon>
        </template>
        <v-card-text>
          <v-radio-group v-model="tiene_hijos" inline>
            <v-radio label="No tengo hijos" value="0"></v-radio>
            <v-radio label="Sí tengo hijos" value="1"></v-radio>
          </v-radio-group>
        </v-card-text>
      </v-card>

      <!-- HORAS DE SUEÑO -->
      <v-card
        title="Horas de sueño"
        subtitle="¿Cuántas horas duermes aproximadamente por noche entre semana?"
        variant="plain">
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-sleep"></v-icon>
        </template>
        <v-card-text>
          <v-select v-model="horas_sueno" label="Horas de sueño"
            :items="horasSuenoOpciones" item-value="value" item-title="label"
            :rules="basicRules"></v-select>
        </v-card-text>
      </v-card>

    </v-form>

    <!-- COMPLETADO -->
    <div v-else>
      <v-card title="¡Gracias!" subtitle="Se han registrado las respuestas de tu encuesta."
        variant="tonal" color="blue">
        <v-card-text>Esta información es complementaria y confidencial.</v-card-text>
      </v-card>
    </div>

    <v-divider class="my-2"></v-divider>

    <div class="bottom" v-if="!completado">
      <v-btn prepend-icon="mdi-close" variant="plain" @click="salir">Cancelar</v-btn>
      <v-btn block prepend-icon="mdi-check" variant="flat" color="blue"
        @click="enviarEncuesta" :loading="loadingBtn">
        Guardar respuestas
      </v-btn>
    </div>

    <div class="bottom" v-if="completado">
      <v-btn block prepend-icon="mdi-check" variant="flat" color="blue" @click="salir">
        Regresar a Inicio
      </v-btn>
    </div>

    <v-dialog v-model="dialog" max-width="320" persistent>
      <v-list class="py-2" color="primary" elevation="12" rounded="lg">
        <v-list-item prepend-icon="mdi-clock-time-four-outline" title="Guardando resultados...">
          <template v-slot:prepend>
            <div class="pe-4">
              <v-icon color="primary" size="x-large"></v-icon>
            </div>
          </template>
          <template v-slot:append>
            <v-progress-circular color="primary" indeterminate="disable-shrink"
              size="16" width="2"></v-progress-circular>
          </template>
        </v-list-item>
      </v-list>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="timeout" variant="tonal">
      {{ text }}
      <template v-slot:actions>
        <v-btn color="blue" variant="text" @click="snackbar = false" icon="mdi-close"></v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref, shallowRef } from "vue";
import { useRouter } from "vue-router";
import { useUsuarioStore } from "@/stores/usuario";

const router       = useRouter();
const usuarioStore = useUsuarioStore();

const snackbar   = ref(false);
const text       = ref();
const timeout    = ref(2500);
const dialog     = shallowRef(false);
const loading    = ref(true);
const loadingBtn = ref(false);
const completado = ref(false);
const form_valid = ref(false);

const semestreOpciones = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const materiasOpciones = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const maestrosOpciones = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const userInfo = ref({ sexo: "", edad: 0, estado_civil: "" });

// ── Reglas de validación ─────────────────────────────────────────

const basicRules = ref([
  (value) => (value !== null && value !== undefined) || "Campo requerido.",
]);

const promedioRules = ref([
  (value) => (value !== null && value !== undefined && value !== "") || "Promedio requerido.",
  (value) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 100) return true;
    return "El promedio debe ser un número entre 0 y 100.";
  },
]);

const soloNumerosDecimal = (event) => {
  const char  = String.fromCharCode(event.keyCode || event.which);
  const valor = event.target.value;
  if (/[0-9]/.test(char)) return;
  if (char === "." && !valor.includes(".")) return;
  event.preventDefault();
};

// ── Variables reactivas ──────────────────────────────────────────

const carrera          = ref();
const modalidad        = ref("presencial");
const promedio         = ref();
const semestre         = ref();
const materias         = ref();
const transporte       = ref();
const familiares       = ref();
const trabajo          = ref("0");
const beca             = ref("0");
const maestros_estrictos = ref();
const tiene_hijos      = ref("0");
const ingreso_mensual  = ref();
const horas_sueno      = ref();

// ── Catálogos ────────────────────────────────────────────────────

const carreras = [
  { label: "Ingeniería en Sistemas Computacionales", value: "ISC"  },
  { label: "Ingeniería Informática",                 value: "IINF" },
  { label: "Ingeniería en Ciencia de Datos",         value: "ICD"  },
  { label: "Ingeniería en Gestión Empresarial",      value: "IGE"  },
  { label: "Ingeniería Química",                     value: "IQ"   },
  { label: "Ingeniería Eléctrica",                   value: "IELE" },
  { label: "Ingeniería Electrónica",                 value: "IELC" },
  { label: "Ingeniería en Semiconductores",          value: "ISEM" },
  { label: "Ingeniería Industrial",                  value: "IIND" },
  { label: "Ingeniería Mecánica",                    value: "IM"   },
];

const transportes = [
  { label: "Transporte público",   value: 0 },
  { label: "Vehículo particular",  value: 1 },
  { label: "Caminando",            value: 2 },
];

const familiaresOpciones = [
  { label: "Vivo solo",      value: 0 },
  { label: "Con familiares", value: 1 },
  { label: "Con amigos",     value: 2 },
  { label: "Con conocidos",  value: 3 },
];

const ingresosOpciones = [
  { label: "Sin ingreso",                    value: 0 },
  { label: "Menos de $3,000 al mes",         value: 1 },
  { label: "Entre $3,000 y $6,000 al mes",   value: 2 },
  { label: "Entre $6,000 y $10,000 al mes",  value: 3 },
  { label: "Más de $10,000 al mes",          value: 4 },
];

const horasSuenoOpciones = [
  { label: "Menos de 4 horas", value: 0 },
  { label: "De 4 a 6 horas",   value: 1 },
  { label: "De 6 a 8 horas",   value: 2 },
  { label: "Más de 8 horas",   value: 3 },
];

// ── Funciones ────────────────────────────────────────────────────

const calcularEdad = (fechaNacimiento) => {
  const hoy        = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
};

const getUserInfo = async () => {
  try {
    const response = await fetch(
      import.meta.env.VITE_ENDPOINT + "users.php?action=getAlumnoById",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: usuarioStore.getId() }),
      }
    );
    const data = await response.json();
    if (data.status === "ok" && data.data) {
      userInfo.value = {
        sexo:         data.data.sexo,
        edad:         calcularEdad(data.data.fechan),
        estado_civil: data.data.estadoc,
      };
    }
  } catch (error) {
    console.error("Error al obtener info del usuario:", error);
  }
};

const enviarEncuesta = async () => {
  if (!form_valid.value) {
    text.value     = "Verifica tus respuestas.";
    snackbar.value = true;
    return;
  }

  try {
    dialog.value = true;

    const register = await (
      await fetch(
        import.meta.env.VITE_ENDPOINT + "questions.php?action=registerEncuestaExtra",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_alumno:           usuarioStore.getId(),
            id_aplicacion:       usuarioStore.getIdAplicacion(),
            carrera:             carrera.value,
            modalidad:           modalidad.value,
            promedio_anterior:   promedio.value,
            semestre:            semestre.value,
            materias:            materias.value,
            transporte:          transporte.value,
            familiares:          familiares.value,
            trabajo:             trabajo.value,
            beca:                beca.value,
            maestros_estrictos:  maestros_estrictos.value,
            tiene_hijos:         tiene_hijos.value,
            ingreso_mensual:     ingreso_mensual.value,
            horas_sueno:         horas_sueno.value,
          }),
        }
      )
    ).json();

    if (register.status != "ok") {
      text.value       = register.message;
      snackbar.value   = true;
      loadingBtn.value = false;
      dialog.value     = false;
      return;
    }

    setTimeout(() => {
      dialog.value     = false;
      completado.value = true;
    }, 500);

  } catch (error) {
    text.value     = "Ha ocurrido un error.";
    snackbar.value = true;
    dialog.value   = false;
  }
};

const salir = async () => {
  router.push({ name: "panel-inicio" });
};

onMounted(() => {
  getUserInfo();
});

onBeforeMount(async () => {
  if (usuarioStore.getIdAplicacion() === null) {
    router.push({ name: "panel-inicio" });
  }
});
</script>

<style lang="scss" scoped>
.encuesta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .preguntas {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .categoria-header {
    margin-top: 0.5rem;
  }

  .bottom {
    display: flex;
    justify-content: right;
    align-items: flex-end;
    gap: 0.5rem;

    * {
      flex: 0 1 auto !important;
      width: fit-content;
      min-width: 0;
    }
  }
}
</style>
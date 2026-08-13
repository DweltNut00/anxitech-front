<template>
  <div class="usuarios">
    <div class="encabezado">
      <v-btn
        prepend-icon="mdi-download"
        variant="flat"
        color="green"
        :loading="loadingCSV"
        @click="exportarCSV"
      >
        Exportar dataset (CSV)
      </v-btn>
      <!-- <v-btn
        block
        prepend-icon="mdi-plus"
        variant="flat"
        color="blue"
        @click="dialog = !dialog"
      >
        Nuevo usuario
      </v-btn> -->
    </div>
    <!--  <div class="tablas">
      <v-card class="alumnos">
    <v-data-table-server
        :headers="headersAlumnos"
        :items="alumnos"
        :search="buscarAlumnos"
        :items-length="sizeAlumnos"
        :loading="loadingAlumnos"
        :items-per-page="itemsPerPage"
        @update:options="getAlumnos"
    >
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>
                    <v-icon icon="mdi-account-school"></v-icon>
                    Alumnos
                </v-toolbar-title>

                <v-text-field
                    v-model="buscarAlumnos"
                    density="compact"
                    label="Buscar por número de control"
                    prepend-inner-icon="mdi-magnify"
                    variant="solo-filled"
                    flat
                    hide-details
                    class="me-2"
                    single-line
                ></v-text-field>
            </v-toolbar>
        </template>

          <template v-slot:item.sexo="{ item }">
            <v-chip
              :color="item.sexo === 'M' ? 'blue' : 'pink'"
              :text="item.sexo"
              class="text-uppercase"
              size="small"
              label
            ></v-chip>
          </template>
          <template v-slot:item.estadoc="{ item }">
            <v-chip
              color="orange"
              :text="item.estadoc"
              class="text-uppercase"
              size="small"
              label
            ></v-chip>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="item.status ? 'green' : 'red'"
              :text="item.status ? 'Activo' : 'Inactivo'"
              class="text-uppercase"
              size="small"
              label
            ></v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <div class="d-flex ga-1">
              <v-btn
                color="medium-emphasis"
                icon
                size="small"
                flat
                @click="editAlumno(item.id)"
              >
                <v-icon icon="mdi-pencil"></v-icon>
              </v-btn>

              <v-btn color="medium-emphasis" size="small" icon flat>
                <v-icon icon="mdi-delete"></v-icon>

                <v-menu
                  activator="parent"
                  location="bottom end"
                  transition="fade-transition"
                >
                  <v-list density="compact" min-width="250" rounded="lg" slim>
                    <v-list-item
                      prepend-icon="mdi-progress-question"
                      title="Confirmar"
                      @click="removeAlumno(item.id)"
                    ></v-list-item>

                    <v-divider class="my-2"></v-divider>

                    <v-list-item min-height="24">
                      <template v-slot:subtitle>
                        <div class="text-caption">
                          Esta acción no es reversible.
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn>
            </div>
          </template>
        </v-data-table-server>
      </v-card>
      <v-card class="admins" v-if="usuarioStore.getPermisos() == 1">
        <v-data-table-server
          :headers="headersAdmins"
          :items="admins"
          :search="buscarAdmins"
          :items-length="sizeAdmins"
          :loading="loadingAdmins"
          @update:options="getAdmins"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>
                <v-icon icon="mdi-shield-crown"></v-icon>

                Administradores
              </v-toolbar-title>

              <v-text-field
                v-model="buscarAdmins"
                density="compact"
                label="Buscar por correo electrónico"
                prepend-inner-icon="mdi-magnify"
                variant="solo-filled"
                flat
                hide-details
                class="me-2"
                single-line
              ></v-text-field>
            </v-toolbar>
          </template>

          <template v-slot:item.permisos="{ item }">
            <v-chip
              color="purple"
              :text="item.permisos"
              size="small"
              label
            ></v-chip>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="item.status ? 'green' : 'red'"
              :text="item.status ? 'Activo' : 'Inactivo'"
              class="text-uppercase"
              size="small"
              label
            ></v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <div class="d-flex ga-1">
              <v-btn
                color="medium-emphasis"
                icon
                size="small"
                flat
                @click="editAdmin(item.id)"
              >
                <v-icon icon="mdi-pencil"></v-icon>
              </v-btn>

              <v-btn color="medium-emphasis" size="small" icon flat>
                <v-icon icon="mdi-delete"></v-icon>

                <v-menu
                  activator="parent"
                  location="bottom end"
                  transition="fade-transition"
                >
                  <v-list density="compact" min-width="250" rounded="lg" slim>
                    <v-list-item
                      prepend-icon="mdi-progress-question"
                      title="Confirmar"
                      @click="removeAdmin(item.id)"
                    ></v-list-item>

                    <v-divider class="my-2"></v-divider>

                    <v-list-item min-height="24">
                      <template v-slot:subtitle>
                        <div class="text-caption">
                          Esta acción no es reversible.
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn>
            </div>
          </template>
        </v-data-table-server>
      </v-card>
    </div> -->

    <!-- Tabla de factores por alumno -->
    <v-card class="factores-alumno">
      <v-data-table
        :headers="headersFactores"
        :items="alumnosFiltrados"
        :loading="loadingFactores"
        density="compact"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              <v-icon icon="mdi-account-details"></v-icon>
              Factores por Estudiante
            </v-toolbar-title>
            <v-select
              v-model="filtroInstitucion"
              :items="['ITO', 'UNPA']"
              label="Institución"
              variant="solo-filled"
              flat
              hide-details
              clearable
              density="compact"
              class="me-2"
              style="max-width: 150px"
            ></v-select>
            <v-select
              v-model="filtroNivel"
              :items="['Bajo', 'Medio', 'Alto']"
              label="Nivel"
              variant="solo-filled"
              flat
              hide-details
              clearable
              density="compact"
              class="me-2"
              style="max-width: 130px"
            ></v-select>
          </v-toolbar>
        </template>

        <template v-slot:item.nivel_ansiedad="{ item }">
          <v-chip
            :color="
              item.nivel_ansiedad === 'Alto'
                ? 'error'
                : item.nivel_ansiedad === 'Medio'
                  ? 'warning'
                  : 'success'
            "
            size="small"
          >
            {{ item.nivel_ansiedad }}
          </v-chip>
        </template>

        <template v-slot:item.trabajo="{ item }">
          <v-icon :color="item.trabajo == 1 ? 'success' : 'grey'" size="small">
            {{ item.trabajo == 1 ? "mdi-check-circle" : "mdi-close-circle" }}
          </v-icon>
        </template>

        <template v-slot:item.beca="{ item }">
          <v-icon :color="item.beca == 1 ? 'success' : 'grey'" size="small">
            {{ item.beca == 1 ? "mdi-check-circle" : "mdi-close-circle" }}
          </v-icon>
        </template>

        <template v-slot:item.tiene_hijos="{ item }">
          <v-icon
            :color="item.tiene_hijos == 1 ? 'success' : 'grey'"
            size="small"
          >
            {{
              item.tiene_hijos == 1 ? "mdi-check-circle" : "mdi-close-circle"
            }}
          </v-icon>
        </template>

        <template v-slot:item.detalle="{ item }">
          <v-btn
            size="small"
            color="teal"
            variant="tonal"
            icon="mdi-eye"
            @click="verDetalle(item.id)"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent width="auto">
      <CrearUsuario @cerrar="cerrar" />
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="timeout" variant="tonal">
      {{ text }}

      <template v-slot:actions>
        <v-btn
          color="blue"
          variant="text"
          @click="snackbar = false"
          icon="mdi-close"
        ></v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="dialogAlumno" persistent width="auto">
      <EditarAlumno @cerrar="cerrarAlumno" :id="idAlumno" />
    </v-dialog>

    <v-dialog v-model="dialogAdmin" persistent width="auto">
      <EditarAdmin @cerrar="cerrarAdmin" :id="idAdmin" />
    </v-dialog>
  </div>
  <v-dialog v-model="dialogDetalle" max-width="700" scrollable>
    <v-card v-if="alumnoDetalle && !loadingDetalle">
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between">
        <span>
          <v-icon color="teal" class="mr-2">mdi-account-details</v-icon>
          {{ alumnoDetalle.info.nombre }} {{ alumnoDetalle.info.apellido }}
        </span>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="dialogDetalle = false"
        ></v-btn>
      </v-card-title>

      <v-card-text>
        <!-- Info general -->
        <v-row class="mb-3">
          <v-col cols="6" md="3">
            <div class="text-caption text-grey">Institución</div>
            <div class="font-weight-bold">
              {{ alumnoDetalle.info.institucion }}
            </div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="text-caption text-grey">Carrera</div>
            <div class="font-weight-bold">{{ alumnoDetalle.info.carrera }}</div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="text-caption text-grey">Semestre</div>
            <div class="font-weight-bold">
              {{ alumnoDetalle.info.semestre }}
            </div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="text-caption text-grey">Promedio</div>
            <div class="font-weight-bold">
              {{ alumnoDetalle.info.promedio_anterior }}
            </div>
          </v-col>
        </v-row>

        <v-divider class="mb-4"></v-divider>

        <!-- Puntaje total -->
        <div class="d-flex align-center justify-center mb-4 gap-4">
          <div class="text-center">
            <div class="text-h3 font-weight-bold">
              {{ alumnoDetalle.puntaje_total }}
            </div>
            <div class="text-caption text-grey">Puntaje DASS-21</div>
          </div>
          <v-chip
            :color="
              alumnoDetalle.nivel_ansiedad === 'Alto'
                ? 'error'
                : alumnoDetalle.nivel_ansiedad === 'Medio'
                  ? 'warning'
                  : 'success'
            "
            size="x-large"
          >
            Ansiedad {{ alumnoDetalle.nivel_ansiedad }}
          </v-chip>
        </div>

        <!-- Respuestas DASS-21 -->
        <div class="text-subtitle-2 mb-3">
          <v-icon size="small" class="mr-1">mdi-format-list-checks</v-icon>
          Respuestas DASS-21
        </div>

        <div
          v-for="(resp, index) in alumnoDetalle.respuestas"
          :key="resp.id"
          class="mb-3"
        >
          <div class="d-flex justify-space-between align-center mb-1">
            <span class="text-caption" style="max-width: 75%">
              <strong>P{{ index + 1 }}.</strong> {{ resp.pregunta }}
            </span>
            <v-chip :color="colorRespuesta(resp.valor)" size="small">
              {{ etiquetaRespuesta(resp.valor) }}
            </v-chip>
          </div>
          <v-progress-linear
            :model-value="(resp.valor / 3) * 100"
            :color="colorRespuesta(resp.valor)"
            height="8"
            rounded
          ></v-progress-linear>
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- Factores contextuales -->
        <div class="text-subtitle-2 mb-3">
          <v-icon size="small" class="mr-1">mdi-clipboard-list</v-icon>
          Factores Contextuales
        </div>
        <v-row>
          <v-col cols="6" md="4">
            <v-chip
              :color="alumnoDetalle.info.trabajo == 1 ? 'orange' : 'grey'"
              size="small"
              class="mb-1"
            >
              <v-icon start>{{
                alumnoDetalle.info.trabajo == 1 ? "mdi-check" : "mdi-close"
              }}</v-icon>
              Trabaja
            </v-chip>
          </v-col>
          <v-col cols="6" md="4">
            <v-chip
              :color="alumnoDetalle.info.beca == 1 ? 'blue' : 'grey'"
              size="small"
              class="mb-1"
            >
              <v-icon start>{{
                alumnoDetalle.info.beca == 1 ? "mdi-check" : "mdi-close"
              }}</v-icon>
              Beca
            </v-chip>
          </v-col>
          <v-col cols="6" md="4">
            <v-chip
              :color="alumnoDetalle.info.tiene_hijos == 1 ? 'purple' : 'grey'"
              size="small"
              class="mb-1"
            >
              <v-icon start>{{
                alumnoDetalle.info.tiene_hijos == 1 ? "mdi-check" : "mdi-close"
              }}</v-icon>
              Tiene hijos
            </v-chip>
          </v-col>
          <v-col cols="6" md="4">
            <v-chip color="teal" size="small" class="mb-1">
              <v-icon start>mdi-sleep</v-icon>
              {{ etiquetaSueno(alumnoDetalle.info.horas_sueno) }}
            </v-chip>
          </v-col>
          <v-col cols="6" md="4">
            <v-chip color="indigo" size="small" class="mb-1">
              <v-icon start>mdi-school</v-icon>
              {{ alumnoDetalle.info.maestros_estrictos }} maestros estrictos
            </v-chip>
          </v-col>
          <v-col cols="6" md="4">
            <v-chip color="brown" size="small" class="mb-1">
              <v-icon start>mdi-currency-usd</v-icon>
              {{ etiquetaIngreso(alumnoDetalle.info.ingreso_mensual) }}
            </v-chip>
          </v-col>
          <v-col cols="6" md="4">
            <v-chip color="blue-grey" size="small" class="mb-1">
              <v-icon start>mdi-bus</v-icon>
              {{ etiquetaTransporte(alumnoDetalle.info.transporte) }}
            </v-chip>
          </v-col>
          <v-col cols="6" md="4">
            <v-chip color="deep-purple" size="small" class="mb-1">
              <v-icon start>mdi-home</v-icon>
              {{ etiquetaFamiliares(alumnoDetalle.info.familiares) }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading -->
    <v-card v-else>
      <v-card-text
        class="d-flex justify-center align-center"
        style="height: 200px"
      >
        <v-progress-circular indeterminate color="teal"></v-progress-circular>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useUsuarioStore } from "@/stores/usuario";
import CrearUsuario from "@/components/main/CrearUsuario.vue";
import EditarAlumno from "@/components/main/EditarAlumno.vue";
import EditarAdmin from "@/components/main/EditarAdmin.vue";

const API_URL =
  import.meta.env.VITE_MODEL_ENDPOINT || "https://anxitech-model.onrender.com";
const usuarioStore = useUsuarioStore();
const alumnosFactores = ref([]);
const loadingFactores = ref(true);
const filtroInstitucion = ref("");
const filtroNivel = ref("");

const headersFactores = ref([
  { title: "Nombre", key: "nombre", sortable: true },
  { title: "Apellido", key: "apellido", sortable: true },
  { title: "Institución", key: "institucion", sortable: true },
  { title: "Carrera", key: "carrera", sortable: true },
  { title: "Semestre", key: "semestre", sortable: true },
  { title: "Promedio", key: "promedio_anterior", sortable: true },
  { title: "Materias", key: "materias", sortable: true },
  { title: "Trabaja", key: "trabajo", sortable: true },
  { title: "Beca", key: "beca", sortable: true },
  { title: "Hijos", key: "tiene_hijos", sortable: true },
  { title: "Maestros", key: "maestros_estrictos", sortable: true },
  { title: "DASS-21", key: "puntaje_dass21", sortable: true },
  { title: "Nivel", key: "nivel_ansiedad", sortable: true },
  { title: "Detalle", key: "detalle", sortable: false },
]);

const alumnosFiltrados = computed(() => {
  return alumnosFactores.value.filter((a) => {
    const coincideInstitucion =
      !filtroInstitucion.value || a.institucion === filtroInstitucion.value;
    const coincideNivel =
      !filtroNivel.value || a.nivel_ansiedad === filtroNivel.value;
    return coincideInstitucion && coincideNivel;
  });
});

const cargarFactoresAlumno = async () => {
  try {
    loadingFactores.value = true;
    const response = await fetch(`${API_URL}/api/stats/por-alumno`);
    const data = await response.json();
    alumnosFactores.value = data.alumnos;
  } catch (err) {
    console.error("Error factores alumno:", err);
  } finally {
    loadingFactores.value = false;
  }
};

const dialogDetalle = ref(false);
const alumnoDetalle = ref(null);
const loadingDetalle = ref(false);

const verDetalle = async (id) => {
  loadingDetalle.value = true;
  dialogDetalle.value = true;
  try {
    const response = await fetch(
      `https://anxitech-model.onrender.com/api/stats/alumno/${id}`,
    );
    alumnoDetalle.value = await response.json();
  } catch (err) {
    console.error("Error detalle:", err);
  } finally {
    loadingDetalle.value = false;
  }
};

const etiquetaRespuesta = (valor) => {
  return ["Nunca", "A veces", "A menudo", "Casi siempre"][valor] || valor;
};

const colorRespuesta = (valor) => {
  return ["success", "info", "warning", "error"][valor] || "grey";
};

const etiquetaSueno = (valor) => {
  return ["Menos de 4h", "De 4 a 6h", "De 6 a 8h", "Más de 8h"][valor] ?? valor;
};

const etiquetaIngreso = (valor) => {
  return (
    [
      "Sin ingreso",
      "Menos de $3,000",
      "$3,000–$6,000",
      "$6,000–$10,000",
      "Más de $10,000",
    ][valor] ?? valor
  );
};

const etiquetaTransporte = (valor) => {
  return (
    ["Transporte público", "Vehículo particular", "Caminando"][valor] ?? valor
  );
};

const etiquetaFamiliares = (valor) => {
  return (
    ["Vivo solo", "Con familiares", "Con amigos", "Con conocidos"][valor] ??
    valor
  );
};

// 🔥 Estados de diálogos
const dialog = ref(false);
const dialogAlumno = ref(false);
const dialogAdmin = ref(false);

// Estados de alumnos
const alumnos = ref([]);
const loadingAlumnos = ref(false);
const buscarAlumnos = ref("");
const sizeAlumnos = ref(0); // 🔥 Total de registros para la tabla
const itemsPerPage = ref(10); // 🔥 Items por página

// Estados de admins
const admins = ref([]);
const loadingAdmins = ref(false);
const buscarAdmins = ref("");
const sizeAdmins = ref(0); // 🔥 Total de admins

// Estado exportación CSV
const loadingCSV = ref(false);

// Otros estados
const snackbar = ref(false);
const text = ref("");
const timeout = ref(2500);
const idAlumno = ref(null);
const idAdmin = ref(null); // 🔥 Faltaba esta variable

// Headers de tablas
const headersAlumnos = ref([
  { title: "Id", key: "id", align: "start" },
  { title: "Nombre(s)", key: "nombre" },
  { title: "Apellido(s)", key: "apellido" },
  { title: "E-mail", key: "email" },
  { title: "No. Control", key: "nocontrol" },
  { title: "Fecha de nacimiento", key: "fechan" },
  { title: "Sexo", key: "sexo" },
  { title: "Estado civil", key: "estadoc" },
  { title: "Ciudad", key: "ciudad" },
  { title: "Estado", key: "estado" },
  { title: "Fecha de creación", key: "creacion" },
  { title: "Status", key: "status" },
  { title: "Acciones", key: "actions", sortable: false },
]);

const headersAdmins = ref([
  { title: "Id", key: "id", align: "start" },
  { title: "Nombre(s)", key: "nombre" },
  { title: "Apellido(s)", key: "apellido" },
  { title: "E-mail", key: "email" },
  { title: "Permisos", key: "permisos" },
  { title: "Fecha de creación", key: "creacion" },
  { title: "Status", key: "status" },
  { title: "Acciones", key: "actions", sortable: false },
]);

// 🔥 FUNCIÓN CORREGIDA: getAlumnos con paginación
const getAlumnos = async (options = {}) => {
  loadingAlumnos.value = true;

  try {
    // v-data-table-server pasa { page, itemsPerPage, sortBy, etc }
    const page = options.page || 1;
    const perPage = options.itemsPerPage || itemsPerPage.value;

    const url = `${import.meta.env.VITE_ENDPOINT}users.php?action=getAlumnos&page=${page}&perPage=${perPage}&search=${buscarAlumnos.value}`;

    const response = await fetch(url);
    const alumnosJson = await response.json();

    if (alumnosJson.status === "ok") {
      alumnos.value = alumnosJson.data;
      sizeAlumnos.value = alumnosJson.total; // 🔥 Total para paginación
    } else {
      text.value = "Error al cargar alumnos.";
      snackbar.value = true;
    }
  } catch (error) {
    text.value = "Error al cargar alumnos.";
    snackbar.value = true;
    console.error(error);
  } finally {
    loadingAlumnos.value = false;
  }
};

// Watch para búsqueda con debounce
let searchTimeout;
watch(buscarAlumnos, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    getAlumnos({ page: 1, itemsPerPage: itemsPerPage.value });
  }, 500);
});

// getAdmins (mantiene el funcionamiento original)
const getAdmins = async () => {
  loadingAdmins.value = true;
  const adminsJson = await (
    await fetch(import.meta.env.VITE_ENDPOINT + "users.php?action=getAdmins")
  ).json();

  const filteredAdmins = adminsJson.data.filter((item) => {
    if (item.id === usuarioStore.getId()) {
      return false;
    }
    if (
      buscarAdmins.value &&
      !item.email.toLowerCase().includes(buscarAdmins.value.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  admins.value = filteredAdmins;
  sizeAdmins.value = filteredAdmins.length; // 🔥 Total de admins
  loadingAdmins.value = false;
};

// 🔥 EDITAR ALUMNO
const editAlumno = async (id) => {
  idAlumno.value = id;
  dialogAlumno.value = true; // 🔥 Abrir diálogo
};

// 🔥 EDITAR ADMIN
const editAdmin = async (id) => {
  idAdmin.value = id;
  dialogAdmin.value = true; // 🔥 Abrir diálogo
};

// 🔥 ELIMINAR ALUMNO
const removeAlumno = async (id) => {
  try {
    const result = await (
      await fetch(
        import.meta.env.VITE_ENDPOINT + "users.php?action=deleteAlumno",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        },
      )
    ).json();

    if (result.status != "ok") {
      text.value = result.message;
      snackbar.value = true;
      return;
    }

    text.value = "Cuenta de alumno eliminada/deshabilitada.";
    snackbar.value = true;

    await getAlumnos({ page: 1, itemsPerPage: itemsPerPage.value });
  } catch (error) {
    text.value = "Ha ocurrido un error.";
    snackbar.value = true;
  }
};

// 🔥 ELIMINAR ADMIN
const removeAdmin = async (id) => {
  try {
    const result = await (
      await fetch(
        import.meta.env.VITE_ENDPOINT + "users.php?action=deleteAdmin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        },
      )
    ).json();

    if (result.status != "ok") {
      text.value = result.message;
      snackbar.value = true;
      return;
    }

    text.value = "Cuenta de admin eliminada/deshabilitada.";
    snackbar.value = true;

    await getAdmins();
  } catch (error) {
    text.value = "Ha ocurrido un error.";
    snackbar.value = true;
  }
};

// 🔥 CERRAR DIÁLOGOS
const cerrar = async () => {
  dialog.value = false;
  await getAlumnos({ page: 1, itemsPerPage: itemsPerPage.value });
  await getAdmins();
};

const cerrarAlumno = async () => {
  dialogAlumno.value = false;
  await getAlumnos({ page: 1, itemsPerPage: itemsPerPage.value });
};

const cerrarAdmin = async () => {
  dialogAdmin.value = false;
  await getAdmins();
};

const exportarCSV = async () => {
  loadingCSV.value = true;
  try {
    const url = `${import.meta.env.VITE_ENDPOINT}questions.php?action=getDataset`;
    const response = await fetch(url);
    const json = await response.json();

    if (json.status !== "ok") {
      text.value = json.message || "Error al generar el dataset.";
      snackbar.value = true;
      return;
    }
    if (!json.data?.length) {
      text.value = "No hay datos de encuestas para exportar.";
      snackbar.value = true;
      return;
    }

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return "";
      const str = String(val);
      return str.includes(",") || str.includes('"') || str.includes("\n")
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    };

    const campos = Object.keys(json.data[0]);
    const filas = [
      campos.join(","),
      ...json.data.map((row) => campos.map((c) => escapeCSV(row[c])).join(",")),
    ];

    const blob = new Blob(["﻿" + filas.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `dataset_dass21_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    text.value = "Error al exportar el dataset.";
    snackbar.value = true;
    console.error(error);
  } finally {
    loadingCSV.value = false;
  }
};

onMounted(() => {
  getAlumnos({ page: 1, itemsPerPage: itemsPerPage.value });
  getAdmins();
  cargarFactoresAlumno(); // ← agregar
});
</script>

<style lang="scss" scoped>
.usuarios {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .encabezado {
    display: flex;
    gap: 1rem;
    justify-content: right;
    align-items: flex-end;

    * {
      flex: 0 1 auto !important;
      width: fit-content;
      min-width: 0;
    }
  }

  .tablas {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>

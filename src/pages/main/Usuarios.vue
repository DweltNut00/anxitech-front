<template>
  <div class="usuarios">
    <div class="encabezado">
      <v-btn
        block
        prepend-icon="mdi-plus"
        variant="flat"
        color="blue"
        @click="dialog = !dialog"
      >
        Nuevo usuario
      </v-btn>
    </div>
    <div class="tablas">
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
    </div>

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
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useUsuarioStore } from "@/stores/usuario";
import CrearUsuario from "@/components/main/CrearUsuario.vue";
import EditarAlumno from "@/components/main/EditarAlumno.vue";
import EditarAdmin from "@/components/main/EditarAdmin.vue";

const usuarioStore = useUsuarioStore();

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
        }
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
        }
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

onMounted(() => {
  getAlumnos({ page: 1, itemsPerPage: itemsPerPage.value });
  getAdmins();
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

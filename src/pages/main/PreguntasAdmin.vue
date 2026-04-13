<template>
  <div class="preguntas">
    <div class="encabezado">
      <v-btn
        block
        prepend-icon="mdi-plus"
        variant="flat"
        color="blue"
        @click="dialog = !dialog"
      >
        Nueva pregunta
      </v-btn>
    </div>
    <div class="tablas">
      <v-card class="preguntas">
        <v-data-table-server
          :headers="headers"
          :items="aplicaciones"
          :items-length="size"
          :loading="loading"
          v-model:items-per-page="itemsPerPage"
          @update:options="getPreguntas"
        >
          <template v-slot:top>
            <v-alert
              text="Podrás agregar y eliminar preguntas, pero NO será posible editarlas. De este banco, se seleccionarán 7 para aplicar una encuesta. Si no hay 7 preguntas registradas en el sistema, no se podrá realizar una encuesta."
              title="Consideraciones"
              type="info"
              variant="tonal"
            ></v-alert>
            <v-toolbar flat>
              <v-toolbar-title>
                <v-icon icon="mdi-help-circle-outline"></v-icon>

                Banco de preguntas
              </v-toolbar-title>
            </v-toolbar>
          </template>
          <!-- AGREGAR ESTE BLOQUE NUEVO -->
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="item.status === 1 ? 'green' : 'red'"
              :text="item.status === 1 ? 'Activado' : 'Desactivado'"
              size="small"
              variant="flat"
            ></v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex ga-1">
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
                      @click="removePregunta(item.id)"
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

    <v-dialog v-model="dialog" persistent width="auto">
      <CrearPregunta @cerrar="cerrar" />
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useUsuarioStore } from "@/stores/usuario";
import CrearPregunta from "@/components/main/CrearPregunta.vue";

const usuarioStore = useUsuarioStore();

const snackbar = ref(false);
const text = ref();
const timeout = ref(2500);

const aplicaciones = ref([]);
const size = computed(() => aplicaciones.value.length);
const loading = ref(true);

const dialog = ref(false);

const itemsPerPage = ref(10);

const headers = ref([
  { title: "Id", key: "id", align: "start" },
  { title: "Pregunta", key: "pregunta" },
  //{ title: 'Categoría', key: 'categoria', },
  { title: "Estatus", key: "status" },
  { title: "Acciones", key: "actions", sortable: false },
]);

const getPreguntas = async () => {
  loading.value = true;
  const dataJson = await (
    await fetch(
      import.meta.env.VITE_ENDPOINT + "questions.php?action=getPreguntas",
    )
  ).json();
  aplicaciones.value = dataJson.data;
  loading.value = false;
};

const removePregunta = async (id) => {
  try {
    const result = await (
      await fetch(
        import.meta.env.VITE_ENDPOINT + "questions.php?action=deletePregunta",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }),
        },
      )
    ).json();

    if (result.status != "ok") {
      text.value = result.message;
      snackbar.value = true;
      return;
    }

    text.value = "Pregunta eliminada/deshabilitada.";
    snackbar.value = true;

    await getPreguntas();
  } catch (error) {
    text.value = "Ha ocurrido un error.";
    snackbar.value = true;
  }
};

const cerrar = async () => {
  await getPreguntas();
  dialog.value = false;
};
</script>

<style lang="scss" scoped>
.preguntas {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .encabezado {
    display: flex;
    justify-content: right;
    gap: 1rem;
    align-items: end;

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

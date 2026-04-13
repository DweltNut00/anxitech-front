<template>
    <div class="aplicaciones">
        <div class="encabezado">
            <v-btn block prepend-icon="mdi-plus" variant="flat" color="blue" @click="dialog = !dialog">
                Nuevo periodo
            </v-btn>
        </div>
        <div class="tablas">
            <v-card class="aplicaciones">
                <v-data-table-server :headers="headers" :items="aplicaciones" :items-length="size" :loading="loading"
                    @update:options="getAplicaciones">
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title>
                                <v-icon icon="mdi-calendar"></v-icon>

                                Periodos de aplicación
                            </v-toolbar-title>
                        </v-toolbar>
                    </template>

                    <template v-slot:item.tipo="{ item }">
                        <v-chip>
                            {{ getTipo(item.tipo) }}
                        </v-chip>
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <div class="d-flex ga-1">
                            <v-btn color="medium-emphasis" size="small" icon flat>
                                <v-icon icon="mdi-delete"></v-icon>

                                <v-menu activator="parent" location="bottom end" transition="fade-transition">
                                    <v-list density="compact" min-width="250" rounded="lg" slim>
                                        <v-list-item prepend-icon="mdi-progress-question" title="Confirmar"
                                            @click="removeAplicacion(item.id)"></v-list-item>

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

            <v-alert
                text="Podrás agregar y eliminar periodos de aplicación, pero NO será posible editarlos. Las fechas de aplicación, aunque estén en status 1 (es decir, activos), que ya hayan caducado (que la fecha de cierre haya terminado) no podrán ser vistas por los alumnos. Si algún alumno ya contestó en algún periodo, no será posible eliminarlo, solo deshabilitarlo (status 0). Cada aplicación constará de 15 preguntas, que serán seleccionadas aleatoriamente del banco de preguntas: si en el sistema no existen al menos 15 preguntas con status 1, la aplicación no será visible para el alumno."
                title="Consideraciones" type="info" variant="tonal"></v-alert>
        </div>

        <v-snackbar v-model="snackbar" :timeout="timeout" variant="tonal">
            {{ text }}

            <template v-slot:actions>
                <v-btn color="blue" variant="text" @click="snackbar = false" icon="mdi-close"></v-btn>
            </template>
        </v-snackbar>

        <v-dialog v-model="dialog" persistent width="auto">
            <CrearPeriodo @cerrar="cerrar" />
        </v-dialog>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useUsuarioStore } from "@/stores/usuario";
import CrearPeriodo from '@/components/main/CrearPeriodo.vue';

const usuarioStore = useUsuarioStore();

const snackbar = ref(false)
const text = ref()
const timeout = ref(2500)

const aplicaciones = ref([])
const size = computed(() => aplicaciones.value.length)
const loading = ref(true)

const dialog = ref(false)

const idAplicacion = ref(null);

const headers = ref([
    { title: 'Id', key: 'id', align: 'start' },
    { title: 'Fecha de inicio', key: 'inicio', },
    { title: 'Fecha de cierre', key: 'fin', },
    { title: 'Tipo de encuesta', key: 'tipo', },
    { title: 'Status', key: 'status', },
    { title: 'Acciones', key: 'actions', sortable: false },
])

const getAplicaciones = async () => {
    loading.value = true;
    const dataJson = await (await fetch(import.meta.env.VITE_ENDPOINT + 'questions.php?action=getPeriodos')).json()
    aplicaciones.value = dataJson.data;
    loading.value = false;
}

const removeAplicacion = async (id) => {
    try {
        const result = await (await fetch(import.meta.env.VITE_ENDPOINT + 'questions.php?action=deletePeriodo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
            })
        })).json()

        if (result.status != 'ok') {
            text.value = result.message;
            snackbar.value = true;
            return;
        }

        text.value = "Periodo de aplicación eliminada/deshabilitada.";
        snackbar.value = true;

        await getAplicaciones();
    } catch (error) {
        text.value = "Ha ocurrido un error.";
        snackbar.value = true;
    }
}

const getTipo = (tipo) => {
    switch (tipo) {
        case 0:
            return "Encuesta de ansiedad"

        case 1:
            return "Encuesta complementaria"
    
        default:
            return "No reconocida"
    }
}

const cerrar = async () => {
    await getAplicaciones();
    dialog.value = false;
}
</script>

<style lang="scss" scoped>
.aplicaciones {
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
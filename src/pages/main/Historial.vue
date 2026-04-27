<template>
    <v-card class="aplicaciones">
            <v-data-table-server :headers="headers" :items="aplicaciones" :items-length="size" :loading="loading"
                @update:options="getAplicaciones">
                <template v-slot:top>
                    <v-toolbar flat color="light-blue">
                        <v-toolbar-title>
                            <v-icon icon="mdi-calendar"></v-icon>

                            Encuestas realizadas
                        </v-toolbar-title>
                    </v-toolbar>
                </template>

                <template v-slot:item.actions="{ item }">
                    <div class="d-flex ga-1">
                        <v-tooltip text="Ver resultados">
                            <template v-slot:activator="{ props }">
                                <v-btn color="medium-emphasis" icon size="small" flat @click="verAplicacion(item.id)"
                                    v-bind="props">
                                    <v-icon icon="mdi-eye-outline"></v-icon>
                                </v-btn>
                            </template>
                        </v-tooltip>
                    </div>
                </template>
            </v-data-table-server>
        </v-card>

        <v-snackbar v-model="snackbar" :timeout="timeout" variant="tonal">
            {{ text }}

            <template v-slot:actions>
                <v-btn color="blue" variant="text" @click="snackbar = false" icon="mdi-close"></v-btn>
            </template>
        </v-snackbar>
</template>

<script setup>
import { ref, computed } from 'vue'; // ← agrega computed
import { useRouter } from 'vue-router';
import { useUsuarioStore } from '@/stores/usuario';

const router = useRouter();
const usuarioStore = useUsuarioStore();

const snackbar = ref(false)
const text = ref()
const timeout = ref(2500)

const aplicaciones = ref([])
const size = computed(() => aplicaciones.value.length)
const loading = ref(true)

const headers = ref([
    { title: 'Fecha de inicio', key: 'inicio', },
    { title: 'Fecha de cierre', key: 'fin', },
    { title: 'Acciones', key: 'actions', sortable: false },
])

const getAplicaciones = async () => {
    loading.value = true;
    let dataJson = await (await fetch(import.meta.env.VITE_ENDPOINT + 'questions.php?action=getMisAplicaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_alumno: usuarioStore.getId()
            })
        })).json()
    aplicaciones.value = dataJson.data;
    loading.value = false;
}

const verAplicacion = async (id_aplicacion) => {
    usuarioStore.setIdAplicacion(id_aplicacion)
    router.push({ name: 'panel-resultados' })
}
</script>
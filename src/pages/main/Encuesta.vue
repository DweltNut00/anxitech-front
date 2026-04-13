<template>
    <div class="encuesta">
        <v-card subtitle="Lee con atención y responde a todas las preguntas" title="Instrucciones">
            <template v-slot:prepend>
                <v-icon color="primary" icon="mdi-help-circle"></v-icon>
            </template>
        </v-card>

        <v-progress-circular color="primary" indeterminate v-if="loading"></v-progress-circular>
        <div v-if="!completado">
            <v-card v-for="(item, key) in items" :key="key" :title="`Pregunta ${key + 1}`" :subtitle="item.pregunta"
                variant="plain">
                <template v-slot:prepend>
                    <v-icon color="primary" icon="mdi-help"></v-icon>
                </template>

                <v-card-text>
                    <v-btn-toggle v-model:model-value="respuestas[key]" color="blue" mandatory>
                        <v-btn prepend-icon="mdi-clock-remove-outline">
                            Nunca
                        </v-btn>

                        <v-btn prepend-icon="mdi-clock-minus-outline">
                            A veces
                        </v-btn>

                        <v-btn prepend-icon="mdi-clock-plus-outline">
                            A menudo
                        </v-btn>

                        <v-btn prepend-icon="mdi-clock-star-four-points-outline">
                            Casi siempre
                        </v-btn>
                    </v-btn-toggle>
                </v-card-text>
            </v-card>
        </div>
        <div v-else>
            <Recomendaciones :suma="suma" />
            <v-card title="¡Gracias!" subtitle="Se han registrado las respuestas de tu encuesta." variant="tonal" color="blue">
                <v-card-text>
                    En el apartado "Historial" podrás consultar tus respuestas.
                </v-card-text>
            </v-card>
        </div>

        <v-divider class="my-2"></v-divider>

        <div class="bottom" v-if="!completado">
            <v-btn prepend-icon="mdi-close" variant="plain" @click="salir">
                Cancelar
            </v-btn>
            <v-btn block prepend-icon="mdi-check" variant="flat" color="blue" @click="enviarEncuesta"
                :loading="loadingBtn">
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
                        <v-progress-circular color="primary" indeterminate="disable-shrink" size="16"
                            width="2"></v-progress-circular>
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
import { onBeforeMount, ref, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuarioStore } from '@/stores/usuario';
import Recomendaciones from '@/components/main/Recomendaciones.vue';

const router = useRouter();
const usuarioStore = useUsuarioStore();

const items = ref([])
const respuestas = ref([])

const snackbar = ref(false)
const text = ref()
const timeout = ref(2500)

const dialog = shallowRef(false)

const limit = 7;
const loading = ref(true);
const completado = ref(false);

const loadingBtn = ref(false);
const suma = ref(0);

const getEncuesta = async () => {
    const dataJson = await (await fetch(import.meta.env.VITE_ENDPOINT + 'questions.php?action=getEncuesta')).json()
    loading.value = false;
    items.value = dataJson.data;

    if (dataJson.data.length != limit) {
        salir();
    }
}

const enviarEncuesta = async () => {
    loadingBtn.value = true;

    let contestadas = 0;
    let body = [];
    for (let i = 0; i < respuestas.value.length; i++) {
        const element = respuestas.value[i];
        //console.log(element);

        if (element !== undefined) {
            contestadas++;
            suma.value += element;
            body.push({
                id_pregunta: items.value[i].id,
                value: element
            })
        }
    }

    if (contestadas != limit) {
        text.value = "No has respondido a todas las preguntas.";
        snackbar.value = true;
        loadingBtn.value = false;
        return;
    }

    try {
        dialog.value = true;

        const register = await (await fetch(import.meta.env.VITE_ENDPOINT + 'questions.php?action=registerEncuesta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_alumno: usuarioStore.getId(),
                id_aplicacion: usuarioStore.getIdAplicacion(),
                preguntas: body,
            })
        })).json()

        if (register.status != 'ok') {
            text.value = register.message;
            snackbar.value = true;
            loadingBtn.value = false;
            return;
        }

        setTimeout(() => {
            dialog.value = false
            completado.value = true;
        }, 500);
    } catch (error) {
        text.value = "Ha ocurrido un error.";
        snackbar.value = true;
        dialog.value = false
    }
}

const salir = async () => {
    router.push({ name: 'panel-inicio' })
}

onBeforeMount(async () => {
    if (usuarioStore.getIdAplicacion() === null) {
        router.push({ name: 'panel-inicio' })
    }

    await getEncuesta();
})


</script>

<style lang="scss" scoped>
.encuesta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

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
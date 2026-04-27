    <template>
        <div class="encuesta">
            <v-card subtitle="A continuación, se muestran algunas recomendaciones de acuerdo a lo que respondiste."
                title="Tus resultados">
                <template v-slot:prepend>
                    <v-icon color="primary" icon="mdi-help-circle"></v-icon>
                </template>

                <template v-slot:append>
                    <v-btn-toggle v-model:model-value="toggle" color="blue-darken-1" mandatory>
                        <v-btn prepend-icon="mdi-lightbulb-outline" value="recomendaciones">
                            Recomendaciones
                        </v-btn>

                        <v-btn prepend-icon="mdi-help-box-multiple-outline" value="preguntas">
                            Preguntas
                        </v-btn>
                    </v-btn-toggle>
                </template>
            </v-card>

            <v-progress-circular color="primary" indeterminate v-if="loading"></v-progress-circular>
            <div v-if="toggle === 'preguntas'">
                <v-card v-for="(item, key) in items" :key="key" :title="`Pregunta ${key + 1}`" :subtitle="item.pregunta"
                    variant="plain">
                    <template v-slot:prepend>
                        <v-icon color="primary" icon="mdi-help"></v-icon>
                    </template>

                    <v-card-text>
                        <v-btn-toggle v-model:model-value="item.valor" color="blue" mandatory>
                            <v-btn prepend-icon="mdi-clock-remove-outline" readonly>
                                Nunca
                            </v-btn>

                            <v-btn prepend-icon="mdi-clock-minus-outline" readonly>
                                A veces
                            </v-btn>

                            <v-btn prepend-icon="mdi-clock-plus-outline" readonly>
                                A menudo
                            </v-btn>

                            <v-btn prepend-icon="mdi-clock-star-four-points-outline" readonly>
                                Casi siempre
                            </v-btn>
                        </v-btn-toggle>
                    </v-card-text>
                </v-card>
            </div>
            <Recomendaciones v-if="toggle === 'recomendaciones'" :suma="suma" />

            <v-divider class="my-2"></v-divider>

            <div class="bottom">
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

    const limit = 3;
    const loading = ref(true);

    const loadingBtn = ref(false);
    const toggle = ref('recomendaciones')
    const suma = ref(0)

    const getEncuesta = async () => {
        const dataJson = await (await fetch(import.meta.env.VITE_ENDPOINT + 'questions.php?action=getMiEncuesta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_alumno: usuarioStore.getId(),
                id_aplicacion: usuarioStore.getIdAplicacion(),
            })
        })).json()
        loading.value = false;
        items.value = dataJson.data;

      

        for (let i = 0; i < dataJson.data.length; i++) {
            const element = dataJson.data[i];
            suma.value += element.valor;
        }
    }

    const salir = async () => {
        router.push({ name: 'panel-historial' })
    }

    onBeforeMount(async () => {
        if (usuarioStore.getIdAplicacion() === null) {
            router.push({ name: 'panel-historial' })
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
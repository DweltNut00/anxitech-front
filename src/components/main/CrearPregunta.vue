<template>
    <v-card>
        <v-window class="dialog" v-model="step">
            <v-window-item :value="1">
                <v-card elevation-1 elevation="0">
                    <v-form v-model="basics_valid" class="item">
                        <div class="header">
                            <div class="icon">
                                <v-icon icon="mdi-map-legend" size="x-large" color="grey-darken-2"></v-icon>
                            </div>
                            <h2 class="title">¡Empecemos!</h2>
                            <h4 class="subtitle text-grey-lighten-1">Define el rango en que se podrá realizar la
                                encuesta:</h4>
                        </div>

                        <div class="field-group">
                            <div class="field">
                                <div class="field">
                                <v-text-field label="Pregunta" prepend-inner-icon="mdi-help" rounded="lg"
                                    v-model="pregunta" :rules="basicRules"></v-text-field>
                            </div>
                            </div>
                        </div>
                    </v-form>

                    <template v-slot:actions>
                        <v-btn rounded="lg" variant="flat" @click="goTo">
                            Cancelar
                        </v-btn>

                        <v-spacer></v-spacer>

                        <v-btn rounded="lg" variant="flat" color="light-blue-darken-2" @click="validateRange">
                            Crear pregunta
                        </v-btn>
                    </template>
                </v-card>
            </v-window-item>

            <v-dialog v-model="dialog" max-width="320" persistent>
                <v-list class="py-2" color="primary" elevation="12" rounded="lg">
                    <v-list-item prepend-icon="mdi-clock-time-four-outline" title="Registrando pregunta...">
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

            <v-window-item :value="2">
                <v-card elevation-1 elevation="0" class="item">
                    <div class="header">
                        <div class="icon">
                            <v-icon icon="mdi-check" size="x-large" color="grey-darken-2"></v-icon>
                        </div>
                        <h2 class="title">¡Éxito!</h2>
                        <h4 class="subtitle text-grey-lighten-1">¡Excelente! Pregunta registrada.
                        </h4>
                    </div>

                    <template v-slot:actions>
                        <v-spacer></v-spacer>

                        <v-btn rounded="lg" variant="flat" color="light-blue-darken-2" @click="goTo">
                            Salir
                        </v-btn>
                    </template>
                </v-card>
            </v-window-item>

            <v-snackbar v-model="snackbar" :timeout="timeout" variant="tonal">
                {{ text }}

                <template v-slot:actions>
                    <v-btn color="blue" variant="text" @click="snackbar = false" icon="mdi-close"></v-btn>
                </template>
            </v-snackbar>
        </v-window>
    </v-card>
</template>

<script setup>
import { ref, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router';
import { useUsuarioStore } from '@/stores/usuario';

const usuarioStore = useUsuarioStore();

const dialog = shallowRef(false)

const snackbar = ref(false)
const text = ref()
const timeout = ref(2500)

const step = ref(1)
const pregunta = ref()

const basics_valid = ref(false)

const basicRules = ref([
    value => {
        if (value) return true

        return 'Campo requerido.'
    }
])

const validateRange = async () => {
    if (!basics_valid.value) {
        text.value = "Verifica tus datos.";
        snackbar.value = true;
        return;
    }

    try {
        dialog.value = true;

        const register = await (await fetch(import.meta.env.VITE_ENDPOINT + 'questions.php?action=registerPregunta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pregunta: pregunta.value,
            })
        })).json()

        if (register.status != 'ok') {
            text.value = register.message;
            snackbar.value = true;
            return;
        }

        setTimeout(() => {
            dialog.value = false
            step.value = 2
        }, 500);
    } catch (error) {
        text.value = "Ha ocurrido un error.";
        snackbar.value = true;
        dialog.value = false
    }
}

const emit = defineEmits(['cerrar'])

const goTo = () => {
    emit('cerrar')
}

function formatDate(date) {
    const year = date.getFullYear(); // Obtiene el año (YYYY)
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtiene el mes (mm) y agrega un 0 si es necesario
    const day = String(date.getDate()).padStart(2, '0'); // Obtiene el día (dd) y agrega un 0 si es necesario

    return `${year}-${month}-${day}`; // Retorna la fecha en formato YYYY-mm-dd
}

</script>

<style lang="scss" scoped>
@use '../../styles/settings.scss' as constants;

.dialog {
    padding: constants.$margin * 2;

    .item {
        width: 100%;
        padding: 2px;

        display: flex;
        flex-direction: column;
        gap: constants.$gap * 3;

        .header {
            .icon {
                width: fit-content;
                border-radius: 6px;
                border: 1px solid lightgray;
                padding: 4px;
            }

            .title {
                font-size: 2rem;
                font-weight: 800;
            }

            .subtitle {
                font-weight: 600;
            }
        }

        .field-group {
            display: flex;
            flex-direction: column;
            gap: constants.$gap;

            .field {
                display: flex;
                flex-direction: column;

                .btn-txt {
                    margin: 0;
                    margin-left: auto;
                    width: fit-content;
                }
            }
        }

        .buttons {
            display: flex;
            flex-direction: column;
            gap: constants.$gap;
        }
    }
}
</style>
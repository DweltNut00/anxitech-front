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
                            <h2 class="title">Editar: Nombre</h2>
                            <h4 class="subtitle text-grey-lighten-1">Para empezar, edita la información básica del alumno:</h4>
                        </div>

                        <div class="field-group">
                            <div class="field">
                                <v-text-field label="Nombre(s)" prepend-inner-icon="mdi-account" rounded="lg"
                                    v-model="nombre" :rules="basicRules"></v-text-field>
                            </div>
                            <div class="field">
                                <v-text-field label="Apellido(s)" prepend-inner-icon="mdi-account" rounded="lg"
                                    v-model="apellido" :rules="basicRules"></v-text-field>
                            </div>
                            <div class="field">
                                <v-text-field label="No. Control" prepend-inner-icon="mdi-account-outline" rounded="lg"
                                    v-model="noControl" :rules="noControlRules"></v-text-field>
                            </div>
                        </div>
                    </v-form>

                    <template v-slot:actions>
                        <v-btn rounded="lg" variant="flat" @click="goTo">
                            Cancelar
                        </v-btn>

                        <v-spacer></v-spacer>

                        <v-btn rounded="lg" variant="flat" color="light-blue-darken-2" @click="validateUserEmail">
                            Continuar
                        </v-btn>
                    </template>
                </v-card>
            </v-window-item>

            <v-window-item :value="2">
                <v-card elevation-1 elevation="0">
                    <v-form v-model="personal_valid" class="item">
                        <div class="header">
                            <div class="icon">
                                <v-icon icon="mdi-map-marker" size="x-large" color="grey-darken-2"></v-icon>
                            </div>
                            <h2 class="title">Información personal</h2>
                            <h4 class="subtitle text-grey-lighten-1">¡No te preocupes! Esta información es confidencial.
                            </h4>
                        </div>

                        <div class="field-group">
                            <div class="field">
                                <v-text-field label="Ciudad" prepend-inner-icon="mdi-map-marker" rounded="lg"
                                    v-model="ciudad" :rules="basicRules"></v-text-field>
                            </div>

                            <div class="field">
                                <v-text-field label="Estado" prepend-inner-icon="mdi-map-marker" rounded="lg"
                                    v-model="estado" :rules="basicRules"></v-text-field>
                            </div>

                            <div class="field">
                                <div class="field">
                                    <v-date-input label="Fecha de nacimiento" :rules="basicRules"
                                        v-model="fechaN"></v-date-input>
                                </div>
                            </div>

                            <div class="field">
                                <p>Estado civil</p>
                                <v-radio-group v-model="estadoC" inline>
                                    <v-radio label="Soltero" value="Soltero"></v-radio>
                                    <v-radio label="Casado" value="Casado"></v-radio>
                                    <v-radio label="Divorciado" value="Divorciado"></v-radio>
                                    <v-radio label="Viudo" value="Viudo"></v-radio>
                                </v-radio-group>
                            </div>

                            <div class="field">
                                <p>Sexo</p>
                                <v-radio-group v-model="sexo" inline>
                                    <v-radio label="Masculino" value="M"></v-radio>
                                    <v-radio label="Femenino" value="F"></v-radio>
                                </v-radio-group>
                            </div>
                        </div>
                    </v-form>

                    <template v-slot:actions>
                        <v-btn rounded="lg" variant="flat" @click="goTo">
                            Cancelar
                        </v-btn>

                        <v-spacer></v-spacer>

                        <v-btn variant="text" @click="step--">
                            Regresar
                        </v-btn>

                        <v-btn rounded="lg" variant="flat" color="light-blue-darken-2" @click="validatePersonal">
                            Continuar
                        </v-btn>
                    </template>
                </v-card>
            </v-window-item>

            <v-window-item :value="3">
                <v-card elevation-1 elevation="0">
                    <v-form v-model="passw_valid" class="item">
                        <div class="header">
                            <div class="icon">
                                <v-icon icon="mdi-form-textbox-password" size="x-large" color="grey-darken-2"></v-icon>
                            </div>
                            <h2 class="title">Establecer contrase&ntilde;a</h2>
                            <h4 class="subtitle text-grey-lighten-1">¡Ya casi! Solo hay que crear una contraseña.
                            </h4>
                        </div>

                        <div class="field-group">
                            <div class="field">
                                <v-text-field label="Contraseña" prepend-inner-icon="mdi-key-variant" rounded="lg"
                                    v-model="pass" type="password" :rules="passRules"></v-text-field>
                            </div>

                            <div class="field">
                                <v-text-field label="Confirmar contraseña" prepend-inner-icon="mdi-key-variant"
                                    rounded="lg" v-model="con_pass" type="password"
                                    :rules="conPassRules"></v-text-field>
                            </div>
                        </div>
                    </v-form>

                    <template v-slot:actions>
                        <v-btn rounded="lg" variant="flat" @click="goTo">
                            Cancelar
                        </v-btn>

                        <v-spacer></v-spacer>

                        <v-btn variant="text" @click="regresarPass">
                            Regresar
                        </v-btn>

                        <v-btn rounded="lg" variant="flat" color="light-blue-darken-2" @click="editar">
                            Editar
                        </v-btn>
                    </template>
                </v-card>
            </v-window-item>

            <v-dialog v-model="dialog" max-width="320" persistent>
                <v-list class="py-2" color="primary" elevation="12" rounded="lg">
                    <v-list-item prepend-icon="mdi-clock-time-four-outline" title="Aplicando cambios...">
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

            <v-window-item :value="4">
                <v-card elevation-1 elevation="0" class="item">
                    <div class="header">
                        <div class="icon">
                            <v-icon icon="mdi-check" size="x-large" color="grey-darken-2"></v-icon>
                        </div>
                        <h2 class="title">¡Éxito!</h2>
                        <h4 class="subtitle text-grey-lighten-1">¡Excelente! Cuenta de alumno actualizada.
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
import { ref, shallowRef, onMounted } from 'vue'
import { useUsuarioStore } from '@/stores/usuario';

const usuarioStore = useUsuarioStore();

const dialog = shallowRef(false)

const snackbar = ref(false)
const text = ref()
const timeout = ref(2500)

const step = ref(1)
const nombre = ref()
const apellido = ref()
const user = ref()
const noControl = ref()
const email = ref()
const fechaN = ref()
const sexo = ref('M')
const estadoC = ref('Soltero')
const ciudad = ref()
const estado = ref()
const pass = ref()
const con_pass = ref()

const basics_valid = ref(false)
const personal_valid = ref(false)
const passw_valid = ref(false)

const basicRules = ref([
    value => {
        if (value) return true

        return 'Campo requerido.'
    }
])

const noControlRules = ref([
    value => {
        if (value) return true

        return 'Número de contrl requerido.'
    },
    value => {
        if (/^\d{8}$/.test(value)) return true

        return 'Debe tener 8 dígitos.'
    }
])

const passRules = ref([
    value => {
        if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(value) || !value) return true

        return 'Debe tener al menos: 8 carácteres, una mayúscula, una minúscula y un número.'
    }
])

const conPassRules = ref([
    value => {
        if (value == pass.value) return true

        return 'Las contraseñas no coinciden.'
    }
])

const validateUserEmail = async () => {
    if (!basics_valid.value) {
        text.value = "Verifica tus datos.";
        snackbar.value = true;
        return;
    }

    step.value = 2;
}

const validatePersonal = () => {
    if (!personal_valid.value) {
        text.value = "No has llenado todos los campos.";
        snackbar.value = true;
        return;
    }

    step.value = 3;
}

const regresarPass = async () => {
    step.value = 2;
}

const editar = async () => {
    if (pass.value !== con_pass.value) {
        text.value = "Las contraseñas no son iguales.";
        snackbar.value = true;
        return;
    }

    try {
        dialog.value = true;

        const register = await (await fetch(import.meta.env.VITE_ENDPOINT + 'users.php?action=updateAlumno', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: props.id,
                password: pass.value,
                nombre: nombre.value,
                apellido: apellido.value,
                nocontrol: noControl.value,
                fechan: formatDate(fechaN.value),
                estadoc: estadoC.value,
                sexo: sexo.value,
                ciudad: ciudad.value,
                estado: estado.value,
            })
        })).json()

        if (register.status != 'ok') {
            text.value = register.message;
            snackbar.value = true;
            return;
        }

        setTimeout(() => {
            dialog.value = false
            step.value = 4
        }, 1000);
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

const props = defineProps(['id'])

onMounted(async () => {
    const alumnosJson = await (await fetch(import.meta.env.VITE_ENDPOINT + 'users.php?action=getAlumno', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: props.id,
            })
        })).json()
    
    if (alumnosJson.status === 'ok') {
        nombre.value = alumnosJson.data.nombre;
        apellido.value = alumnosJson.data.apellido;
        noControl.value = alumnosJson.data.nocontrol;
        fechaN.value = new Date(alumnosJson.data.fechan);
        sexo.value = alumnosJson.data.sexo[0];
        estadoC.value = alumnosJson.data.estadoc;
        estado.value = alumnosJson.data.estado;
        ciudad.value = alumnosJson.data.ciudad;
    } else {
        emit('cerrar')
    }
})

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
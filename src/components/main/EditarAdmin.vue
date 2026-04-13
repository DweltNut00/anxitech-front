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
                    <v-form class="item">
                        <div class="header">
                            <div class="icon">
                                <v-icon icon="mdi-shield-crown" size="x-large" color="grey-darken-2"></v-icon>
                            </div>
                            <h2 class="title">Información administrativa</h2>
                            <h4 class="subtitle text-grey-lighten-1">Capacidades del administrador.
                            </h4>
                        </div>

                        <div class="field-group">
                            <v-select :item-props="itemProps" :items="permisos" label="Permisos" item-value="value"
                                v-model="permiso" :hint="`${permiso.warn}`" persistent-hint return-object></v-select>
                        </div>
                    </v-form>

                    <template v-slot:actions>
                        <v-btn rounded="lg" variant="flat" @click="goTo">
                            Cancelar
                        </v-btn>

                        <v-spacer></v-spacer>

                        <v-btn variant="text" @click="step = 1">
                            Regresar
                        </v-btn>

                        <v-btn rounded="lg" variant="flat" color="light-blue-darken-2" @click="validateAdmin">
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
                        <h4 class="subtitle text-grey-lighten-1">¡Excelente! Cuenta de administrador actualizada.
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
const pass = ref()
const con_pass = ref()

const permiso = shallowRef({
    capacidad: 'Básico',
    descripcion: 'No puede ver ni gestionar administradores.',
    warn: 'Ideal para gestionar alumnos y fechas de aplicación.',
    value: 0,
})

const permisos = [
    {
        capacidad: 'Básico',
        descripcion: 'No puede ver ni gestionar administradores.',
        warn: 'Ideal para gestionar alumnos y fechas de aplicación.',
        value: 0,
    },
    {
        capacidad: 'Super-administrador',
        descripcion: 'Puede ver y gestionar administradores.',
        warn: 'Cuidado: Puede crear, editar y eliminar a otros administradores.',
        value: 1,
    },
]

function itemProps(item) {
    return {
        title: item.capacidad,
        subtitle: item.descripcion,
    }
}

const basics_valid = ref(false)
const passw_valid = ref(false)

const basicRules = ref([
    value => {
        if (value) return true

        return 'Campo requerido.'
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

const validateAdmin = () => {
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

        const register = await (await fetch(import.meta.env.VITE_ENDPOINT + 'users.php?action=updateAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: props.id,
                password: pass.value,
                nombre: nombre.value,
                apellido: apellido.value,
                permisos: permiso.value.value,
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

const props = defineProps(['id'])

onMounted(async () => {
    const dataJson = await (await fetch(import.meta.env.VITE_ENDPOINT + 'users.php?action=getAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: props.id,
            })
        })).json()

    if (dataJson.status === 'ok') {
        nombre.value = dataJson.data.nombre;
        apellido.value = dataJson.data.apellido;
        permiso.value = permisos.find(item => item.value === dataJson.data.permisos);
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
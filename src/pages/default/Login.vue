<template>
    <v-window class="login" v-model="step">
        <v-window-item :value="1">
            <v-card elevation-1 elevation="0">
                <v-form v-model="login_valid" class="item">
                    <div class="header">
                        <div class="icon">
                            <v-icon icon="mdi-account" size="x-large" color="grey-darken-2"></v-icon>
                        </div>
                        <h2 class="title">Ingresa a tu cuenta</h2>
                        <h4 class="subtitle text-grey-lighten-1">Por favor, ingresa tus datos.</h4>
                    </div>

                    <div class="field-group">
                        <div class="field">
                            <v-text-field label="Nombre de usuario" prepend-inner-icon="mdi-account" rounded="lg"
                                v-model="user" :rules="userRules"></v-text-field>
                        </div>
                        <div class="field">
                            <v-text-field label="Contraseña" prepend-inner-icon="mdi-key-variant" rounded="lg"
                                v-model="pass" type="password" :rules="passRules"></v-text-field>
                            <v-btn variant="text" size="small" class="btn-txt" @click="step++">
                                Restaurar contrase&ntilde;a.
                            </v-btn>
                        </div>
                    </div>

                    <div class="buttons">
                        <v-btn rounded="lg" variant="flat" color="light-blue-darken-2" @click="login">
                            Iniciar sesi&oacute;n
                        </v-btn>

                        <v-btn variant="text" size="small" @click="goTo">
                            ¿No tienes cuenta? ¡Crea una!
                        </v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-window-item>

        <v-window-item :value="2">
            <v-card elevation-1 elevation="0">
                <v-form v-model="email_valid" class="item">
                    <div class="header">
                        <div class="icon">
                            <v-icon icon="mdi-fingerprint" size="x-large" color="grey-darken-2"></v-icon>
                        </div>
                        <h2 class="title">Recuperar contrase&ntilde;a</h2>
                        <h4 class="subtitle text-grey-lighten-1">¿Olvidaste tu contraseña? ¡No te preocupes! Te
                            enviaremos instrucciones para restaturarla.</h4>
                    </div>

                    <div class="field-group">
                        <div class="field">
                            <v-text-field label="Correo electrónico" prepend-inner-icon="mdi-at" rounded="lg"
                                type="email" v-model="email" :rules="emailRules"></v-text-field>
                        </div>
                    </div>

                    <div class="buttons">
                        <v-btn rounded="lg" variant="flat" color="light-blue-darken-2" @click="sendCode">
                            Enviar código
                        </v-btn>

                        <v-btn variant="text" size="small" @click="step = 1">
                            Regresar a inicio
                        </v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-window-item>

        <v-window-item :value="3">
            <v-card elevation-1 elevation="0">
                <div class="item">
                    <div class="header">
                        <div class="icon">
                            <v-icon icon="mdi-email-open-outline" size="x-large" color="grey-darken-2"></v-icon>
                        </div>
                        <h2 class="title">Código de confirmación</h2>
                        <h4 class="subtitle text-grey-lighten-1">Hemos enviado un código a <strong>{{ email }}</strong>.
                        </h4>
                    </div>

                    <div class="field-group">
                        <div class="field">
                            <v-otp-input v-model="code"></v-otp-input>
                        </div>
                    </div>

                    <div class="buttons">
                        <v-btn rounded="lg" variant="flat" color="light-blue-darken-2" @click="verifyCode">
                            Continuar
                        </v-btn>

                        <v-btn variant="text" size="small" @click="step = 1">
                            Regresar a inicio
                        </v-btn>
                    </div>
                </div>
            </v-card>
        </v-window-item>

        <v-window-item :value="4">
            <v-card elevation-1 elevation="0">
                <v-form v-model="passw_valid" class="item">
                    <div class="header">
                        <div class="icon">
                            <v-icon icon="mdi-form-textbox-password" size="x-large" color="grey-darken-2"></v-icon>
                        </div>
                        <h2 class="title">Restaurar contrase&ntilde;a</h2>
                        <h4 class="subtitle text-grey-lighten-1">¡Ya casi! Solo debes crear tu nueva contraseña.</h4>
                    </div>

                    <div class="field-group">
                        <div class="field">
                            <v-text-field label="Nueva contraseña" prepend-inner-icon="mdi-key-variant" rounded="lg"
                                v-model="new_pass" type="password" :rules="newPassRules"></v-text-field>
                        </div>

                        <div class="field">
                            <v-text-field label="Confirmar contraseña" prepend-inner-icon="mdi-key-variant" rounded="lg"
                                v-model="con_pass" type="password" :rules="conPassRules"></v-text-field>
                        </div>
                    </div>

                    <div class="buttons">
                        <v-btn rounded="lg" variant="flat" color="light-blue-darken-2" @click="changePassword">
                            Actualizar contraseña
                        </v-btn>

                        <v-btn variant="text" size="small" @click="step = 1">
                            Regresar a inicio
                        </v-btn>
                    </div>
                </v-form>
            </v-card>
        </v-window-item>

        <v-dialog v-model="dialog" max-width="320" persistent>
    <v-list class="py-2" color="primary" elevation="12" rounded="lg">
        <v-list-item prepend-icon="mdi-email-outline" title="Enviando código...">
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
    </v-window>
</template>

<script setup>
import { ref, onBeforeMount, shallowRef } from 'vue'
import { useRouter } from 'vue-router';
import { useUsuarioStore } from "@/stores/usuario";

const router = useRouter();
const dialog = shallowRef(false)

const usuarioStore = useUsuarioStore();

const snackbar = ref(false)
const text = ref()
const timeout = ref(2500)

const step = ref(1)
const user = ref()
const pass = ref()
const email = ref()
const code = ref()
const new_pass = ref()
const con_pass = ref()

const answer = ref(123456)

const login_valid = ref(false)
const email_valid = ref(false)
const code_valid = ref(false)
const passw_valid = ref(false)

const userRules = ref([
    value => {
        if (value) return true

        return 'Nombre de usuario requerido.'
    }
])

const passRules = ref([
    value => {
        if (value) return true

        return 'Contraseña requerida.'
    }
])

const emailRules = ref([
    value => {
        if (value) return true

        return 'Correo electrónico requerido.'
    }
])

const newPassRules = ref([
    value => {
        if (value) return true

        return 'Contraseña requerida.'
    },
    value => {
        if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(value)) return true

        return 'Debe tener al menos: 8 carácteres, una mayúscula, una minúscula y un número.'
    }
])

const conPassRules = ref([
    value => {
        if (value) return true

        return 'Contraseña requerida.'
    },
    value => {
        if (value == new_pass.value) return true

        return 'Las contraseñas no coinciden.'
    }
])

const login = async () => {
    if (!login_valid.value) {
        text.value = "No has llenado todos los campos.";
        snackbar.value = true;
        return;
    }

    try {
        const login = await (await fetch(import.meta.env.VITE_ENDPOINT + 'auth.php?action=login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: user.value,
                password: pass.value
            })
        })).json()

        if (login.status != 'ok') {
            text.value = login.message;
            snackbar.value = true;
            return;
        }

        usuarioStore.setId(login.data.id)
        usuarioStore.setNombre(login.data.nombre)
        usuarioStore.setApellido(login.data.apellido)
        usuarioStore.setTipo(login.data.tipo)
        usuarioStore.setToken(login.data.token)
        usuarioStore.setTema(login.data.tema)

        if (login.data.tipo == 'Admin') {
            usuarioStore.setPermisos(login.data.permisos)
        }

        router.push('/panel')
    } catch (error) {
        text.value = "Ha ocurrido un error.";
        snackbar.value = true;
        console.log(error)
        //dialog.value = false
    }
}

const sendCode = async () => {
    if (!email_valid.value) {
        text.value = "No has llenado todos los campos.";
        snackbar.value = true;
        return;
    }

    dialog.value = true  // mostrar loading

    try {
        const data = await (await fetch(import.meta.env.VITE_ENDPOINT + 'users.php?action=enviarCodigo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value })
        })).json()

        dialog.value = false  // ocultar loading

        if (data.status != 'ok') {
            text.value = data.message;
            snackbar.value = true;
            return;
        }

        step.value++;
    } catch (error) {
        dialog.value = false
        text.value = "Ha ocurrido un error al enviar el correo.";
        snackbar.value = true;
        console.log(error)
    }
}

const verifyCode = async () => {
    if (code.value.length !== 6) {
        text.value = "No has ingresado todo el código.";
        snackbar.value = true;
        return;
    }

    try {
        const data = await (await fetch(import.meta.env.VITE_ENDPOINT + 'users.php?action=validarCodigo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.value,
                codigo: code.value,
            })
        })).json()

        if (data.status != 'ok') {
            text.value = data.message;
            snackbar.value = true;
            return;
        }

        step.value++;
    } catch (error) {
        text.value = "Ha ocurrido un error.";
        snackbar.value = true;
        console.log(error)
        //dialog.value = false
    }
}

const changePassword = async () => {
    if (!passw_valid.value) {
        text.value = "Verifica la información.";
        snackbar.value = true;
        return;
    }

    try {
        const data = await (await fetch(import.meta.env.VITE_ENDPOINT + 'users.php?action=actualizarPass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.value,
                pass: new_pass.value,
            })
        })).json()

        if (data.status != 'ok') {
            text.value = data.message;
            snackbar.value = true;
            return;
        }

        text.value = "Contraseña actualizada.";
        snackbar.value = true;

        step.value = 1;
    } catch (error) {
        text.value = "Ha ocurrido un error.";
        snackbar.value = true;
        console.log(error)
        //dialog.value = false
    }
}

const goTo = () => {
    router.push('/registro');
}

</script>

<style lang="scss" scoped>
@use '../../styles/settings.scss' as constants;

.login {
    width: 100%;
    padding-block: constants.$margin * 3;

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
<template>
    <div class="ajustes">
        <v-card prepend-icon="mdi-auto-fix" subtitle="Selecciona entre claro y oscuro.">
            <template v-slot:title>
                <span class="font-weight-black">Tema</span>
            </template>

            <v-card-item>
                <v-select label="Selecciona uno"
                    :items="temas" item-title="label" item-value="value" v-model="tema"></v-select>
            </v-card-item>
        </v-card>

        <v-dialog v-model="dialog" max-width="320" persistent>
                <v-list class="py-2" color="primary" elevation="12" rounded="lg">
                    <v-list-item prepend-icon="mdi-clock-time-four-outline" title="Aplicando ajuste...">
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
import { useUsuarioStore } from '@/stores/usuario';
import { onMounted, watch } from 'vue';
import { useTheme } from 'vuetify'

const theme = useTheme()

const usuarioStore = useUsuarioStore();

const dialog = shallowRef(false)

const snackbar = ref(false)
const text = ref()
const timeout = ref(2500)

const tema = ref();
const temas = ref([
    {
        label: 'Claro',
        value: 'light'
    },
    {
        label: 'Oscuro',
        value: 'dark'
    },
]);

const toggleTheme = async () => {
    try {
        dialog.value = true;

        const dataJson = await (await fetch(import.meta.env.VITE_ENDPOINT + 'users.php?action=updateTema', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: usuarioStore.getId(),
                tema: tema.value,
            })
        })).json()

        if (dataJson.status != 'ok') {
            text.value = dataJson.message;
            snackbar.value = true;
            return;
        }

        setTimeout(() => {
            dialog.value = false
            theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
        }, 1000);
    } catch (error) {
        text.value = "Ha ocurrido un error.";
        snackbar.value = true;
        dialog.value = false
    }
}

onMounted(async () => {
    tema.value = usuarioStore.getTema();

    watch(tema, async () => {
        await toggleTheme();
    })
})

</script>
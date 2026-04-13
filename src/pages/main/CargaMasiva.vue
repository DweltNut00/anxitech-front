<template>
    <div class="usuarios">
        <v-alert
            text="Para registrar cuentas de alumnos masivamente, deberás subir un archivo de Excel (.xlsx o .xls). Este archivo DEBE encabezados."
            title="¿Qué formato debe tener?" type="info" variant="tonal"></v-alert>

        <div class="tabla-wrap">
            <div class="header">
                <span class="mdi mdi-microsoft-excel"></span>
                <h3>Ejemplo</h3>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>username</th>
                        <th>nombre</th>
                        <th>apellido</th>
                        <th>email</th>
                        <th>password</th>
                        <th>nocontrol</th>
                        <th>sexo</th>
                        <th>fechan</th>
                        <th>estadoc</th>
                        <th>ciudad</th>
                        <th>estado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>jperez</td>
                        <td>Juan</td>
                        <td>P&eacute;rez</td>
                        <td>juan.p@anxitech.com</td>
                        <td>super_secreto</td>
                        <td>20011001</td>
                        <td>
                            <ul>
                                <li>M</li>
                                <li>F</li>
                            </ul>
                        </td>
                        <td>
                            <ul>
                                <li>yyyy-mm-dd</li>
                                <li>Ej. 1992-06-03</li>
                            </ul>
                        </td>
                        <td>
                            <ul>
                                <li>Casado</li>
                                <li>Soltero</li>
                                <li>Divorciado</li>
                                <li>Viudo</li>
                            </ul>
                        </td>
                        <td>Orizaba</td>
                        <td>Veracruz</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div>
            <v-form @submit.prevent="uploadFile">
                <v-file-input v-model="file" label="Seleccionar archivo Excel" accept=".xlsx, .xls"
                    prepend-icon="mdi-file-excel" clearable></v-file-input>

                <v-btn type="submit" color="primary" :disabled="!file" class="mt-4">
                    <v-icon left>mdi-cloud-upload</v-icon>
                    Subir alumnos
                </v-btn>
            </v-form>

            <!-- Mensajes de estado -->
            <v-alert v-if="uploadStatus" type="warning" class="mt-4">
                {{ uploadStatus }}
            </v-alert>

            <!-- Lista de errores -->
            <v-list v-if="errors.length" class="mt-4">
                <v-list-subheader>Errores durante la carga:</v-list-subheader>
                <v-list-item v-for="(error, index) in errors" :key="index">
                    <v-list-item-title>{{ error }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </div>

        <v-snackbar v-model="snackbar" :timeout="timeout" variant="tonal">
            {{ text }}

            <template v-slot:actions>
                <v-btn color="blue" variant="text" @click="snackbar = false" icon="mdi-close"></v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const snackbar = ref(false)
const text = ref()
const timeout = ref(2500)

const file = ref(null);
const uploadStatus = ref('');
const errors = ref([]);

const uploadFile = async () => {
    if (!file.value) return;

    const formData = new FormData();
    formData.append('excel', file.value);

    try {
        const response = await fetch(import.meta.env.VITE_ENDPOINT + 'users.php?action=cargaMasiva', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.status === 'ok') {
            uploadStatus.value = `Carga completada: ${data.success} registros exitosos. Errores: ${data.errors.length}`;
            errors.value = data.errors;
        } else {
            uploadStatus.value = 'Error: ' + data.message;
        }
    } catch (error) {
        uploadStatus.value = 'Error de conexión: ' + error.message;
        errors.value = [error.message];
    }
};
</script>

<style lang="scss" scoped>
.usuarios {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    footer {
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

    .tabla-wrap {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .header {
            display: flex;
            gap: 1rem;
            color: white;
        }

        table {
            border-spacing: 0;
            box-sizing: border-box;

            td,
            th {
                border: 2px solid white;
                padding: 0.5rem;
                padding-inline: 1rem;
                box-sizing: border-box;
            }

            th {
                border-bottom: 0;
                border-right: 0;
            }

            th:last-child {
                border-right: 2px solid white;
                border-top-right-radius: 6px;
            }

            th:first-child {
                border-top-left-radius: 6px;
            }

            td {
                border-right: 0;

                ul {
                    margin: 0;
                    padding-left: 1rem;
                    list-style-position: inside;
                }
            }

            td:first-child {
                border-bottom-left-radius: 6px;
            }

            td:last-child {
                border-right: 2px solid white;
                border-bottom-right-radius: 6px;
            }
        }
    }
}
</style>
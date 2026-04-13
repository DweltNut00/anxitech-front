<template>
    <v-card title="Recomendaciones" subtitle="De acuerdo a tus resultados, recomendamos lo siguiente:">
        <v-card-text>
            <v-progress-circular color="primary" indeterminate v-if="loading"></v-progress-circular>
            <div class="recomendaciones" v-else>
                <div>
                    <h2>Nivel de ansiedad: {{ resultado.resultado }}</h2>
                    <p>Te consejamos:</p>
                </div>
                <div v-for="(item, index) in resultado.descripcion.recomendaciones" :key="index">
                    <h4>{{ item.titulo }}</h4>
                    <p>{{ item.texto }}</p>
                </div>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps(['suma'])

const resultado = ref(null); // Inicializar como null
const loading = ref(true);

const getRecomendaciones = async () => {
    try {
        const dataJson = await (await fetch(import.meta.env.VITE_ENDPOINT + 'recommendations.php?action=getRecomendacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                resultado: props.suma
            })
        })).json()

        console.log('Respuesta del servidor:', dataJson); // DEBUG

        // VALIDACIÓN: Verificar que hay datos
        if (dataJson.status === 'ok' && dataJson.data && dataJson.data.length > 0) {
            resultado.value = dataJson.data[0];
        } else {
            console.error('No se encontraron recomendaciones');
            resultado.value = null;
        }
        
    } catch (error) {
        console.error('Error al obtener recomendaciones:', error);
        resultado.value = null;
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    console.log('Suma recibida:', props.suma); // DEBUG
    getRecomendaciones();
})
</script>

<style lang="scss" scoped>
.recomendaciones {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>
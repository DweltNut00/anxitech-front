<template>
    <v-card title="Recomendaciones" subtitle="De acuerdo a tus resultados, recomendamos lo siguiente:">
        <v-card-text>
            <v-progress-circular color="primary" indeterminate v-if="loading"></v-progress-circular>
            <div class="recomendaciones" v-else-if="resultado">
                <v-alert type="info" variant="tonal" class="mb-2">
                    <strong>Nivel de ansiedad: {{ resultado.resultado }}</strong>
                </v-alert>
                <p>Te aconsejamos:</p>
                <div v-for="(item, index) in resultado.descripcion.recomendaciones" :key="index">
                    <h4>{{ item.titulo }}</h4>
                    <p>{{ item.texto }}</p>
                </div>
            </div>
            <v-alert v-else type="warning" variant="tonal">
                No se encontraron recomendaciones para tu resultado.
            </v-alert>
        </v-card-text>

        <v-card-actions v-if="!loading">
            <v-spacer></v-spacer>
            <v-btn 
                color="primary" 
                variant="flat" 
                prepend-icon="mdi-check"
                @click="emit('continuar')"
            >
                Entendido, continuar
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps(['suma'])
const emit = defineEmits(['continuar'])

const resultado = ref(null);
const loading = ref(true);

const getRecomendaciones = async () => {
    try {
        const dataJson = await (await fetch(
            import.meta.env.VITE_ENDPOINT + 'recommendations.php?action=getRecomendacion',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resultado: props.suma })
            }
        )).json()

        if (dataJson.status === 'ok' && dataJson.data && dataJson.data.length > 0) {
            resultado.value = dataJson.data[0];
        } else {
            resultado.value = null;
        }
    } catch (error) {
        resultado.value = null;
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
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
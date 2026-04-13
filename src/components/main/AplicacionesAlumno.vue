<template>
    <div class="aplicaciones-container">
        <!-- Header con estadísticas rápidas -->
       

        <!-- Grid de secciones lado a lado -->
        <div class="sections-grid">
            <!-- Sección de encuestas DASS-21 -->
            <section class="encuestas-section">
                <div class="section-header">
                    <div class="section-title">
                        <v-icon color="primary" size="28">mdi-clipboard-text</v-icon>
                        <h2>Evaluaciones DASS-21</h2>
                    </div>
                    <p class="section-description">
                        Instrumentos validados para evaluar niveles de ansiedad
                    </p>
                </div>

                <!-- Loading state -->
                <div v-if="loading" class="loading-container">
                    <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
                    <p class="loading-text">Cargando aplicaciones...</p>
                </div>

                <!-- Estado vacío -->
                <v-card v-else-if="aplicaciones.length === 0" class="empty-state" elevation="0">
                    <v-icon color="grey-lighten-1" size="80">mdi-calendar-clock</v-icon>
                    <h3>No hay evaluaciones disponibles</h3>
                    <p>Por el momento no hay encuestas activas. Te notificaremos cuando haya nuevas aplicaciones.</p>
                </v-card>

                <!-- Cards de aplicaciones -->
                <div v-else class="aplicaciones-list">
                    <v-card 
                        v-for="item in aplicaciones" 
                        :key="item.id"
                        class="aplicacion-card"
                        elevation="2"
                        @click="empezarAplicacion(item.id)"
                    >
                        <!-- Badge de estado -->
                        <div class="status-badge active">
                            <v-icon size="14">mdi-circle</v-icon>
                            Activa
                        </div>

                        <!-- Contenido principal -->
                        <div class="card-header">
                            <div class="icon-wrapper primary-gradient">
                                <v-icon color="white" size="40">mdi-file-document-edit</v-icon>
                            </div>
                            <h3 class="card-title">Encuesta DASS-21</h3>
                            <p class="card-subtitle">Evaluación de ansiedad</p>
                        </div>

                        <div class="card-body">
                            <div class="info-row dates-row">
                                <div class="date-compact">
                                    <v-icon size="16" color="success">mdi-calendar-start</v-icon>
                                    <span class="date-text">{{ formatDateShort(item.inicio) }}</span>
                                </div>
                                <div class="date-separator">→</div>
                                <div class="date-compact">
                                    <v-icon size="16" color="error">mdi-calendar-end</v-icon>
                                    <span class="date-text">{{ formatDateShort(item.fin) }}</span>
                                </div>
                            </div>
                            <div class="info-row">
                                <v-icon size="18" color="info">mdi-clock-outline</v-icon>
                                <span class="info-label">Duración:</span>
                                <span class="info-value">~10 minutos</span>
                            </div>
                        </div>

                        <v-divider class="my-3"></v-divider>

                        <!-- Botón de acción -->
                        <v-btn 
                            block 
                            color="primary" 
                            size="large"
                            prepend-icon="mdi-play-circle"
                            variant="flat"
                            class="start-btn"
                        >
                            Comenzar evaluación
                        </v-btn>
                    </v-card>
                </div>
            </section>

            <!-- Sección de información complementaria -->
            <section class="encuestas-section">
                <div class="section-header">
                    <div class="section-title">
                        <v-icon color="secondary" size="28">mdi-account-details</v-icon>
                        <h2>Información Complementaria</h2>
                    </div>
                    <p class="section-description">
                        Datos académicos y sociodemográficos para análisis contextual
                    </p>
                </div>

                <!-- Loading state -->
                <div v-if="loadingExtra" class="loading-container">
                    <v-progress-circular color="secondary" indeterminate size="64"></v-progress-circular>
                    <p class="loading-text">Cargando información...</p>
                </div>

                <!-- Estado vacío -->
                <v-card v-else-if="aplicacionesExtra.length === 0" class="empty-state" elevation="0">
                    <v-icon color="grey-lighten-1" size="80">mdi-information-outline</v-icon>
                    <h3>No hay formularios disponibles</h3>
                    <p>Completa primero una evaluación DASS-21 para acceder a esta sección.</p>
                </v-card>

                <!-- Cards de aplicaciones extra -->
                <div v-else class="aplicaciones-list">
                    <v-card 
                        v-for="item in aplicacionesExtra" 
                        :key="item.id"
                        class="aplicacion-card complementaria"
                        elevation="2"
                        @click="empezarAplicacionExtra(item.id)"
                    >
                        <!-- Badge de estado -->
                        <div class="status-badge active-secondary">
                            <v-icon size="14">mdi-circle</v-icon>
                            Disponible
                        </div>

                        <!-- Contenido principal -->
                        <div class="card-header">
                            <div class="icon-wrapper secondary-gradient">
                                <v-icon color="white" size="40">mdi-form-select</v-icon>
                            </div>
                            <h3 class="card-title">Datos Complementarios</h3>
                            <p class="card-subtitle">Información contextual</p>
                        </div>

                        <div class="card-body">
                            <div class="info-row dates-row">
                                <div class="date-compact">
                                    <v-icon size="16" color="success">mdi-calendar-start</v-icon>
                                    <span class="date-text">{{ formatDateShort(item.inicio) }}</span>
                                </div>
                                <div class="date-separator">→</div>
                                <div class="date-compact">
                                    <v-icon size="16" color="error">mdi-calendar-end</v-icon>
                                    <span class="date-text">{{ formatDateShort(item.fin) }}</span>
                                </div>
                            </div>
                            <div class="info-row">
                                <v-icon size="18" color="info">mdi-clock-outline</v-icon>
                                <span class="info-label">Duración:</span>
                                <span class="info-value">~5 minutos</span>
                            </div>
                        </div>

                        <v-divider class="my-3"></v-divider>

                        <!-- Botón de acción -->
                        <v-btn 
                            block 
                            color="secondary" 
                            size="large"
                            prepend-icon="mdi-checkbox-marked-circle"
                            variant="flat"
                            class="start-btn"
                        >
                            Completar formulario
                        </v-btn>
                    </v-card>
                </div>
            </section>
        </div>

        <!-- Información adicional -->
        <v-card class="info-footer" elevation="0" color="blue-grey-lighten-5">
            <v-icon color="info" size="24">mdi-information</v-icon>
            <div>
                <strong>Confidencialidad garantizada:</strong> Toda la información proporcionada es anónima y será utilizada únicamente con fines de investigación académica.
            </div>
        </v-card>

        <!-- Snackbar para notificaciones -->
        <v-snackbar v-model="snackbar" :timeout="timeout" variant="tonal" color="primary">
            {{ text }}
            <template v-slot:actions>
                <v-btn color="white" variant="text" @click="snackbar = false" icon="mdi-close"></v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuarioStore } from '@/stores/usuario';

const router = useRouter();
const usuarioStore = useUsuarioStore();

const snackbar = ref(false);
const text = ref('');
const timeout = ref(2500);

const aplicaciones = ref([]);
const loading = ref(true);

const aplicacionesExtra = ref([]);
const loadingExtra = ref(true);

// Función para formatear fechas
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
};

// Función para formatear fechas en formato corto
const formatDateShort = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
};

const getAplicaciones = async () => {
    loading.value = true;
    try {
        let dataJson = await (await fetch(import.meta.env.VITE_ENDPOINT + 'questions.php?action=getAplicaciones')).json();
        let todasAplicaciones = dataJson.data;
        
        dataJson = await (await fetch(import.meta.env.VITE_ENDPOINT + 'questions.php?action=getMisAplicaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_alumno: usuarioStore.getId()
            })
        })).json();
        
        aplicaciones.value = todasAplicaciones.filter(item =>
            !dataJson.data.some(item2 => item.id === item2.id)
        );
    } catch (error) {
        text.value = 'Error al cargar las aplicaciones';
        snackbar.value = true;
    } finally {
        loading.value = false;
    }
};

const getAplicacionesExtra = async () => {
    loadingExtra.value = true;
    try {
        let dataJson = await (await fetch(import.meta.env.VITE_ENDPOINT + 'questions.php?action=getAplicacionesExtra')).json();
        let todasAplicaciones = dataJson.data;

        dataJson = await (await fetch(import.meta.env.VITE_ENDPOINT + 'questions.php?action=getMisAplicacionesExtra', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_alumno: usuarioStore.getId()
            })
        })).json();

        aplicacionesExtra.value = todasAplicaciones.filter(item =>
            !dataJson.data.some(item2 => item.id === item2.id)
        );
    } catch (error) {
        text.value = 'Error al cargar la información complementaria';
        snackbar.value = true;
    } finally {
        loadingExtra.value = false;
    }
};

const empezarAplicacion = async (id_aplicacion) => {
    usuarioStore.setIdAplicacion(id_aplicacion);
    router.push({ name: 'panel-encuesta' });
};

const empezarAplicacionExtra = async (id_aplicacion) => {
    usuarioStore.setIdAplicacion(id_aplicacion);
    router.push({ name: 'panel-encuesta-extra' });
};

// Cargar datos al montar el componente
getAplicaciones();
getAplicacionesExtra();
</script>

<style lang="scss" scoped>
.aplicaciones-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
}

/* Header con estadísticas */
.stats-header {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1rem;
}

.stat-card {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    border-radius: 16px;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }
}

.stat-icon {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.stat-content {
    flex: 1;
}

.stat-value {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
    color: #1a1a1a;
    margin-bottom: 0.25rem;
}

.stat-label {
    font-size: 0.875rem;
    color: #666;
    font-weight: 500;
}

/* Secciones */
.sections-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
}

.encuestas-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.section-header {
    .section-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.5rem;

        h2 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0;
        }
    }

    .section-description {
        color: #666;
        font-size: 0.9rem;
        margin: 0;
        padding-left: 2.5rem;
        line-height: 1.4;
    }
}

/* Lista de aplicaciones (vertical dentro de cada sección) */
.aplicaciones-list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

/* Card de aplicación */
.aplicacion-card {
    position: relative;
    padding: 1.75rem;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid transparent;
    background: white;

    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
        border-color: rgb(var(--v-theme-primary));

        .start-btn {
            background: #667eea;
        }
    }

    &.complementaria:hover {
        border-color: rgb(var(--v-theme-secondary));

        .start-btn {
            background: #f093fb;
        }
    }
}

.status-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.375rem 0.875rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    
    &.active {
        background: rgba(76, 175, 80, 0.1);
        color: #2e7d32;
    }

    &.active-secondary {
        background: rgba(233, 30, 99, 0.1);
        color: #c2185b;
    }
}

.card-header {
    text-align: center;
    margin-bottom: 1.5rem;
}

.icon-wrapper {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    
    &.primary-gradient {
        background: #667eea;
    }

    &.secondary-gradient {
        background: #e96593;
    }
}

.card-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 0.25rem;
}

.card-subtitle {
    font-size: 0.875rem;
    color: #666;
    margin: 0;
}

.card-body {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
}

.dates-row {
    background: #f8f9fa;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}

.date-compact {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
}

.date-text {
    font-size: 0.875rem;
    color: #1a1a1a;
    font-weight: 600;
}

.date-separator {
    color: #999;
    font-size: 1rem;
    font-weight: 300;
    padding: 0 0.25rem;
}

.info-row {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-size: 0.875rem;

    .info-label {
        color: #666;
        font-weight: 500;
    }

    .info-value {
        color: #1a1a1a;
        font-weight: 600;
        margin-left: auto;
    }
}

.start-btn {
    font-weight: 600;
    letter-spacing: 0.025em;
    text-transform: none;
    transition: all 0.3s ease;
}

/* Estados de carga y vacío */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    gap: 1.5rem;
}

.loading-text {
    color: #666;
    font-size: 1rem;
    margin: 0;
}

.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    border-radius: 16px;
    background: #fafafa;
    border: 2px dashed #ddd;

    h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #666;
        margin: 1rem 0 0.5rem;
    }

    p {
        color: #999;
        font-size: 0.95rem;
        max-width: 400px;
        margin: 0 auto;
    }
}

/* Footer informativo */
.info-footer {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    border-radius: 12px;
    font-size: 0.875rem;
    line-height: 1.6;
    color: #455a64;
    border-left: 4px solid rgb(var(--v-theme-info));
}

/* Responsive */
@media (max-width: 960px) {
    .aplicaciones-container {
        padding: 1.5rem 1rem;
        gap: 2rem;
    }

    .sections-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
    }

    .stats-header {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 600px) {
    .section-header {
        .section-title h2 {
            font-size: 1.5rem;
        }

        .section-description {
            font-size: 0.875rem;
            padding-left: 2rem;
        }
    }

    .aplicacion-card {
        padding: 1.5rem;
    }

    .card-title {
        font-size: 1.125rem;
    }

    .dates-row {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
    }

    .date-separator {
        display: none;
    }

    .date-compact {
        width: 100%;
    }
}
</style>
<template>
  <div class="inicio">
    <!-- Saludo inicial -->
    <v-card class="my-4" subtitle="Nos da gusto volver a verte">
      <template v-slot:title>
        <span class="font-weight-black">¡Hola!</span>
      </template>

      <template v-slot:prepend>
        <v-avatar color="blue-darken-2">
          <v-icon icon="mdi-hand-wave"></v-icon>
        </v-avatar>
      </template>
    </v-card>

    <!-- Mensaje de error si falla la API -->
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      closable
      @click:close="error = null"
      class="mb-4"
    >
      <v-alert-title>Error al cargar datos</v-alert-title>
      {{ error }}
      <br /><br />
      <strong>Solución:</strong> Verifica que la API esté corriendo en
      <code>https://anxitech-model.onrender.com</code>
      <br />
      <v-btn
        size="small"
        color="error"
        variant="outlined"
        @click="cargarDashboard"
        class="mt-2"
      >
        <v-icon start>mdi-refresh</v-icon>
        Reintentar
      </v-btn>
    </v-alert>

    <!-- Indicador de carga -->
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="blue-darken-2"
      class="mb-4"
    ></v-progress-linear>

    <!-- Dashboard solo para Admin -->
    <div v-if="usuarioStore.getTipo() === 'Admin'" class="dashboard">
      <!-- Tarjetas de estadísticas -->
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-card color="blue-darken-1" dark>
            <v-card-text>
              <div class="text-h6">Total Estudiantes</div>
              <div class="text-h3 font-weight-bold">
                {{ estadisticas.total_alumnos || 0 }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card color="green-darken-1" dark>
            <v-card-text>
              <div class="text-h6">Nivel Bajo</div>
              <div class="text-h3 font-weight-bold">
                {{ estadisticas.distribucion?.Bajo || 0 }}
              </div>
              <div class="text-caption">
                {{ estadisticas.porcentajes?.Bajo || 0 }}%
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card color="orange-darken-1" dark>
            <v-card-text>
              <div class="text-h6">Nivel Medio</div>
              <div class="text-h3 font-weight-bold">
                {{ estadisticas.distribucion?.Medio || 0 }}
              </div>
              <div class="text-caption">
                {{ estadisticas.porcentajes?.Medio || 0 }}%
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card color="red-darken-1" dark>
            <v-card-text>
              <div class="text-h6">Nivel Alto</div>
              <div class="text-h3 font-weight-bold">
                {{ estadisticas.distribucion?.Alto || 0 }}
              </div>
              <div class="text-caption">
                {{ estadisticas.porcentajes?.Alto || 0 }}%
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Gráficas -->
      <v-row class="mt-4">
        <!-- Gráfica de barras -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              <v-icon color="blue" class="mr-2">mdi-chart-bar</v-icon>
              Distribución de Niveles de Ansiedad
            </v-card-title>
            <v-card-text>
              <div v-if="nivelesAnsiedad.length > 0" class="grafica-barras">
                <div
                  v-for="(nivel, index) in nivelesAnsiedad"
                  :key="index"
                  class="barra-container"
                >
                  <div class="barra-label">{{ nivel.nombre }}</div>
                  <div class="barra-wrapper">
                    <div
                      class="barra"
                      :style="{
                        width: (nivel.cantidad / maxCantidad) * 100 + '%',
                        backgroundColor: nivel.color,
                      }"
                    >
                      <span class="barra-valor"
                        >{{ nivel.cantidad }} ({{ nivel.porcentaje }}%)</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <v-alert v-else type="info" variant="tonal">
                No hay datos disponibles
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Análisis por Carrera -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              <v-icon color="blue" class="mr-2">mdi-school</v-icon>
              Análisis por Carrera
            </v-card-title>
            <v-card-text>
              <div
                v-if="
                  analisisCarreras.carreras &&
                  analisisCarreras.carreras.length > 0
                "
                class="carreras-list"
              >
                <div
                  v-for="(carrera, index) in analisisCarreras.carreras"
                  :key="index"
                  class="carrera-item mb-3"
                >
                  <div class="d-flex justify-space-between align-center mb-1">
                    <div>
                      <strong>{{ carrera.nombre }}</strong>
                      <v-chip
                        size="x-small"
                        :color="
                          carrera.nivel_riesgo === 'Alto'
                            ? 'red'
                            : carrera.nivel_riesgo === 'Medio'
                              ? 'orange'
                              : 'green'
                        "
                        class="ml-2"
                      >
                        {{ carrera.nivel_riesgo }}
                      </v-chip>
                    </div>
                    <span class="text-caption"
                      >{{ carrera.total_alumnos }} alumnos</span
                    >
                  </div>
                  <v-progress-linear
                    :model-value="carrera.porcentajes?.Alto || 0"
                    :color="carrera.nivel_riesgo === 'Alto' ? 'red' : 'orange'"
                    height="8"
                    rounded
                  >
                    <template v-slot:default>
                      <small>{{ carrera.porcentajes?.Alto || 0 }}% Alto</small>
                    </template>
                  </v-progress-linear>
                </div>
              </div>
              <v-alert v-else type="info" variant="tonal">
                No hay datos de carreras disponibles
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Análisis de Factores de Riesgo -->
      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              <v-icon color="red" class="mr-2">mdi-alert-circle</v-icon>
              Top 5 Factores de Riesgo Identificados
            </v-card-title>
            <v-card-text>
              <div v-if="factoresRiesgo.length > 0" class="factores-riesgo">
                <div
                  v-for="(factor, index) in factoresRiesgo"
                  :key="index"
                  class="factor-item"
                >
                  <div class="factor-header">
                    <div class="factor-info">
                      <v-chip
                        :color="
                          index === 0
                            ? 'red'
                            : index === 1
                              ? 'orange'
                              : 'yellow-darken-2'
                        "
                        size="small"
                        class="mr-2"
                      >
                        #{{ factor.rank }}
                      </v-chip>
                      <span class="factor-nombre">{{ factor.nombre }}</span>
                    </div>
                    <v-chip color="red" size="small" dark>
                      {{ factor.porcentaje_impacto }}%
                    </v-chip>
                  </div>
                  <v-progress-linear
                    :model-value="factor.porcentaje_impacto"
                    color="red"
                    height="8"
                    rounded
                    class="mt-2"
                  ></v-progress-linear>
                </div>
              </div>
              <v-alert v-else type="info" variant="tonal">
                Modelo no cargado. Los factores se mostrarán cuando el modelo
                esté disponible.
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              <v-icon color="orange" class="mr-2">mdi-alert</v-icon>
              Alertas del Sistema
            </v-card-title>
            <v-card-text>
              <v-alert type="error" variant="tonal" class="mb-3">
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <strong
                      >{{
                        alertas.alumnos_riesgo_alto || 0
                      }}
                      estudiantes</strong
                    >
                    en riesgo alto
                  </div>
                  <v-chip color="red" dark
                    >{{ alertas.porcentaje_riesgo_alto || 0 }}%</v-chip
                  >
                </div>
              </v-alert>

              <v-alert type="warning" variant="tonal" class="mb-3">
                <div>
                  <strong>Carrera crítica:</strong>
                  {{ alertas.carrera_mayor_riesgo?.nombre || "N/A" }}
                  <v-chip size="small" color="orange" class="ml-2">
                    {{ alertas.carrera_mayor_riesgo?.porcentaje || 0 }}% riesgo
                    alto
                  </v-chip>
                </div>
              </v-alert>

              <v-alert type="info" variant="tonal">
                <div>
                  <strong>Factor principal:</strong><br />
                  {{ alertas.factor_principal || "Analizando..." }}
                </div>
              </v-alert>

              <!-- DEBUG: Mostrar datos crudos si es necesario -->
              <v-expansion-panels v-if="showDebug" class="mt-3">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <v-icon start>mdi-bug</v-icon>
                    Ver datos de API (Debug)
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <pre
                      style="font-size: 11px; max-height: 200px; overflow: auto"
                      >{{ alertas }}</pre
                    >
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-icon color="purple" class="mr-2">mdi-heat-wave</v-icon>
              Mapa de Calor: Factores vs Nivel de Ansiedad
            </v-card-title>
            <v-card-text>
              <div v-if="correlaciones.length > 0" class="heatmap-container">
                <!-- Encabezado -->
                <div class="heatmap-header">
                  <div class="header-cell factor-label">Factor</div>
                  <div class="header-cell">Bajo</div>
                  <div class="header-cell">Medio</div>
                  <div class="header-cell">Alto</div>
                  <div class="header-cell">Impacto</div>
                </div>

                <!-- Filas de datos -->
                <div
                  v-for="(item, index) in correlaciones"
                  :key="index"
                  class="heatmap-row"
                >
                  <div class="cell factor-name">
                    <v-chip
                      size="small"
                      :color="index < 3 ? 'red' : 'grey'"
                      variant="flat"
                    >
                      #{{ index + 1 }}
                    </v-chip>
                    <span class="ml-2">{{ item.factor }}</span>
                  </div>

                  <!-- Celda Bajo -->
                  <div
                    class="cell heatmap-cell"
                    :style="getCellStyle(item.bajo)"
                  >
                    <span class="cell-value">{{ item.bajo }}%</span>
                  </div>

                  <!-- Celda Medio -->
                  <div
                    class="cell heatmap-cell"
                    :style="getCellStyle(item.medio)"
                  >
                    <span class="cell-value">{{ item.medio }}%</span>
                  </div>

                  <!-- Celda Alto -->
                  <div
                    class="cell heatmap-cell"
                    :style="getCellStyle(item.alto)"
                  >
                    <span class="cell-value">{{ item.alto }}%</span>
                  </div>

                  <!-- Celda Impacto -->
                  <div class="cell impact-cell">
                    <v-progress-linear
                      :model-value="item.impacto"
                      :color="getImpactColor(item.alto)"
                      height="25"
                      rounded
                    >
                      <strong>{{ item.impacto }}%</strong>
                    </v-progress-linear>
                  </div>
                </div>

                <!-- Leyenda -->
                <div class="legend mt-4">
                  <div class="legend-title">
                    <strong>Leyenda de intensidad:</strong>
                  </div>
                  <div class="legend-items">
                    <div class="legend-item">
                      <div class="legend-box" style="background: #e8f5e9"></div>
                      <span>0-30% (Bajo)</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-box" style="background: #fff9c4"></div>
                      <span>31-50% (Medio-Bajo)</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-box" style="background: #ffe0b2"></div>
                      <span>51-70% (Medio-Alto)</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-box" style="background: #ffcdd2"></div>
                      <span>71-100% (Alto)</span>
                    </div>
                  </div>
                </div>

                <!-- Insights -->
                <v-alert type="info" variant="tonal" class="mt-4">
                  <strong>💡 Interpretación:</strong>
                  <ul class="mt-2">
                    <li>
                      Colores más <strong>oscuros</strong> = mayor concentración
                      de estudiantes
                    </li>
                    <li>
                      Celdas <strong>rojas</strong> en "Alto" = factores de
                      riesgo críticos
                    </li>
                    <li>
                      Factores en <strong>top 3</strong> requieren intervención
                      prioritaria
                    </li>
                  </ul>
                </v-alert>
              </div>
              <v-alert v-else type="info" variant="tonal">
                Cargando correlaciones...
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card elevation="3">
          <v-card-title class="d-flex align-center">
            <v-icon color="error" class="mr-2">mdi-grid</v-icon>
            Matriz de Riesgo: Prevalencia vs Severidad
          </v-card-title>

          <v-card-subtitle class="text-caption">
            Identifica factores críticos que requieren intervención prioritaria
          </v-card-subtitle>

          <v-card-text>
            <!-- Indicador de carga -->
            <div v-if="cargando" class="text-center py-10">
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
              ></v-progress-circular>
              <p class="mt-4 text-grey">Cargando matriz de riesgo...</p>
            </div>

            <div v-else-if="factores.length > 0">
              <!-- Alertas de cuadrantes -->
              <v-row class="mb-4">
                <v-col cols="12" md="6">
                  <v-alert
                    type="error"
                    variant="tonal"
                    density="compact"
                    v-if="factoresCriticos.length > 0"
                  >
                    <strong>🚨 Factores Críticos:</strong>
                    {{ factoresCriticos.map((f) => f.nombre).join(", ") }}
                    <br />
                    <small
                      >Alta prevalencia + Alta severidad = Requieren
                      intervención inmediata</small
                    >
                  </v-alert>
                  <v-alert
                    type="success"
                    variant="tonal"
                    density="compact"
                    v-else
                  >
                    <strong>✅ Sin factores en zona crítica</strong>
                    <br />
                    <small
                      >Ningún factor combina alta prevalencia con alta
                      severidad</small
                    >
                  </v-alert>
                </v-col>

                <v-col cols="12" md="6">
                  <v-alert
                    type="warning"
                    variant="tonal"
                    density="compact"
                    v-if="factoresPreocupantes.length > 0"
                  >
                    <strong>⚠️ Factores Preocupantes:</strong>
                    {{ factoresPreocupantes.map((f) => f.nombre).join(", ") }}
                    <br />
                    <small
                      >Alta severidad pero baja prevalencia - Monitoreo
                      cercano</small
                    >
                  </v-alert>
                </v-col>
              </v-row>

              <!-- Gráfica de Dispersión -->
              <div class="matriz-container">
                <svg
                  :width="graficaWidth"
                  :height="graficaHeight"
                  class="matriz-riesgo"
                >
                  <!-- Fondo de cuadrantes -->
                  <defs>
                    <pattern
                      id="grid"
                      width="50"
                      height="50"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 50 0 L 0 0 0 50"
                        fill="none"
                        stroke="#e0e0e0"
                        stroke-width="1"
                      />
                    </pattern>
                  </defs>

                  <!-- Zonas de riesgo coloreadas -->
                  <!-- Zona CRÍTICA (superior derecha) -->
                  <rect
                    :x="
                      paddingLeft +
                      (graficaWidth - paddingLeft - paddingRight) / 2
                    "
                    :y="paddingTop"
                    :width="(graficaWidth - paddingLeft - paddingRight) / 2"
                    :height="(graficaHeight - paddingTop - paddingBottom) / 2"
                    fill="rgba(244, 67, 54, 0.1)"
                  />

                  <!-- Zona PREOCUPANTE (superior izquierda) -->
                  <rect
                    :x="paddingLeft"
                    :y="paddingTop"
                    :width="(graficaWidth - paddingLeft - paddingRight) / 2"
                    :height="(graficaHeight - paddingTop - paddingBottom) / 2"
                    fill="rgba(255, 152, 0, 0.08)"
                  />

                  <!-- Zona ATENCIÓN (inferior derecha) -->
                  <rect
                    :x="
                      paddingLeft +
                      (graficaWidth - paddingLeft - paddingRight) / 2
                    "
                    :y="
                      paddingTop +
                      (graficaHeight - paddingTop - paddingBottom) / 2
                    "
                    :width="(graficaWidth - paddingLeft - paddingRight) / 2"
                    :height="(graficaHeight - paddingTop - paddingBottom) / 2"
                    fill="rgba(255, 193, 7, 0.08)"
                  />

                  <!-- Zona BAJO RIESGO (inferior izquierda) -->
                  <rect
                    :x="paddingLeft"
                    :y="
                      paddingTop +
                      (graficaHeight - paddingTop - paddingBottom) / 2
                    "
                    :width="(graficaWidth - paddingLeft - paddingRight) / 2"
                    :height="(graficaHeight - paddingTop - paddingBottom) / 2"
                    fill="rgba(76, 175, 80, 0.08)"
                  />

                  <!-- Grid de fondo -->
                  <rect
                    :x="paddingLeft"
                    :y="paddingTop"
                    :width="graficaWidth - paddingLeft - paddingRight"
                    :height="graficaHeight - paddingTop - paddingBottom"
                    fill="url(#grid)"
                  />

                  <!-- Ejes principales -->
                  <line
                    :x1="paddingLeft"
                    :y1="paddingTop"
                    :x2="paddingLeft"
                    :y2="graficaHeight - paddingBottom"
                    stroke="#333"
                    stroke-width="2"
                  />
                  <line
                    :x1="paddingLeft"
                    :y1="graficaHeight - paddingBottom"
                    :x2="graficaWidth - paddingRight"
                    :y2="graficaHeight - paddingBottom"
                    stroke="#333"
                    stroke-width="2"
                  />

                  <!-- Líneas divisorias de cuadrantes -->
                  <line
                    :x1="
                      paddingLeft +
                      (graficaWidth - paddingLeft - paddingRight) / 2
                    "
                    :y1="paddingTop"
                    :x2="
                      paddingLeft +
                      (graficaWidth - paddingLeft - paddingRight) / 2
                    "
                    :y2="graficaHeight - paddingBottom"
                    stroke="#999"
                    stroke-width="2"
                    stroke-dasharray="8,4"
                  />
                  <line
                    :x1="paddingLeft"
                    :y1="
                      paddingTop +
                      (graficaHeight - paddingTop - paddingBottom) / 2
                    "
                    :x2="graficaWidth - paddingRight"
                    :y2="
                      paddingTop +
                      (graficaHeight - paddingTop - paddingBottom) / 2
                    "
                    stroke="#999"
                    stroke-width="2"
                    stroke-dasharray="8,4"
                  />

                  <!-- Labels del eje X (Prevalencia - Estudiantes) -->
                  <text
                    :x="(paddingLeft + graficaWidth - paddingRight) / 2"
                    :y="graficaHeight - 10"
                    text-anchor="middle"
                    font-size="14"
                    font-weight="bold"
                    fill="#333"
                  >
                    Prevalencia (Número de Estudiantes Afectados)
                  </text>

                  <!-- Labels del eje Y (Severidad - %) -->
                  <text
                    :x="20"
                    :y="(paddingTop + graficaHeight - paddingBottom) / 2"
                    text-anchor="middle"
                    font-size="14"
                    font-weight="bold"
                    fill="#333"
                    transform="rotate(-90, 20, 250)"
                  >
                    Severidad (% con Ansiedad Alta)
                  </text>

                  <!-- Marcas del eje X -->
                  <g v-for="tick in ticksX" :key="'x-' + tick">
                    <text
                      :x="getXPosition(tick)"
                      :y="graficaHeight - paddingBottom + 20"
                      text-anchor="middle"
                      font-size="11"
                      fill="#666"
                    >
                      {{ tick }}
                    </text>
                    <line
                      :x1="getXPosition(tick)"
                      :y1="graficaHeight - paddingBottom"
                      :x2="getXPosition(tick)"
                      :y2="graficaHeight - paddingBottom + 5"
                      stroke="#666"
                      stroke-width="1"
                    />
                  </g>

                  <!-- Marcas del eje Y -->
                  <g v-for="tick in ticksY" :key="'y-' + tick">
                    <text
                      :x="paddingLeft - 10"
                      :y="getYPosition(tick) + 4"
                      text-anchor="end"
                      font-size="11"
                      fill="#666"
                    >
                      {{ tick }}%
                    </text>
                    <line
                      :x1="paddingLeft - 5"
                      :y1="getYPosition(tick)"
                      :x2="paddingLeft"
                      :y2="getYPosition(tick)"
                      stroke="#666"
                      stroke-width="1"
                    />
                  </g>

                  <!-- Puntos de datos (factores) -->
                  <g v-for="(factor, index) in factores" :key="index">
                    <!-- Círculo del factor -->
                    <circle
                      :cx="getXPosition(factor.total_estudiantes)"
                      :cy="getYPosition(factor.alto)"
                      :r="getRadius(factor.impacto)"
                      :fill="getColor(factor)"
                      :stroke="getStrokeColor(factor)"
                      stroke-width="3"
                      opacity="0.7"
                      class="punto-factor"
                      @mouseenter="mostrarTooltip($event, factor)"
                      @mouseleave="ocultarTooltip"
                    />

                    <!-- Label del factor -->
                    <text
                      :x="
                        getXPosition(factor.total_estudiantes) +
                        getRadius(factor.impacto) +
                        8
                      "
                      :y="getYPosition(factor.alto) + 4"
                      font-size="11"
                      font-weight="600"
                      fill="#333"
                      class="label-factor"
                    >
                      {{ getNombreCorto(factor.factor) }}
                    </text>
                  </g>

                  <!-- Leyenda de cuadrantes -->
                  <g transform="translate(120, 30)">
                    <rect
                      x="0"
                      y="0"
                      width="15"
                      height="15"
                      fill="rgba(244, 67, 54, 0.3)"
                    />
                    <text x="20" y="12" font-size="11" fill="#666">
                      Crítico
                    </text>

                    <rect
                      x="100"
                      y="0"
                      width="15"
                      height="15"
                      fill="rgba(255, 152, 0, 0.3)"
                    />
                    <text x="120" y="12" font-size="11" fill="#666">
                      Preocupante
                    </text>

                    <rect
                      x="230"
                      y="0"
                      width="15"
                      height="15"
                      fill="rgba(255, 193, 7, 0.3)"
                    />
                    <text x="250" y="12" font-size="11" fill="#666">
                      Atención
                    </text>

                    <rect
                      x="330"
                      y="0"
                      width="15"
                      height="15"
                      fill="rgba(76, 175, 80, 0.3)"
                    />
                    <text x="350" y="12" font-size="11" fill="#666">
                      Bajo riesgo
                    </text>
                  </g>
                </svg>
              </div>

              <!-- Explicación de cuadrantes -->
              <v-expansion-panels class="mt-4">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <v-icon start color="info">mdi-information</v-icon>
                    <strong>¿Cómo interpretar esta matriz?</strong>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-card variant="outlined" color="error" class="pa-3">
                          <h4 class="text-error">
                            🚨 Cuadrante CRÍTICO (Superior Derecha)
                          </h4>
                          <p class="text-caption mt-2">
                            <strong>Alta prevalencia + Alta severidad</strong
                            ><br />
                            Muchos estudiantes afectados Y alto % con ansiedad
                            severa.<br />
                            <strong>Acción:</strong> Intervención institucional
                            INMEDIATA.
                          </p>
                        </v-card>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-card variant="outlined" color="warning" class="pa-3">
                          <h4 class="text-warning">
                            ⚠️ Cuadrante PREOCUPANTE (Superior Izquierda)
                          </h4>
                          <p class="text-caption mt-2">
                            <strong>Baja prevalencia + Alta severidad</strong
                            ><br />
                            Pocos estudiantes afectados PERO muy alta
                            severidad.<br />
                            <strong>Acción:</strong> Atención personalizada para
                            casos identificados.
                          </p>
                        </v-card>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-card
                          variant="outlined"
                          color="orange-lighten-1"
                          class="pa-3"
                        >
                          <h4 class="text-orange">
                            ⚡ Cuadrante ATENCIÓN (Inferior Derecha)
                          </h4>
                          <p class="text-caption mt-2">
                            <strong>Alta prevalencia + Baja severidad</strong
                            ><br />
                            Muchos estudiantes afectados pero baja severidad.<br />
                            <strong>Acción:</strong> Programas preventivos
                            masivos.
                          </p>
                        </v-card>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-card variant="outlined" color="success" class="pa-3">
                          <h4 class="text-success">
                            ✅ Cuadrante BAJO RIESGO (Inferior Izquierda)
                          </h4>
                          <p class="text-caption mt-2">
                            <strong>Baja prevalencia + Baja severidad</strong
                            ><br />
                            Pocos estudiantes afectados y baja severidad.<br />
                            <strong>Acción:</strong> Monitoreo regular.
                          </p>
                        </v-card>
                      </v-col>
                    </v-row>

                    <v-divider class="my-3"></v-divider>

                    <p class="text-caption">
                      <strong>Nota sobre el tamaño de los círculos:</strong
                      ><br />
                      El radio del círculo es proporcional al
                      <strong>impacto general</strong> del factor, que considera
                      la distribución completa (Bajo + Medio + Alto).
                    </p>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <!-- Tabla de datos -->
              <v-divider class="my-4"></v-divider>
              <v-data-table
                :headers="headersTabla"
                :items="factores"
                :items-per-page="7"
                density="compact"
                class="elevation-1"
              >
                <template v-slot:item.factor="{ item }">
                  <strong>{{ item.factor }}</strong>
                </template>

                <template v-slot:item.total_estudiantes="{ item }">
                  {{ item.total_estudiantes }}
                  <small class="text-grey"
                    >({{
                      ((item.total_estudiantes / 501) * 100).toFixed(1)
                    }}%)</small
                  >
                </template>

                <template v-slot:item.alto="{ item }">
                  <v-chip
                    size="small"
                    :color="
                      item.alto > 20
                        ? 'red'
                        : item.alto > 15
                          ? 'orange'
                          : item.alto > 10
                            ? 'yellow-darken-2'
                            : 'green'
                    "
                  >
                    {{ item.alto }}%
                  </v-chip>
                </template>

                <template v-slot:item.cuadrante="{ item }">
                  <v-chip
                    size="small"
                    :color="getCuadranteColor(item)"
                    variant="flat"
                  >
                    {{ getCuadrante(item) }}
                  </v-chip>
                </template>
              </v-data-table>
            </div>

            <v-alert v-else type="warning" variant="tonal">
              No hay datos disponibles para la matriz de riesgo
            </v-alert>

            <!-- Tooltip flotante -->
            <div
              v-if="tooltipVisible"
              class="tooltip-custom"
              :style="{ top: tooltipY + 'px', left: tooltipX + 'px' }"
            >
              <strong>{{ tooltipData.factor }}</strong
              ><br />
              Prevalencia: {{ tooltipData.total_estudiantes }} estudiantes ({{
                ((tooltipData.total_estudiantes / 501) * 100).toFixed(1)
              }}%)<br />
              Severidad: {{ tooltipData.alto }}% con ansiedad alta<br />
              Impacto: {{ tooltipData.impacto }}%<br />
              <strong>{{ getCuadrante(tooltipData) }}</strong>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    </div>
    <!-- Vista para Alumno -->
    <AplicacionesAlumno v-if="usuarioStore.getTipo() === 'Alumno'" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUsuarioStore } from "@/stores/usuario";
import AplicacionesAlumno from "@/components/main/AplicacionesAlumno.vue";
const usuarioStore = useUsuarioStore();
const cargando = ref(false);
const factores = ref([]);
const tooltipVisible = ref(false);
const tooltipData = ref({});
const tooltipX = ref(0);
const tooltipY = ref(0);

// Configuración de la gráfica
const graficaWidth = 900;
const graficaHeight = 550;
const paddingLeft = 80;
const paddingRight = 200;
const paddingTop = 60;
const paddingBottom = 80;

// Estado de carga
const loading = ref(false);
const error = ref(null);
const showDebug = ref(false); // Cambiar a true para ver datos de debug

// API URL - CAMBIA ESTO SI TU API ESTÁ EN OTRO PUERTO
const API_URL = "https://anxitech-model.onrender.com";

// Datos desde la API
const estadisticas = ref({});
const factoresRiesgo = ref([]);
const analisisCarreras = ref({ carreras: [] });
const alertas = ref({});

// Headers para la tabla de correlaciones
const headersCorrelacion = [
  { title: "Factor", key: "factor", align: "start" },
  { title: "Bajo", key: "bajo", align: "center" },
  { title: "Medio", key: "medio", align: "center" },
  { title: "Alto", key: "alto", align: "center" },
  { title: "Impacto General", key: "impacto", align: "center" },
];

const tendenciasSemestre = ref([]);
const semestreCritico = ref(null);
const porcentajeAltoCritico = ref(0);

const headersTendencias = [
  { title: "Semestre", key: "semestre", align: "start" },
  { title: "Total", key: "total", align: "center" },
  { title: "Bajo", key: "bajo", align: "center" },
  { title: "Medio", key: "medio", align: "center" },
  { title: "Alto", key: "alto", align: "center" },
];

// Datos computados para las gráficas
const nivelesAnsiedad = computed(() => {
  if (!estadisticas.value.distribucion) return [];

  return [
    {
      nombre: "Bajo",
      cantidad: estadisticas.value.distribucion.Bajo || 0,
      porcentaje: estadisticas.value.porcentajes?.Bajo || 0,
      color: "#4CAF50",
    },
    {
      nombre: "Medio",
      cantidad: estadisticas.value.distribucion.Medio || 0,
      porcentaje: estadisticas.value.porcentajes?.Medio || 0,
      color: "#FF9800",
    },
    {
      nombre: "Alto",
      cantidad: estadisticas.value.distribucion.Alto || 0,
      porcentaje: estadisticas.value.porcentajes?.Alto || 0,
      color: "#F44336",
    },
  ];
});

const maxCantidad = computed(() => {
  if (nivelesAnsiedad.value.length === 0) return 1;
  return Math.max(...nivelesAnsiedad.value.map((n) => n.cantidad));
});

// Función para cargar datos desde la API
const cargarDashboard = async () => {
  loading.value = true;
  error.value = null;

  try {
    console.log(
      "🔄 Cargando datos del dashboard desde:",
      `${API_URL}/api/stats/summary`,
    );

    const response = await fetch(`${API_URL}/api/stats/summary`);

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("✅ Datos recibidos de la API:");
    console.log("  - Estadísticas:", data.estadisticas_generales);
    console.log("  - Alertas:", data.alertas);
    console.log("  - Factores riesgo:", data.factores_riesgo?.length || 0);

    // Asignar datos
    estadisticas.value = data.estadisticas_generales || {};
    factoresRiesgo.value = data.factores_riesgo || [];
    analisisCarreras.value = data.analisis_carreras || { carreras: [] };
    alertas.value = data.alertas || {};

    // Verificar que los datos críticos estén presentes
    if (!data.estadisticas_generales) {
      console.warn("⚠️ No se recibieron estadísticas generales");
    }
    if (!data.alertas || !data.alertas.alumnos_riesgo_alto) {
      console.warn("⚠️ No se recibieron datos de alertas correctamente");
    }

    // Cargar correlaciones
    await cargarCorrelaciones();
    await cargarTendencias(); // ← AGREGAR ESTA LÍNEA

    console.log("✅ Dashboard cargado completamente");
  } catch (err) {
    console.error("❌ Error al cargar dashboard:", err);
    error.value = `${err.message}. Verifica que analytics.py esté actualizado con los umbrales correctos (SUM en lugar de AVG*7)`;
  } finally {
    loading.value = false;
  }
};

const factorMasCritico = computed(() => {
  if (factores.value.length === 0) return { factor: "N/A", alto: 0 };
  return factores.value.reduce((max, f) => (f.alto > max.alto ? f : max));
});

const insight1 = computed(() => {
  if (factores.value.length === 0) return "";

  const promedioAlto =
    factores.value.reduce((sum, f) => sum + f.alto, 0) / factores.value.length;
  return `En promedio, el ${promedioAlto.toFixed(1)}% de estudiantes con estos factores presenta ansiedad alta`;
});

const insight2 = computed(() => {
  if (factores.value.length === 0) return "";

  const factoresAltos = factores.value.filter((f) => f.alto > 15).length;

  if (factoresAltos > 0) {
    return `${factoresAltos} factor(es) superan el 15% de ansiedad alta, requiriendo intervención`;
  }
  return `Ningún factor supera el 15% de ansiedad alta, situación controlada`;
});

const insight3 = computed(() => {
  if (factores.value.length === 0) return "";

  const variacion =
    Math.max(...factores.value.map((f) => f.alto)) -
    Math.min(...factores.value.map((f) => f.alto));

  if (variacion > 10) {
    return `Alta variabilidad entre factores (${variacion.toFixed(1)}%), indicando diferentes niveles de impacto`;
  }
  return null;
});

const getLinePoints = (nivel) => {
  return factores.value
    .map((factor, index) => {
      const x = getXPosition(index);
      const y = getYPosition(factor[nivel]);
      return `${x},${y}`;
    })
    .join(" ");
};

const getColorPorcentaje = (porcentaje) => {
  if (porcentaje > 20) return "red";
  if (porcentaje > 15) return "orange";
  if (porcentaje > 10) return "yellow-darken-2";
  return "green";
};

const cargarTendencias = async () => {
  try {
    const response = await fetch(`${API_URL}/api/stats/tendencias-semestre`);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    const tendenciasArray = Object.entries(data.tendencias_por_semestre)
      .map(([semestre, datos]) => ({
        semestre: parseInt(semestre),
        ...datos,
      }))
      .sort((a, b) => a.semestre - b.semestre);

    tendenciasSemestre.value = tendenciasArray;
    semestreCritico.value = data.semestre_mas_critico;
    porcentajeAltoCritico.value = data.porcentaje_alto_critico;

    console.log("✅ Tendencias cargadas:", tendenciasArray.length, "semestres");
  } catch (err) {
    console.error("❌ Error al cargar tendencias:", err);
  }
};
const correlaciones = ref([]);
// Función para obtener color de celda según porcentaje
const getCellStyle = (porcentaje) => {
  let backgroundColor;
  let color = "#000";

  if (porcentaje <= 30) {
    backgroundColor = "#E8F5E9"; // Verde muy claro
  } else if (porcentaje <= 50) {
    backgroundColor = "#FFF9C4"; // Amarillo claro
  } else if (porcentaje <= 70) {
    backgroundColor = "#FFE0B2"; // Naranja claro
  } else {
    backgroundColor = "#FFCDD2"; // Rojo claro
    color = "#B71C1C"; // Texto rojo oscuro
  }

  return {
    backgroundColor,
    color,
    fontWeight: porcentaje > 50 ? "bold" : "normal",
  };
};
const factorActual = computed(() => {
  return factoresDisponibles.value.find(
    (f) => f.variable === factorSeleccionado.value,
  );
});

const totalAfectados = computed(() => {
  return factorActual.value?.total_estudiantes || 0;
});

const severidad = computed(() => {
  return factorActual.value?.alto || 0;
});

const severidadColor = computed(() => {
  const sev = severidad.value;
  if (sev > 20) return "red";
  if (sev > 15) return "orange";
  if (sev > 10) return "yellow-darken-2";
  return "green";
});

// ============================================
// MÉTODOS
// ============================================

const getVariableName = (factor) => {
  const mapeo = {
    "Promedio académico bajo (<70)": "promedio_anterior",
    "Carga excesiva de materias (7+)": "materias",
    "Trabaja y estudia": "trabajo",
    "Transporte público": "transporte",
    "Presión por mantener beca": "beca",
    "Semestres iniciales (1-3)": "semestre",
    "Edad joven (<21 años)": "edad",
  };
  return mapeo[factor] || "promedio_anterior";
};

const cargarEvolucion = async () => {
  cargando.value = true;

  try {
    // Aquí llamarías al endpoint de la API que te devuelva la evolución
    // Por ahora, simulamos con datos de ejemplo

    const response = await fetch(
      "https://anxitech-model.onrender.com/api/stats/correlaciones",
    );
    const data = await response.json();

    evolucionData.value = data.evolucion || [];
  } catch (err) {
    console.error("Error:", err);
    evolucionData.value = [];
  } finally {
    cargando.value = false;
  }
};

const getColorSeveridad = (porcentaje) => {
  if (porcentaje > 20) return "red";
  if (porcentaje > 15) return "orange";
  if (porcentaje > 10) return "yellow-darken-2";
  return "green";
};

const mostrarTooltip = (event, semestre, nivel) => {
  tooltipData.value = {
    semestre: semestre.semestre,
    nivel: nivel,
    cantidad: semestre.cantidades[nivel],
    porcentaje: semestre.porcentajes[nivel],
  };

  tooltipX.value = event.clientX + 10;
  tooltipY.value = event.clientY + 10;
  tooltipVisible.value = true;
};

const ocultarTooltip = () => {
  tooltipVisible.value = false;
};

// Función para color de impacto
const getImpactColor = (porcentajeAlto) => {
  if (porcentajeAlto > 40) return "red";
  if (porcentajeAlto > 25) return "orange";
  if (porcentajeAlto > 15) return "yellow-darken-2";
  return "green";
};

// Cargar correlaciones (conecta con tu API existente)
const cargarCorrelaciones = async () => {
  try {
    const response = await fetch(
      "https://anxitech-model.onrender.com/api/stats/correlaciones",
    );
    const data = await response.json();
    correlaciones.value = data.correlaciones;
  } catch (err) {
    console.error("Error:", err);
  }
};
const maxEstudiantes = computed(() => {
  if (factores.value.length === 0) return 250;
  return Math.max(...factores.value.map((f) => f.total_estudiantes));
});

const maxSeveridad = computed(() => {
  if (factores.value.length === 0) return 25;
  return Math.max(...factores.value.map((f) => f.alto));
});

const ticksX = computed(() => {
  const max = maxEstudiantes.value;
  const step = Math.ceil(max / 5 / 50) * 50; // Redondear a 50
  return [0, step, step * 2, step * 3, step * 4, max];
});

const ticksY = computed(() => {
  return [0, 5, 10, 15, 20, 25];
});

const factoresCriticos = computed(() => {
  const umbralPrevalencia = maxEstudiantes.value / 2;
  const umbralSeveridad = 15;

  return factores.value
    .filter(
      (f) =>
        f.total_estudiantes > umbralPrevalencia && f.alto > umbralSeveridad,
    )
    .map((f) => ({ nombre: getNombreCorto(f.factor) }));
});

const factoresPreocupantes = computed(() => {
  const umbralPrevalencia = maxEstudiantes.value / 2;
  const umbralSeveridad = 15;

  return factores.value
    .filter(
      (f) =>
        f.total_estudiantes <= umbralPrevalencia && f.alto > umbralSeveridad,
    )
    .map((f) => ({ nombre: getNombreCorto(f.factor) }));
});

const headersTabla = [
  { title: "Factor", key: "factor", align: "start" },
  { title: "Estudiantes Afectados", key: "total_estudiantes", align: "center" },
  { title: "% Alto", key: "alto", align: "center" },
  { title: "Impacto", key: "impacto", align: "center" },
  { title: "Cuadrante", key: "cuadrante", align: "center" },
];

// ============================================
// MÉTODOS
// ============================================

const cargarFactores = async () => {
  cargando.value = true;

  try {
    const response = await fetch(
      "https://anxitech-model.onrender.com/api/stats/correlaciones",
    );
    const data = await response.json();

    factores.value = data.correlaciones;

    console.log("✅ Factores cargados para matriz:", factores.value.length);
  } catch (err) {
    console.error("❌ Error al cargar factores:", err);
    factores.value = [];
  } finally {
    cargando.value = false;
  }
};

const getXPosition = (estudiantes) => {
  const chartWidth = graficaWidth - paddingLeft - paddingRight;
  return paddingLeft + (estudiantes / maxEstudiantes.value) * chartWidth;
};

const getYPosition = (porcentaje) => {
  const chartHeight = graficaHeight - paddingTop - paddingBottom;
  return graficaHeight - paddingBottom - (porcentaje / 25) * chartHeight;
};

const getRadius = (impacto) => {
  return 8 + impacto / 10; // Radio entre 8 y 18
};

const getColor = (factor) => {
  const cuadrante = getCuadrante(factor);

  if (cuadrante === "Crítico") return "#EF5350";
  if (cuadrante === "Preocupante") return "#FF9800";
  if (cuadrante === "Atención") return "#FFC107";
  return "#66BB6A";
};

const getStrokeColor = (factor) => {
  const cuadrante = getCuadrante(factor);

  if (cuadrante === "Crítico") return "#B71C1C";
  if (cuadrante === "Preocupante") return "#E65100";
  if (cuadrante === "Atención") return "#F57F17";
  return "#2E7D32";
};

const getCuadrante = (factor) => {
  const umbralPrevalencia = maxEstudiantes.value / 2;
  const umbralSeveridad = 15;

  const altaPrevalencia = factor.total_estudiantes > umbralPrevalencia;
  const altaSeveridad = factor.alto > umbralSeveridad;

  if (altaPrevalencia && altaSeveridad) return "Crítico";
  if (!altaPrevalencia && altaSeveridad) return "Preocupante";
  if (altaPrevalencia && !altaSeveridad) return "Atención";
  return "Bajo riesgo";
};

const getCuadranteColor = (factor) => {
  const cuadrante = getCuadrante(factor);

  if (cuadrante === "Crítico") return "red";
  if (cuadrante === "Preocupante") return "orange";
  if (cuadrante === "Atención") return "yellow-darken-2";
  return "green";
};

const getNombreCorto = (nombre) => {
  const mapeo = {
    "Promedio académico bajo (<70)": "Promedio bajo",
    "Carga excesiva de materias (7+)": "Materias 7+",
    "Trabaja y estudia": "Trabajo",
    "Transporte público": "Transporte",
    "Presión por mantener beca": "Beca",
    "Semestres iniciales (1-3)": "Semestres 1-3",
    "Edad joven (<21 años)": "Edad <21",
  };

  return mapeo[nombre] || nombre;
};

// Cargar datos al montar el componente
onMounted(() => {
  if (usuarioStore.getTipo() === "Admin") {
    cargarDashboard();
    cargarFactores();
  }
});
</script>

<style scoped>
.grafica-barras {
  padding: 20px 0;
}

.barra-container {
  margin-bottom: 20px;
}

.barra-label {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.barra-wrapper {
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.barra {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  transition: width 0.5s ease;
  border-radius: 8px;
}

.barra-valor {
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.factores-riesgo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.factor-item {
  padding: 12px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.factor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.factor-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.factor-nombre {
  font-weight: 600;
  font-size: 15px;
}

.carreras-list {
  padding: 12px 0;
}

.carrera-item {
  padding: 12px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.heatmap-container {
  width: 100%;
  overflow-x: auto;
}

.heatmap-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  gap: 8px;
  margin-bottom: 8px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  font-weight: bold;
}

.heatmap-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}

.header-cell {
  text-align: center;
  font-weight: 600;
  font-size: 14px;
}

.header-cell.factor-label {
  text-align: left;
}

.cell {
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.factor-name {
  text-align: left;
  font-weight: 500;
  background: #fafafa;
  justify-content: flex-start;
}

.heatmap-cell {
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.heatmap-cell:hover {
  border-color: #1976d2;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cell-value {
  font-size: 16px;
  font-weight: 600;
}

.impact-cell {
  background: transparent;
}

.legend {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.legend-title {
  margin-bottom: 12px;
  font-size: 14px;
}

.legend-items {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-box {
  width: 30px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.evolucion-chart {
  margin-top: 20px;
}

.semestre-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.semestre-label {
  min-width: 100px;
  text-align: right;
  padding-right: 12px;
}

.barra-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.barra-apilada {
  flex: 1;
  height: 35px;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.segmento {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 11px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.segmento:hover {
  filter: brightness(1.1);
  transform: scaleY(1.1);
}

.segmento-bajo {
  background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
}

.segmento-medio {
  background: linear-gradient(135deg, #fdd835 0%, #fbc02d 100%);
}

.segmento-alto {
  background: linear-gradient(135deg, #ef5350 0%, #e53935 100%);
}

.porcentaje-alto {
  min-width: 80px;
}

.leyenda {
  display: flex;
  justify-content: center;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.grafica-factores {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
}

.linechart-factores {
  background: white;
  border-radius: 8px;
}

.punto-interactivo {
  cursor: pointer;
  transition: r 0.2s ease;
}

.punto-interactivo:hover {
  r: 8;
}

.factores-referencia {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.matriz-container {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  overflow-x: auto;
}

.matriz-riesgo {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.punto-factor {
  cursor: pointer;
  transition: all 0.3s ease;
}

.punto-factor:hover {
  opacity: 1 !important;
  filter: brightness(1.2);
}

.label-factor {
  pointer-events: none;
}

.tooltip-custom {
  position: fixed;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  z-index: 10000;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  line-height: 1.8;
  max-width: 300px;
}
</style>

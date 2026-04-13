<template>
    <v-layout class="layout">
        <v-navigation-drawer v-model="drawer" expand-on-hover :rail="rail" :temporary="temporary" @click="rail = false"
            color="blue-darken-3" :location="$vuetify.display.mobile ? 'bottom' : undefined">
            <v-list>
                <v-list-item prepend-icon="mdi-account" :subtitle="usuarioStore.getApellido()"
                    :title="usuarioStore.getNombre()"></v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list density="compact" nav>
                <v-list-item v-for="(item, index) in routes" :key="index" :prepend-icon="`mdi-${item.icon}`"
                    :title="item.title" @click="irA(`${item.routeName}`)"
                    :variant="$route.name === item.routeName ? 'elevated' : 'plain'"></v-list-item>
                <v-list-item v-for="(item, index) in adminRoutes" :key="index" :prepend-icon="`mdi-${item.icon}`"
                    :title="item.title" @click="irA(`${item.routeName}`)"
                    :variant="$route.name === item.routeName ? 'elevated' : 'plain'"
                    v-if="usuarioStore.getTipo() == 'Admin'"></v-list-item>
                <v-list-item v-for="(item, index) in alumnoRoutes" :key="index" :prepend-icon="`mdi-${item.icon}`"
                    :title="item.title" @click="irA(`${item.routeName}`)"
                    :variant="$route.name === item.routeName ? 'elevated' : 'plain'"
                    v-if="usuarioStore.getTipo() == 'Alumno'"></v-list-item>
            </v-list>

            <template v-slot:append>
                <div>
                    <v-list density="compact" nav>
                        <v-list-item prepend-icon="mdi-cog" @click="irA('panel-ajustes')" variant="tonal"
                            title="Ajustes"></v-list-item>
                        <v-list-item prepend-icon="mdi-logout" @click="salir" variant="tonal"
                            title="Cerrar sesión"></v-list-item>
                    </v-list>
                </div>
            </template>
        </v-navigation-drawer>

        <v-app-bar color="blue-darken-1">
            <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
            <v-app-bar-title>{{ appStore.getEncabezado }}</v-app-bar-title>

            <template v-slot:append>
                <div class="logo">
                    <img src="../assets/logo.png" alt="anxitech" />
                </div>
            </template>
        </v-app-bar>

        <v-main class="content">
            <v-container fluid>
                <div class="loading" v-if="appStore.isLoading">
                    <v-progress-circular color="primary" indeterminate></v-progress-circular>
                </div>
                <router-view v-else />
            </v-container>
        </v-main>
    </v-layout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useDisplay } from 'vuetify'
import { useAppStore } from "@/stores/app";
import { useUsuarioStore } from "@/stores/usuario";
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router';

const theme = useTheme()

const router = useRouter();

const routes = [
    {
        icon: 'home',
        title: 'Inicio',
        routeName: 'panel-inicio'
    },
]

const adminRoutes = [
    {
        icon: 'account-multiple',
        title: 'Personas',
        routeName: 'panel-usuarios'
    },
   /*  {
        icon: 'account-group',
        title: 'Carga masiva',
        routeName: 'panel-bulk'
    }, */
    {
        icon: 'calendar-blank',
        title: 'Aplicaciones',
        routeName: 'panel-aplicaciones-admin'
    },
    {
        icon: 'help-circle-outline',
        title: 'Preguntas',
        routeName: 'panel-preguntas-admin'
    },
]

const alumnoRoutes = [
    {
        icon: 'history',
        title: 'Historial',
        routeName: 'panel-historial'
    },
]


const appStore = useAppStore();
const usuarioStore = useUsuarioStore();

const { mobile } = useDisplay()
const drawer = ref(true)
const rail = ref(true)

const temporary = computed(() => mobile.value)

const checkMobile = () => {
    if (mobile.value) {
        rail.value = false
    } else {
        rail.value = true
        drawer.value = true
    }
}

const toggleDrawer = () => {
    if (mobile.value) {
        drawer.value = !drawer.value
    } else {
        rail.value = !rail.value
    }
}

const irA = (ruta) => {
    router.push({ name: ruta })
}

const salir = async () => {
    await usuarioStore.salir().then(() => {
        //console.log('Saliendo...')
        router.push({ name: 'login', });
    })
}

onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)

    theme.global.name.value = usuarioStore.getTema()
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile)
})
</script>

<style lang="scss" scoped>
.layout {
    .logo {
        height: 50%;
        max-height: 100%;
        margin-right: 1rem;
        margin-left: auto;

        display: flex;
        justify-content: center;
        align-items: center;

        img {
            height: 100%;
            object-fit: contain;
        }
    }

    .content {
        .loading {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>
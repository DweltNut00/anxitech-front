/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router/auto";
import { useAppStore } from "@/stores/app";
import { useUsuarioStore } from "@/stores/usuario";
//import { components } from 'vuetify/dist/vuetify-labs.js'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			component: () => import("../layouts/default.vue"),
			children: [
				{
					name: "login",
					path: "",
					component: () => import("../pages/default/Login.vue"),
					beforeEnter: () => {
						const appStore = useAppStore();
						appStore.setDefaultTitle("¡Hola de nuevo!");
						appStore.setDefaultSubtitle(
							"Nos da gusto volver a verte. Ingresa tus datos para continuar."
						);
					},
				},
				{
					name: "registro",
					path: "registro",
					component: () => import("../pages/default/Registro.vue"),
					beforeEnter: () => {
						const appStore = useAppStore();
						appStore.setDefaultTitle("Empieza tu aventura con nosotros.");
						appStore.setDefaultSubtitle(
							"Descubre la plataforma que te ayudará a conocerte un poco más."
						);
					},
				},
			],
			// Guardia de navegación: No permite usuarios que ya iniciaron sesión
			beforeEnter: (to, from, next) => {
				const usuarioStore = useUsuarioStore();
				if (usuarioStore.logged) {
					return next('/panel')
				}

				next()
			},
		},
		{
			path: "/panel",
			component: () => import("../layouts/main.vue"),
			children: [
				{
					name: "panel-inicio",
					path: "",
					component: () => import("../pages/main/InicioAdmin.vue"),
					beforeEnter: () => {
						const appStore = useAppStore();
						appStore.setEncabezado("Inicio");
					},
				},
				{
					name: "panel-usuarios",
					path: "usuarios",
					component: () => import("../pages/main/Usuarios.vue"),
					beforeEnter: () => {
						const appStore = useAppStore();
						appStore.setEncabezado("Usuarios");
					},
				},
				{
					name: "panel-bulk",
					path: "bulk",
					component: () => import("../pages/main/CargaMasiva.vue"),
					beforeEnter: () => {
						const appStore = useAppStore();
						appStore.setEncabezado("Carga masiva de alumnos");
					},
				},
				{
					name: "panel-aplicaciones-admin",
					path: "aplicaciones",
					component: () => import("../pages/main/AplicacionesAdmin.vue"),
					beforeEnter: () => {
						const appStore = useAppStore();
						appStore.setEncabezado("Gestión de fechas de aplicación");
					},
				},
				{
					name: "panel-preguntas-admin",
					path: "preguntas",
					component: () => import("../pages/main/PreguntasAdmin.vue"),
					beforeEnter: () => {
						const appStore = useAppStore();
						appStore.setEncabezado("Preguntas");
					},
				},
				{
					name: "panel-ajustes",
					path: "ajustes",
					component: () => import("../pages/main/Ajustes.vue"),
					beforeEnter: () => {
						const appStore = useAppStore();
						appStore.setEncabezado("Ajustes");
					},
				},
				{
					name: "panel-encuesta",
					path: "encuesta",
					component: () => import("../pages/main/Encuesta.vue"),
					beforeEnter: () => {
						const appStore = useAppStore();
						appStore.setEncabezado("Encuesta");
					},
				},
				{
					name: "panel-encuesta-extra",
					path: "encuesta-extra",
					component: () => import("../pages/main/EncuestaExtra.vue"),
					beforeEnter: () => {
						const appStore = useAppStore();
						appStore.setEncabezado("Información complementaria");
					},
				},
				{
					name: "panel-historial",
					path: "historial",
					component: () => import("../pages/main/Historial.vue"),
					beforeEnter: () => {
						const appStore = useAppStore();
						appStore.setEncabezado("Historial");
					},
				},
				{
					name: "panel-resultados",
					path: "resultados",
					component: () => import("../pages/main/MiEncuesta.vue"),
					beforeEnter: () => {
						const appStore = useAppStore();
						appStore.setEncabezado("Resultados");
					},
				},
			],
			// Guardia de navegación:
			//	- NO permite usuarios que no hayan iniciado sesión
			//	- Protege rutas que solo deberían ser vistas por administradores
			beforeEnter: (to, from, next) => {
				const usuarioStore = useUsuarioStore();
				if (!usuarioStore.logged) {
					return next('/')
				}

				if ((to.name == 'panel-usuarios' || to.name == 'panel-aplicaciones-admin' || to.name == 'panel-preguntas-admin') && usuarioStore.getTipo() !== 'Admin') {
					return next('/panel')
				}

				if ((to.name == 'panel-encuesta' || to.name == 'panel-historial' || to.name == 'panel-encuesta' || to.name == 'panel-encuesta-extra') && usuarioStore.getTipo() !== 'Alumno') {
					return next('/panel')
				}

				next()
			},
		},
	],
});

router.beforeEach((to, from, next) => {
	const usuarioStore = useUsuarioStore()
	
	const appStore = useAppStore()
	appStore.setLoading(true)

	if (to.name !== 'panel-encuesta' && to.name !== 'panel-encuesta-extra' && to.name !== 'panel-resultados') {
		usuarioStore.setIdAplicacion(null)
	}

	next()
})

router.afterEach(() => {
	const appStore = useAppStore()
	appStore.setLoading(false)
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
	if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
		if (!localStorage.getItem("vuetify:dynamic-reload")) {
			console.log("Reloading page to fix dynamic import error");
			localStorage.setItem("vuetify:dynamic-reload", "true");
			location.assign(to.fullPath);
		} else {
			console.error("Dynamic import error, reloading page did not fix it", err);
		}
	} else {
		console.error(err);
	}
});

router.isReady().then(() => {
	localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;

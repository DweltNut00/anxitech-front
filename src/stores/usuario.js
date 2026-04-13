// Utilities
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useSessionStorage } from '@vueuse/core'

export const useUsuarioStore = defineStore('usuario', () => {
  const usuario = useSessionStorage('usuario', {
    id: null,
    nombre: null,
    apellido: null,
    tipo: null,
    token: null,
    permisos: null,
    tema: null,
    id_aplicacion: null
  }
  )

  const logged = computed(() => usuario.value.id !== null)

  async function salir() {
    usuario.value = {
      id: null,
      nombre: null,
      apellido: null,
      tipo: null,
      token: null,
      permisos: null,
    }
  }

  function setId(value) {
    usuario.value.id = value
  }

  function getId() {
    return usuario.value.id ?? null
  }

  function setNombre(value) {
    usuario.value.nombre = value
  }

  function getNombre() {
    return usuario.value.nombre ?? null
  }

  function setApellido(value) {
    usuario.value.apellido = value
  }

  function getApellido() {
    return usuario.value.apellido ?? null
  }

  function setTipo(value) {
    usuario.value.tipo = value
  }

  function getTipo() {
    return usuario.value.tipo ?? null
  }

  function setToken(value) {
    usuario.value.token = value
  }

  function getToken() {
    return usuario.value.token ?? null
  }

  function setPermisos(value) {
    usuario.value.permisos = value
  }

  function getPermisos() {
    return usuario.value.permisos ?? null
  }

  function setTema(value) {
    usuario.value.tema = value
  }

  function getTema() {
    return usuario.value.tema ?? null
  }

  function setIdAplicacion(value) {
    usuario.value.id_aplicacion = value
  }

  function getIdAplicacion() {
    return usuario.value.id_aplicacion ?? null
  }

  return { setId, getId, setNombre, getNombre, setApellido, getApellido, setTipo, getTipo, setToken, getToken, setPermisos, getPermisos, setTema, getTema, setIdAplicacion, getIdAplicacion, logged, salir }
})
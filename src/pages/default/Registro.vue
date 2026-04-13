<template>
  <v-window class="login" v-model="step">
    <v-window-item :value="1">
      <v-card elevation-1 elevation="0">
        <v-form v-model="basics_valid" class="item">
          <div class="header">
            <div class="icon">
              <v-icon
                icon="mdi-map-legend"
                size="x-large"
                color="grey-darken-2"
              ></v-icon>
            </div>
            <h2 class="title">¡Empecemos!</h2>
            <h4 class="subtitle text-grey-lighten-1">
              Para crear tu cuenta, deberás ingresar los siguientes datos:
            </h4>
          </div>

          <div class="field-group">
            <div class="field">
              <v-text-field
                label="Nombre(s)"
                prepend-inner-icon="mdi-account"
                rounded="lg"
                v-model="nombre"
                :rules="nameRules"
                @keypress="soloLetras"
              ></v-text-field>
            </div>
            <div class="field">
              <v-text-field
                label="Apellido(s)"
                prepend-inner-icon="mdi-account"
                rounded="lg"
                v-model="apellido"
                :rules="nameRules"
                @keypress="soloLetras"
              ></v-text-field>
            </div>
            <div class="field">
              <v-text-field
                label="No. Control"
                prepend-inner-icon="mdi-account-outline"
                rounded="lg"
                type="number"
                v-model="noControl"
                :rules="noControlRules"
                maxlength="8"
                @input="noControl = String(noControl).slice(0, 8)"
              ></v-text-field>
            </div>
            <div class="field">
              <v-text-field
                label="Nombre de usuario"
                prepend-inner-icon="mdi-account-outline"
                rounded="lg"
                v-model="user"
                :rules="userRules"
                hint="Recuérdalo, con este vas a iniciar sesión."
                persistent-hint
              ></v-text-field>
            </div>
            <div class="field">
              <v-text-field
                label="Correo electrónico"
                prepend-inner-icon="mdi-at"
                rounded="lg"
                v-model="email"
                :rules="emailRules"
              ></v-text-field>
            </div>
          </div>

          <div class="buttons">
            <v-btn
              rounded="lg"
              variant="flat"
              color="light-blue-darken-2"
              @click="validateUserEmail"
            >
              Continuar
            </v-btn>

            <v-btn variant="text" size="small" @click="goTo">
              ¿Ya tienes cuenta? ¡Inicia sesión!
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-window-item>

    <v-window-item :value="2">
      <v-card elevation-1 elevation="0">
        <v-form v-model="personal_valid" class="item">
          <div class="header">
            <div class="icon">
              <v-icon
                icon="mdi-map-marker"
                size="x-large"
                color="grey-darken-2"
              ></v-icon>
            </div>
            <h2 class="title">Información personal</h2>
            <h4 class="subtitle text-grey-lighten-1">
              ¡No te preocupes! Esta información es confidencial.
            </h4>
          </div>

          <div class="field-group">
            <div class="field">
              <v-autocomplete
                label="Estado"
                prepend-inner-icon="mdi-map-marker"
                rounded="lg"
                v-model="estado"
                :items="estadosList"
                item-title="nombre"
                item-value="nombre"
                :loading="cargandoEstados"
                :rules="basicRules"
                clearable
                @update:modelValue="cargarMunicipios"
              ></v-autocomplete>
            </div>

            <div class="field">
              <v-autocomplete
                label="Municipio"
                prepend-inner-icon="mdi-city"
                rounded="lg"
                v-model="ciudad"
                :items="municipiosList"
                :loading="cargandoMunicipios"
                :rules="basicRules"
                :disabled="!estado || cargandoMunicipios"
                :hint="!estado ? 'Primero selecciona un estado' : ''"
                persistent-hint
                clearable
              ></v-autocomplete>
            </div>

            <div class="field">
              <div class="field">
                <v-date-input
                  label="Fecha de nacimiento"
                  :rules="fechaRules"
                  :max="fechaMaxNacimiento"
                  v-model="fechaN"
                ></v-date-input>
              </div>
            </div>

            <div class="field">
              <p>Estado civil</p>
              <v-radio-group v-model="estadoC" inline>
                <v-radio label="Soltero" value="Soltero"></v-radio>
                <v-radio label="Casado" value="Casado"></v-radio>
                <v-radio label="Divorciado" value="Divorciado"></v-radio>
                <v-radio label="Viudo" value="Viudo"></v-radio>
              </v-radio-group>
            </div>

            <div class="field">
              <p>Sexo</p>
              <v-radio-group v-model="sexo" inline>
                <v-radio label="Masculino" value="M"></v-radio>
                <v-radio label="Femenino" value="F"></v-radio>
              </v-radio-group>
            </div>
          </div>

          <div class="buttons">
            <v-btn
              rounded="lg"
              variant="flat"
              color="light-blue-darken-2"
              @click="validatePersonal"
            >
              Continuar
            </v-btn>

            <v-btn variant="text" size="small" @click="step--">
              Regresar
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-window-item>

    <v-window-item :value="3">
      <v-card elevation-1 elevation="0">
        <v-form v-model="passw_valid" class="item">
          <div class="header">
            <div class="icon">
              <v-icon
                icon="mdi-form-textbox-password"
                size="x-large"
                color="grey-darken-2"
              ></v-icon>
            </div>
            <h2 class="title">Establecer contrase&ntilde;a</h2>
            <h4 class="subtitle text-grey-lighten-1">
              ¡Ya casi! Solo debes crear tu nueva contraseña.
            </h4>
          </div>

          <div class="field-group">
            <div class="field">
              <v-text-field
                label="Contraseña"
                prepend-inner-icon="mdi-key-variant"
                rounded="lg"
                v-model="pass"
                type="password"
                :rules="passRules"
              ></v-text-field>
            </div>

            <div class="field">
              <v-text-field
                label="Confirmar contraseña"
                prepend-inner-icon="mdi-key-variant"
                rounded="lg"
                v-model="con_pass"
                type="password"
                :rules="conPassRules"
              ></v-text-field>
            </div>
          </div>

          <div class="buttons">
            <v-btn
              rounded="lg"
              variant="flat"
              color="light-blue-darken-2"
              @click="registrar"
            >
              Crear cuenta
            </v-btn>

            <v-btn variant="text" size="small" @click="step--">
              Regresar
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-window-item>

    <v-dialog v-model="dialog" max-width="320" persistent>
      <v-list class="py-2" color="primary" elevation="12" rounded="lg">
        <v-list-item
          prepend-icon="mdi-clock-time-four-outline"
          title="Creando tu cuenta..."
        >
          <template v-slot:prepend>
            <div class="pe-4">
              <v-icon color="primary" size="x-large"></v-icon>
            </div>
          </template>

          <template v-slot:append>
            <v-progress-circular
              color="primary"
              indeterminate="disable-shrink"
              size="16"
              width="2"
            ></v-progress-circular>
          </template>
        </v-list-item>
      </v-list>
    </v-dialog>

    <v-window-item :value="4">
      <v-card elevation-1 elevation="0" class="item">
        <div class="header">
          <div class="icon">
            <v-icon
              icon="mdi-check"
              size="x-large"
              color="grey-darken-2"
            ></v-icon>
          </div>
          <h2 class="title">¡Éxito!</h2>
          <h4 class="subtitle text-grey-lighten-1">
            ¡Gracias por crear tu cuenta! Ya puedes iniciar sesión.
          </h4>
        </div>
        <div class="buttons">
          <v-btn
            rounded="lg"
            variant="flat"
            color="light-blue-darken-2"
            @click="goTo"
          >
            Iniciar sesión
          </v-btn>
        </div>
      </v-card>
    </v-window-item>

    <v-snackbar v-model="snackbar" :timeout="timeout" variant="tonal">
      {{ text }}

      <template v-slot:actions>
        <v-btn
          color="blue"
          variant="text"
          @click="snackbar = false"
          icon="mdi-close"
        ></v-btn>
      </template>
    </v-snackbar>
  </v-window>
</template>

<script setup>
import { ref, shallowRef, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const dialog = shallowRef(false);

const snackbar = ref(false);
const text = ref();
const timeout = ref(2500);

const step = ref(1);
const nombre = ref();
const apellido = ref();
const user = ref();
const noControl = ref();
const email = ref();
const fechaN = ref();
const sexo = ref("M");
const estadoC = ref("Soltero");
const pass = ref();
const con_pass = ref();

const basics_valid = ref(false);
const personal_valid = ref(false);
const passw_valid = ref(false);

const basicRules = ref([
  (value) => {
    if (value) return true;

    return "Campo requerido.";
  },
]);

const nameRules = ref([
  (value) => {
    if (value) return true;
    return "Campo requerido.";
  },
  (value) => {
    if (/^[a-zA-ZáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙüÜñÑ ]+$/.test(value)) return true;
    return "Solo se permiten letras y espacios.";
  },
]);

const fechaRules = ref([
  (value) => {
    if (!value) return "Fecha de nacimiento requerida.";

    const hoy = new Date();
    const nacimiento = new Date(value);

    // Calcular edad exacta
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    // Ajustar si aún no ha cumplido años este año
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    if (edad >= 17) return true;

    return "Debes tener al menos 17 años para registrarte.";
  },
]);
const fechaMaxNacimiento = computed(() => {
  const hoy = new Date();
  hoy.setFullYear(hoy.getFullYear() - 17);
  return hoy.toISOString().split("T")[0]; // formato YYYY-MM-DD
});

const noControlRules = ref([
    value => {
        if (value) return true
        return 'Número de control requerido.'
    },
    value => {
        if (/^\d{8}$/.test(value)) return true
        return 'Debe tener exactamente 8 dígitos.'
    }
])

const userRules = ref([
  (value) => {
    if (value) return true;

    return "Nombre de usuario requerido.";
  },
  (value) => {
    if (/^[a-zA-Z0-9_-]{6,}$/.test(value)) return true;

    return "Debe tener al menos 6 letras, se admiten _ y -";
  },
]);

const emailRules = ref([
  (value) => {
    if (value) return true;

    return "Correo electrónico requerido.";
  },
  (value) => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return true;

    return "No es una dirección válida.";
  },
]);

const passRules = ref([
  (value) => {
    if (value) return true;

    return "Contraseña requerida.";
  },
  (value) => {
    if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(value)) return true;

    return "Debe tener al menos: 8 carácteres, una mayúscula, una minúscula y un número.";
  },
]);

const conPassRules = ref([
  (value) => {
    if (value) return true;

    return "Contraseña requerida.";
  },
  (value) => {
    if (value == pass.value) return true;

    return "Las contraseñas no coinciden.";
  },
]);

const soloLetras = (event) => {
  const char = String.fromCharCode(event.keyCode || event.which);
  if (!/[a-zA-ZáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙüÜñÑ ]/.test(char)) {
    event.preventDefault();
  }
};

const validateUserEmail = async () => {
  try {
    if (!basics_valid.value) {
      text.value = "Verifica tus datos.";
      snackbar.value = true;
      return;
    }

    const validateUser = await (
      await fetch(
        import.meta.env.VITE_ENDPOINT + "auth.php?action=validateUsername",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: user.value }),
        },
      )
    ).json();

    if (validateUser.status != "ok") {
      text.value = validateUser.message;
      snackbar.value = true;
      return;
    }

    const validateNC = await (
      await fetch(
        import.meta.env.VITE_ENDPOINT + "auth.php?action=validateNoControl",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nocontrol: noControl.value }),
        },
      )
    ).json();

    if (validateNC.status != "ok") {
      text.value = validateNC.message;
      snackbar.value = true;
      return;
    }

    const validateEmail = await (
      await fetch(
        import.meta.env.VITE_ENDPOINT + "auth.php?action=validateEmail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email.value }),
        },
      )
    ).json();

    if (validateEmail.status != "ok") {
      text.value = validateEmail.message;
      snackbar.value = true;
      return;
    }

    step.value++;
  } catch (error) {
    console.log(error);
  }
};

const validatePersonal = () => {
  if (!personal_valid.value) {
    text.value = "No has llenado todos los campos.";
    snackbar.value = true;
    return;
  }

  step.value++;
};

const registrar = async () => {
  if (!passw_valid.value) {
    text.value = "Verifica la información.";
    snackbar.value = true;
    return;
  }

  try {
    dialog.value = true;

    const register = await (
      await fetch(import.meta.env.VITE_ENDPOINT + "auth.php?action=register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.value,
          password: pass.value,
          nombre: nombre.value,
          apellido: apellido.value,
          email: email.value,
          nocontrol: noControl.value,
          fechan: formatDate(fechaN.value),
          estadoc: estadoC.value,
          sexo: sexo.value,
          ciudad: ciudad.value,
          estado: estado.value,
        }),
      })
    ).json();

    if (register.status != "ok") {
      text.value = register.message;
      snackbar.value = true;
      return;
    }

    setTimeout(() => {
      dialog.value = false;
      step.value++;
    }, 1000);
  } catch (error) {
    text.value = "Ha ocurrido un error.";
    snackbar.value = true;
    dialog.value = false;
  }
};

const goTo = () => {
  router.push("/");
};

function formatDate(date) {
  const year = date.getFullYear(); // Obtiene el año (YYYY)
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Obtiene el mes (mm) y agrega un 0 si es necesario
  const day = String(date.getDate()).padStart(2, "0"); // Obtiene el día (dd) y agrega un 0 si es necesario

  return `${year}-${month}-${day}`; // Retorna la fecha en formato YYYY-mm-dd
}
// 1. Cambia el import para agregar computed y onMounted:

// 2. Cambia la inicialización de ciudad y estado:
const ciudad = ref(null);
const estado = ref(null);

// 3. Agrega estas variables y funciones:

const estadosList = ref([]); // [{ id, nombre }]
const municipiosList = ref([]); // ["Orizaba", "Córdoba", ...]
const cargandoEstados = ref(false);
const cargandoMunicipios = ref(false);

// Carga los 32 estados al abrir el formulario
onMounted(async () => {
  cargandoEstados.value = true;
  try {
    const res = await fetch(
      import.meta.env.VITE_ENDPOINT + "geo.php?action=estados",
    );
    const data = await res.json();
    if (data.status === "ok") {
      estadosList.value = data.estados;
    }
  } catch (e) {
    console.error("Error cargando estados:", e);
  }
  cargandoEstados.value = false;
});

// Carga los municipios del estado seleccionado
const cargarMunicipios = async (nombreEstado) => {
  if (!nombreEstado) {
    municipiosList.value = [];
    ciudad.value = null;
    return;
  }

  ciudad.value = null;
  cargandoMunicipios.value = true;

  try {
    const res = await fetch(
      import.meta.env.VITE_ENDPOINT +
        "geo.php?action=municipios&estado=" +
        encodeURIComponent(nombreEstado),
    );
    const data = await res.json();
    if (data.status === "ok") {
      municipiosList.value = data.municipios;
    }
  } catch (e) {
    console.error("Error cargando municipios:", e);
  }

  cargandoMunicipios.value = false;
};
</script>

<style lang="scss" scoped>
@use "../../styles/settings.scss" as constants;

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

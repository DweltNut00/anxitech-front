/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import colors from 'vuetify/lib/util/colors'

// Composables
import { createVuetify } from 'vuetify'

import { VDateInput } from 'vuetify/labs/VDateInput'
import { VFileUpload } from 'vuetify/labs/VFileUpload'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VDateInput,
    VFileUpload,
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        primary: colors.blue
      }
    }
  },
})

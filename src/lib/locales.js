// lib/locales.js
import { languages, namespaces } from 'next-i18next-static-site'

const locales = {}
languages.map((language) => {
  locales[language] = {}

  namespaces.map((namespace) => {
    // eslint-disable-next-line unicorn/prefer-module, @typescript-eslint/no-require-imports
    locales[language][namespace] = require('./../locales/' +
      language +
      '/' +
      namespace +
      '.json')
  })
})

export default locales

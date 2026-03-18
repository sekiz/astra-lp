import { getRequestConfig } from 'next-intl/server'

// Temporary stub — Plan 03 replaces this with full i18n routing configuration
export default getRequestConfig(async () => {
  return {
    locale: 'en',
    messages: {}
  }
})

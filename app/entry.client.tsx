import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Fetch from 'i18next-fetch-backend';
import {I18nextProvider, initReactI18next } from 'react-i18next'
import { getInitialNamespaces } from 'remix-i18next/client';

if (ENV.MODE === 'production' && ENV.SENTRY_DSN) {
	void import('./utils/monitoring.client.tsx').then(({ init }) => init())
}

export async function main(){
	await i18next
	.use(initReactI18next) // Tell i18next to use the react-i18next plugin
	.use(LanguageDetector) // Setup a client-side language detector
	.use(Fetch) // Setup your backend
	.init({
      fallbackLng: 'en',
      ns: getInitialNamespaces(),
      detection: { order: ['htmlTag'], caches: [] },
      backend: { loadPath: '/api/locales/{{lng}}/{{ns}}' },
    });
}

startTransition(() => {
	hydrateRoot(document, 
		<I18nextProvider i18n={i18next}>
			<HydratedRouter />
		</I18nextProvider>
)
})

import { initializeApp, credential as _credential } from 'firebase-admin'

import serviceAccount from './permissions.json'

initializeApp({
  credential: _credential.cert(serviceAccount),
})

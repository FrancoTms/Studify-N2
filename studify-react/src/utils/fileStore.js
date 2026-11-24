// Guarda el contenido de los archivos en IndexedDB (la base de datos del navegador).
// localStorage solo admite unos 5 MB de texto; IndexedDB guarda archivos binarios de cientos de MB.
// Acá solo vive el contenido (Blob) con el id del archivo como clave; los datos del archivo
// (nombre, materia, unidad, tema) se guardan con el resto de los datos en DataProvider.

const DB_NAME = 'studify-files'
const STORE = 'blobs'

let dbPromise = null

function openDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('Este navegador no permite guardar archivos.'))
        return
      }
      const request = indexedDB.open(DB_NAME, 1)
      request.onupgradeneeded = () => request.result.createObjectStore(STORE)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    // Si falla, se vuelve a intentar en el próximo uso
    dbPromise.catch(() => {
      dbPromise = null
    })
  }
  return dbPromise
}

// Ejecuta una operación dentro de una transacción y espera a que termine
async function run(mode, operation) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const store = tx.objectStore(STORE)
    let result
    const request = operation(store)
    if (request) request.onsuccess = () => (result = request.result)
    tx.oncomplete = () => resolve(result)
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error ?? new Error('Se canceló la operación.'))
  })
}

export const saveBlob = (id, blob) => run('readwrite', (store) => store.put(blob, id))
export const loadBlob = (id) => run('readonly', (store) => store.get(id))
export const deleteBlob = (id) => run('readwrite', (store) => store.delete(id))

export function deleteBlobs(ids) {
  if (!ids.length) return Promise.resolve()
  return run('readwrite', (store) => {
    ids.forEach((id) => store.delete(id))
  })
}

// Pide al navegador que no borre estos datos si se queda sin espacio (puede no aceptarlo)
export async function requestPersistence() {
  try {
    if (navigator.storage?.persist && !(await navigator.storage.persisted())) await navigator.storage.persist()
  } catch {
    // No disponible: los archivos se guardan igual
  }
}

// Espacio usado y disponible en este navegador (en bytes), si el navegador lo informa
export async function storageEstimate() {
  try {
    if (navigator.storage?.estimate) return await navigator.storage.estimate()
  } catch {
    // No disponible
  }
  return null
}

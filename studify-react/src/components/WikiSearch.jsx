import { useEffect, useState } from 'react'
import axios from 'axios'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Image from 'react-bootstrap/Image'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import Stack from 'react-bootstrap/Stack'
import { showError, showWarning } from '../utils/alerts'

const API_URL = import.meta.env.VITE_API_URL

const DEFAULT_TERM = 'Técnica Pomodoro'
const SUGGESTIONS = ['Programación', 'Análisis de sistemas', 'Scrum', 'Mapa mental']

function getErrorMessage(error) {
  if (error.code === 'ECONNABORTED') return 'Wikipedia tardó demasiado en responder. Intentá de nuevo en unos segundos.'
  if (error.response) return `Wikipedia respondió con un error (código ${error.response.status}).`
  if (error.request) return 'No pudimos conectarnos con Wikipedia. Revisá tu conexión a internet.'
  return error.message
}

export default function WikiSearch() {
  const [input, setInput] = useState(DEFAULT_TERM) // lo que el usuario escribe en el campo
  const [query, setQuery] = useState({ term: DEFAULT_TERM, nonce: 0 }) // busqueda enviada
  const [results, setResults] = useState([]) // datos que devuelve la API
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Se ejecuta al montar el componente y cada vez que se envia una busqueda nueva 
  useEffect(() => {
    if (!API_URL) {
      const message = 'Falta la variable VITE_API_URL'
      setError(message)
      showError(message)
      return undefined
    }

    const controller = new AbortController()

    const fetchResults = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(API_URL, {
          params: {
            action: 'query',
            generator: 'search',
            gsrsearch: query.term,
            gsrlimit: 6,
            prop: 'extracts|pageimages|info',
            exintro: 1,
            explaintext: 1,
            exsentences: 2,
            exlimit: 'max',
            piprop: 'thumbnail',
            pithumbsize: 160,
            inprop: 'url',
            format: 'json',
            formatversion: 2,
            origin: '*',
          },
          timeout: 10000,
          signal: controller.signal,
        })

        // La API de Wikipedia puede responder 200 con un objeto "error"
        if (response.data.error) throw new Error(response.data.error.info)

        const pages = response.data.query?.pages ?? []
        setResults([...pages].sort((a, b) => a.index - b.index))
      } catch (err) {
        if (axios.isCancel(err)) return // petición reemplazada por otra: no es un error real
        const message = getErrorMessage(err)
        setResults([])
        setError(message)
        showError(message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchResults()

    // Cancela la petición anterior si el usuario busca otra cosa o sale de la página
    return () => controller.abort()
  }, [query])

  const search = (term) => setQuery({ term, nonce: Date.now() })

  const handleSubmit = (e) => {
    e.preventDefault()
    const term = input.trim()
    if (term.length < 2) {
      showWarning('Escribí al menos 2 caracteres para buscar un tema.')
      return
    }
    search(term)
  }

  const handleSuggestion = (term) => {
    setInput(term)
    search(term)
  }

  return (
    <>
      <Form onSubmit={handleSubmit} role="search" className="mb-3">
        <InputGroup>
          <Form.Control
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Buscá un tema, por ejemplo: Metodologías ágiles"
            aria-label="Tema a buscar en Wikipedia"
          />
          <Button type="submit" variant="primary" disabled={loading}>
            <i className="bi bi-search me-2"></i>
            Buscar
          </Button>
        </InputGroup>
      </Form>

      <Stack direction="horizontal" gap={2} className="flex-wrap mb-4">
        <span className="text-secondary small">Probá con:</span>
        {SUGGESTIONS.map((s) => (
          <Button
            key={s}
            variant="outline-primary"
            size="sm"
            className="rounded-pill"
            disabled={loading}
            onClick={() => handleSuggestion(s)}
          >
            {s}
          </Button>
        ))}
      </Stack>

      <div aria-live="polite">
        {loading && (
          <Stack direction="horizontal" gap={3} className="justify-content-center py-5 text-secondary" role="status">
            <Spinner animation="border" size="sm" />
            Buscando “{query.term}” en Wikipedia…
          </Stack>
        )}

        {!loading && error && (
          <Alert variant="danger" className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <span><i className="bi bi-exclamation-triangle-fill me-2"></i>{error}</span>
            <Button variant="outline-danger" size="sm" onClick={() => search(query.term)}>
              <i className="bi bi-arrow-clockwise me-1"></i>
              Reintentar
            </Button>
          </Alert>
        )}

        {!loading && !error && results.length === 0 && (
          <Alert variant="info" className="mb-0">
            No encontramos resultados para “{query.term}”. Probá con otras palabras.
          </Alert>
        )}

        {!loading && !error && results.length > 0 && (
          <>
            <p className="text-secondary small mb-3">
              {results.length} {results.length === 1 ? 'resultado' : 'resultados'} para “{query.term}”
            </p>
            <Row className="g-3">
              {results.map((page) => (
                <Col md={6} key={page.pageid}>
                  <Card className="h-100 rounded-4 shadow-sm hover-lift">
                    <Card.Body className="d-flex flex-column">
                      <Stack direction="horizontal" gap={3} className="align-items-start mb-2">
                        {page.thumbnail && (
                          <Image
                            src={page.thumbnail.source}
                            alt=""
                            rounded
                            className="flex-shrink-0 object-fit-cover"
                            width={64}
                            height={64}
                          />
                        )}
                        <Card.Title as="h3" className="h6 fw-bold mb-0">{page.title}</Card.Title>
                      </Stack>
                      <Card.Text className="text-secondary small flex-grow-1">
                        {page.extract || 'Este artículo no tiene un resumen disponible.'}
                      </Card.Text>
                      <Button
                        as="a"
                        href={page.fullurl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline-primary"
                        size="sm"
                        className="align-self-start"
                      >
                        Leer en Wikipedia
                        <i className="bi bi-box-arrow-up-right ms-2"></i>
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>

      <p className="text-secondary small mt-4 mb-0">
        Contenido de Wikipedia
      </p>
    </>
  )
}

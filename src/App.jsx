import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    const getData = async (baseUrl) => {
      try {
      const response = await axios.get(baseUrl)
      setResources(response.data)
      }
      catch (err) {
        console.log(err)
      }
    }

    getData(baseUrl)

  }, [baseUrl])

  const create = async (resource) => {

    try {
    const uniqueId = () => {
      const dateString = Date.now().toString(36);
      const randomness = Math.random().toString(36).substr(2);
      return dateString + randomness;
    };
    const id = uniqueId()
    const response = await axios.post(`${baseUrl}`, {...resource, id:id } )
    setResources(resources.concat(response.data))
    return response
  }
  catch (err) {
    console.log(err)
  }
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App
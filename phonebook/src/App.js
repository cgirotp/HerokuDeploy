import React, { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Filter = (props) => <div>filter shown with: <input value={props.nS} onChange={props.hSC}/></div>

const PersonForm = (props) => {
  return (
    <form onSubmit={props.aN}>
      <div>name: <input value={props.nNa} onChange={props.hNaC}/></div>
      <div>number: <input value={props.nNu} onChange={props.hNuC}/></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const Person = (props) => {
  const person = props.person
  const del = () => {
    const choice = window.confirm(`Delete ${person.name} ?`)
    if (choice) {
      personService
        .del(person.id)
    }
  }
  return (
    <div>
      {person.name} {person.number}
      <button onClick={del}>delete</button>
    </div>
  )
}

const Persons = (props) => {
  const persons = props.persons
  const newSearch = props.newSearch
  const personsToShow = newSearch === ''
  ? persons
  : persons.filter(person => person.name.includes(newSearch))
  return (
    <div>
      {personsToShow.map(person =>
        <Person key={person.id} person={person}/>)}
    </div>
  )
}



const App = () => {

  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newSearch, setNewSearch ] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    const modify = () => {
      const change = window.confirm(`${newName} is already added to phonebook, replace the old number by a new one?`)
      if (change) {
        const oldObject = persons.filter(person => person.name === newName)
        personService
          .update(oldObject[0].id,nameObject)
      }
    }
    const alreadyExists = persons.filter(person => person.name === newName).length === 0
    const warning = alreadyExists
    ? personService
      .create(nameObject)
      .then(response => {
        setPersons(persons.concat(response.data))
      })
    : modify()  
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter nS={newSearch} hSC={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm aN={addName} nNa={newName} hNaC={handleNameChange} nNu={newNumber} hNuC={handleNumberChange}/>
      <h3>Numbers</h3>
      <Persons persons={persons} newSearch={newSearch}/>
    </div>
  )
}

export default App
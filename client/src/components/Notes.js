import React, { Component } from "react"

class Notes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: [],
    };
  }

  componentDidMount() {
    fetch("/api/notes")
      .then(res => res.json())
      .then(notes => {
        this.setState({ notes: notes })
      })
  }

  render() {
    return (
      <ul>
        {
          this.state.notes.map(note => (
            <li>
              <h3>{note.title}</h3>
              <p>{note.text}</p>
            </li>
          ))
        }
      </ul>
    )
  }
}

export default Notes

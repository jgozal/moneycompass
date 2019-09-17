import 'bootstrap/dist/css/bootstrap.css'

import { Container } from 'reactstrap'
import React from 'react'
import ReactDOM from 'react-dom'

import MainForm from './components/main-form'

class App extends React.Component {
  render () {
    // TODO 018.12.09: Include an intro paragraph
    return (
      <Container>
        <MainForm />
      </Container>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app-container'))

export default App

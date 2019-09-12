import 'bootstrap/dist/css/bootstrap.css'

import { faCompass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Navbar, NavbarBrand } from 'reactstrap'
import React from 'react'
import ReactDOM from 'react-dom'

import FeedbackButton from './components/feedback-button'
import MainForm from './components/main-form'

class App extends React.Component {
  render () {
    // TODO 018.12.09: Include an intro paragraph
    return (
      <div>
        <Navbar className='border-bottom fixed-top' color='white' light>
          <NavbarBrand href='/'>
            <FontAwesomeIcon icon={faCompass} className='mr-2 text-success' />
            MoneyCompass
          </NavbarBrand>
        </Navbar>
        <MainForm />
        <FeedbackButton />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app-container'))

export default App

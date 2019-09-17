import 'bootstrap/dist/css/bootstrap.css'

import { faCompass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container, Navbar, NavbarBrand } from 'reactstrap'
import { injectGlobal } from 'emotion'
import React from 'react'
import ReactDOM from 'react-dom'

import FeedbackButton from './components/feedback-button'
import MainForm from './components/main-form'

// TODO 2019-09-15: Where should global styles live?
injectGlobal`
  b {
    font-weight: 500;
  }
`

class App extends React.Component {
  render () {
    // TODO 018.12.09: Include an intro paragraph
    return (
      <div>
        <Navbar className='border-bottom' color='white' light>
          <NavbarBrand href='/'>
            <FontAwesomeIcon icon={faCompass} className='mr-2 text-success' />
            MoneyCompass
          </NavbarBrand>
        </Navbar>
        <Container fluid className='pt-4 px-5'>
          <MainForm />
          <FeedbackButton />
        </Container>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app-container'))

export default App

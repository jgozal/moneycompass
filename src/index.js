import 'bootstrap/dist/css/bootstrap.css'

import { faCompass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container, Navbar, NavbarBrand } from 'reactstrap'
import { css, cx, injectGlobal } from 'react-emotion'
import React from 'react'
import ReactDOM from 'react-dom'

import FeedbackButton from './components/feedback-button'
import MortgageInvestmentCompare from './components/mortgage-investment-compare/index'
import { DARK_BLUE_GRAY } from './assets/colors'

// TODO 2019-09-15: Where should global styles live?
injectGlobal`
  b {
    font-weight: 500;
  }
`

const footer = cx(
  css(`background-color: ${DARK_BLUE_GRAY};`),
  'text-white',
  'd-flex',
  'flex-column',
  'align-items-center',
  'mt-5',
  'pt-4'
)

class App extends React.Component {
  render () {
    // TODO 018.12.09: Include an intro paragraph
    return (
      <div>
        <Navbar className='border-bottom sticky-top' color='white' light>
          <NavbarBrand href='/'>
            <FontAwesomeIcon icon={faCompass} className='mr-2 text-success' />
            MoneyCompass
          </NavbarBrand>
        </Navbar>
        <Container fluid className='pt-4 px-5'>
          <MortgageInvestmentCompare />
          <FeedbackButton />
        </Container>
        <footer className={footer}>
          <p>
            <b>Copyright © 2019 Money Compass. All rights reserved</b>
          </p>
          <p>
            <b>
              Say hi!{' '}
              <a href='mailto:hello@moneycompass.org'>hello@moneycompass.org</a>
            </b>
          </p>
        </footer>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app-container'))

export default App

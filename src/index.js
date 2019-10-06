import 'bootstrap/dist/css/bootstrap.css'

import { Container, Navbar, NavbarBrand } from 'reactstrap'
import { css, cx } from 'react-emotion'
import { faCompass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'

import { GRAY_100, GRAY_900, BLUE_GRAY_900, LIGHT_BLUE } from './assets/colors'
import FeedbackButton from './components/general/feedback-button'
import MortgageInvestmentCompare from './components/mortgage-investment-compare/index'

// GLOBAL STYLES
const globalStyles = css`
  color: ${GRAY_900};
  font-family: 'Noto Sans', sans-serif;

  a {
    color: ${LIGHT_BLUE};
  }
`

const footer = cx(
  css(`background-color: ${BLUE_GRAY_900};`),
  'text-white',
  'd-flex',
  'flex-column',
  'align-items-center',
  'mt-5',
  'p-4'
)

class App extends React.Component {
  render () {
    // TODO 018.12.09: Include an intro paragraph
    return (
      <HashRouter basename={process.env.PUBLIC_URL}>
        <div className={globalStyles}>
          <Navbar className='border-bottom sticky-top' color='white' light>
            <NavbarBrand href='/'>
              <FontAwesomeIcon icon={faCompass} className='mr-2 text-success' />
              MoneyCompass
            </NavbarBrand>
          </Navbar>
          <Container
            fluid
            className={cx(css(`background-color: ${GRAY_100}`), 'pt-4', 'px-5')}
          >
            <Route
              path='/mortgage-investment-compare'
              component={MortgageInvestmentCompare}
            />
            <FeedbackButton />
          </Container>
          <footer className={footer}>
            <p>Copyright © 2019 Money Compass. All rights reserved</p>
            <p>
              Say hi!{' '}
              <a href='mailto:hello@moneycompass.org'>hello@moneycompass.org</a>
            </p>
          </footer>
        </div>
      </HashRouter>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app-container'))

export default App

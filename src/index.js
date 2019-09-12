import 'bootstrap/dist/css/bootstrap.css'

import { css } from 'react-emotion'
import { faCompass, faCommentDots } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Navbar, NavbarBrand } from 'reactstrap'
import React from 'react'
import ReactDOM from 'react-dom'

import MainForm from './components/main-form'
import { BLUE, LIGHT_BLUE, WHITE } from './assets/colors'

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
        <a
          className={css`
            align-items: center;
            background-color: ${LIGHT_BLUE};
            border-radius: 50%;
            bottom: 2rem;
            display: flex;
            height: 3em;
            justify-content: center;
            position: fixed;
            right: 2rem;
            width: 3em;
            &:hover {
              background-color: ${BLUE};
            }
          `}
          href='https://forms.gle/TZVcdcFMh25Knjn58'
          rel='noopener noreferrer'
          target='_blank'
        >
          <FontAwesomeIcon
            icon={faCommentDots}
            className={css`
              color: ${WHITE};
              font-size: 1.5rem;
            `}
          />
        </a>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app-container'))

export default App

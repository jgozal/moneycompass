import { Collapse } from 'reactstrap'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'

class Accordion extends Component {
  constructor (props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = { collapse: false }
  }

  toggle () {
    this.setState(state => ({ collapse: !state.collapse }))
  }

  render () {
    return (
      <div>
        <a tabIndex='0' onClick={this.toggle}>
          {this.state.collapse ? (
            <small className='text-dark'>
              <FontAwesomeIcon icon={faCaretDown} className='mr-1' />
              <b>{this.props.title}</b>
            </small>
          ) : (
            <small className='text-muted'>
              <FontAwesomeIcon icon={faCaretRight} className='mr-1' />
              {this.props.title}
            </small>
          )}
        </a>
        <Collapse isOpen={this.state.collapse}>{this.props.children}</Collapse>
      </div>
    )
  }
}

export default Accordion

import React, { Component } from 'react'
import { Collapse } from 'reactstrap'

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
              <b>{this.props.title}</b>
            </small>
          ) : (
            <small className='text-muted'>{this.props.title}</small>
          )}
        </a>
        <Collapse isOpen={this.state.collapse}>{this.props.children}</Collapse>
      </div>
    )
  }
}

export default Accordion

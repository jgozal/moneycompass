import React, { Component } from 'react'
import { Collapse, Button } from 'reactstrap'
import styled from 'react-emotion'

// CSS

const XButton = styled(Button)`
  font-size: 14px;
`

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
          {this.props.title}
        </a>
        <Collapse isOpen={this.state.collapse}>{this.props.body}</Collapse>
      </div>
    )
  }
}

export default Accordion

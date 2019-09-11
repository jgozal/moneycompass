import React, { Component } from 'react'
import { Collapse, Button, CardBody, Card } from 'reactstrap'
import styled from 'react-emotion'

// CSS

const XButton = styled(Button)`
  font-size: ;
`

const XCard = styled(Card)`
  font-size: 13px;
  border-width: 3px;
`

const XCardBody = styled(CardBody)`
  padding: 10px;
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
        <XButton color='link' onClick={this.toggle}>
          {this.props.title}
        </XButton>
        <Collapse isOpen={this.state.collapse}>
          <XCard>
            <XCardBody>{this.props.body}</XCardBody>
          </XCard>
        </Collapse>
      </div>
    )
  }
}

export default Accordion

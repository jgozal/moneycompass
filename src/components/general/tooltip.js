import React from 'react'
import { Tooltip } from 'reactstrap'

export default class TooltipWrapper extends React.Component {
  constructor (props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      tooltipOpen: false
    }
  }

  toggle () {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    })
  }

  render () {
    return (
      <div>
        <span href='#' id={`${this.props.id}-tooltip`}>
          {this.props.children}
        </span>

        <Tooltip
          placement='right'
          isOpen={this.state.tooltipOpen}
          target={`${this.props.id}-tooltip`}
          toggle={this.toggle}
        >
          {this.props.content}
        </Tooltip>
      </div>
    )
  }
}

import React from 'react'
import { Tooltip as ReactstrapTooltip } from 'reactstrap'
import { css } from 'react-emotion'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Tooltip extends React.Component {
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
        <span id={`${this.props.id}-tooltip`}>
          {this.props.children}{' '}
          {this.props.icon && (
            <FontAwesomeIcon
              icon={this.props.icon}
              className={css`
                font-size: 0.7rem;
                vertical-align: text-top;
              `}
            />
          )}
        </span>

        <ReactstrapTooltip
          placement='right'
          isOpen={this.state.tooltipOpen}
          target={`${this.props.id}-tooltip`}
          toggle={this.toggle}
        >
          {this.props.content}
        </ReactstrapTooltip>
      </div>
    )
  }
}

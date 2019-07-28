import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import styled, { css } from "react-emotion";

// CSS

const StyledButton = styled(Button)`
  font-size: 14px;
`

const StyledCard = styled(Card)`
  font-size: 13px;
  border-width: 3px;
`

const StyledCardBody = styled(CardBody)`
  padding: 10px;
`

class Accordion extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle() {
    this.setState(state => ({ collapse: !state.collapse }));
  }

  render() {
    return (
      <div>
        <StyledButton color="link" onClick={this.toggle}>{this.props.title}</StyledButton>
        <Collapse isOpen={this.state.collapse}>
          <StyledCard>
            <StyledCardBody>
              {this.props.body}
            </StyledCardBody>
          </StyledCard>
        </Collapse>
      </div>
    );
  }
}

export default Accordion;
import React, { useState } from 'react'
import { Button } from 'reactstrap'
import { css } from 'react-emotion'
import { LIGHT_BLUE, BLUE } from '../../assets/colors'

/**
 * @param {*} props
 *   @property {function} onClick - Triggered when overlay button gets clicked
 *   @property {string} text - Text of overlay button
 */
export function Overlay (props) {
  const [backgroundColor, setBackgroundColor] = useState(
    'rgba(255, 255, 255, 0.97)'
  )
  const [opacity, setOpacity] = useState('1')

  function onClick () {
    setBackgroundColor('rgba(255, 255, 255, 0)')
    setOpacity('0')
    setTimeout(props.onClick, 500)
  }

  return (
    <div
      className={css`
        align-items: start;
        background-color: ${backgroundColor};
        bottom: 0;
        display: flex;
        justify-content: center;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transition: background-color 0.5s ease;
      `}
    >
      <Button
        className={css`
          background-color: ${LIGHT_BLUE};
          border: 0;
          margin-top: 20rem;
          opacity: ${opacity};
          transition: opacity 0.2s ease;
          &:hover {
            background-color: ${BLUE};
          }
        `}
        color='primary'
        onClick={onClick}
        size='lg'
      >
        {props.text}
      </Button>
    </div>
  )
}

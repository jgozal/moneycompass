import { css } from 'react-emotion'
import { faCommentDots } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { BLUE, LIGHT_BLUE, WHITE } from '../assets/colors'

const FeedbackLink = styled('a')`
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
`

export default function FeedbackButton () {
  return (
    <FeedbackLink
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
    </FeedbackLink>
  )
}

import _ from 'lodash'
import React, { useState } from 'react'
import { Input } from 'reactstrap'

/**
 * @param {*} props
 *    @property {boolean} isInteger - If true, number must be an integer
 *    @property {number} max - If present, number must be equal or less
 *    @property {number} min - If present, number must be equal or greater
 */
export default function (props) {
  const [value, setValue] = useState(props.value)
  const [isValid, setIsValid] = useState(true)

  function onInputChange (event) {
    const value = event.target.value
    setValue(value)
    const parsed = parseFloat(value)
    if (!value || !_.isNumber(parsed)) {
      setIsValid(false)
      return
    }
    if (props.isInteger && !_.isInteger(parsed)) {
      setIsValid(false)
      return
    }
    if (props.min && parsed < props.min) {
      setIsValid(false)
      return
    }
    if (props.max && parsed > props.max) {
      setIsValid(false)
      return
    }
    setIsValid(true)
    props.onChange(props.name, parsed)
  }

  return (
    <Input
      invalid={!isValid}
      name={props.name}
      min={props.min}
      max={props.max}
      onChange={onInputChange}
      placeholder={props.placeholder}
      type='number'
      value={value}
    />
  )
}

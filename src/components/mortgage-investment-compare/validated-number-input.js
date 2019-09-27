import _ from 'lodash'
import React, { useState } from 'react'
import { Input } from 'reactstrap'

export default function (props) {
  const [value, setValue] = useState(props.value)
  const [isValid, setIsValid] = useState(true)

  function onInputChange (event) {
    const value = event.target.value
    setValue(value)
    const parsed = parseFloat(value)
    if (!value || !_.isInteger(parsed)) {
      setIsValid(false)
      return
    }
    if (_.isNumber(props.min) && parsed <= props.min) {
      setIsValid(false)
      return
    }
    setIsValid(true)
    props.onChange(props.name, parsed)
  }

  return (
    <Input
      invalid={!isValid}
      min={props.min}
      name={props.name}
      onChange={onInputChange}
      placeholder={props.placeholder}
      type='number'
      value={value}
    />
  )
}

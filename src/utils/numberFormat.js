import numbro from 'numbro'
import _ from 'lodash'

export const toUSD = (value, mantissa) => {
  return numbro(_.round(value, mantissa)).formatCurrency({
    thousandSeparated: true
  })
}

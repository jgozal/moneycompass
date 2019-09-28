import numbro from 'numbro'
import _ from 'lodash'

export const toUSD = (value, mantissa) => {
  return numbro(value).formatCurrency({
    thousandSeparated: true,
    mantissa: mantissa || 0
  })
}

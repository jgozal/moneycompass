import _ from 'lodash'
import numbro from 'numbro'

export const toUSD = value => {
  return numbro(_.round(value, 2)).formatCurrency({
    thousandSeparated: true,
    mantissa: 0
  })
}

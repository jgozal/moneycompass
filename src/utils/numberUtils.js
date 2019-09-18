import numbro from 'numbro'

export const formatMoney = value => {
  return numbro(value).formatCurrency({
    thousandSeparated: true,
    mantissa: 0
  })
}

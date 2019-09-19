import numbro from 'numbro'

export const toUSD = value => {
  return numbro(value).formatCurrency({
    thousandSeparated: true,
    mantissa: 0
  })
}

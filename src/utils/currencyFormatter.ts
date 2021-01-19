const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
});

export const formatCurrency = (value: any) => formatter.format(value)

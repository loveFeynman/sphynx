export const DarkButtonStyle = {
    borderRadius: '5px',
    border: 'none',
    width: '230px',
    height: '34px',
    fontSize: '13px',
    background: `${({ theme }) => (theme.isDark ? '#0E0E26' : '#A2E60')}`
}

export const ColorButtonStyle = {
    borderRadius: '5px',
    border: 'none',
    width: '230px',
    height: '34px',
    fontSize: '13px',
    background: 'linear-gradient(90deg, #610D89 0%, #C42BB4 100%)'
}
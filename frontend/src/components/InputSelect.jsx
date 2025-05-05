import Select from 'react-select';

const InputSelect = ({ options, value,  onChange, name }) => {
    return (
        <Select
            value={value}
            name={name}
            onChange={(selectedOption) => {
                onChange({
                    target: {
                        name,
                        value: selectedOption.value
                    }
                });
            }}
            options={options}
            classNamePrefix="custom"
            styles={{
                control: (base, state) => ({
                    ...base,
                    backgroundColor: '#0B0F3C',
                    color: 'white',
                    minHeight: '34px',
                    border: '1px solid #e0e0e0',
                    boxShadow: state.isFocused ? '0 0 0 1px white' : 'none',
                    borderColor: state.isFocused ? 'white' : '#ccc',
                    '&:hover': {
                        borderColor: 'white',
                    }
                }),
                singleValue: (base) => ({
                    ...base,
                    color: '#e0e0e0',
                }),
                input: (base) => ({
                    ...base,
                    color: 'white',
                    padding: 0
                }),
                valueContainer: (base) => ({
                    ...base,
                    padding: "0 8px",
                }),
                menu: (base) => ({
                    ...base,
                    backgroundColor: '#0B0F3C',
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused
                        ? 'white'
                        : state.isSelected
                        ? '#173075'
                        : 'transparent',
                    color: state.isFocused ? '#0B0F3C' : 'white',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: 'white',
                        color: '#0B0F3C',
                    },
                }),
                menuList: (base) => ({
                    ...base,
                    maxHeight: '160px',
                    overflowY: 'auto',
                }),
            }}
        />
    );
};


export default InputSelect
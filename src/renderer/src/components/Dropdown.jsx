import './Dropdown.css';

const Dropdown = ({ options, onChange }) => {
    return (
        <div className="Dropdown">
            <select className="dropdown" onChange={onChange}>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;
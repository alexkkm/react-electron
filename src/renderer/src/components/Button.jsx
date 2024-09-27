import './Button.css';

const Button = ({ label, onClick }) => {
    return (
        <div className="Button">
            <button className="button" onClick={onClick}>
                {label}
            </button>
        </div>
    );
};

export default Button;
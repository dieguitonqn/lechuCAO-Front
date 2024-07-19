"use client"

// Define el tipo de las props
interface InputProps {
    name?: string;
    id?: string;
    type?: string;
    placeholder?: string;
    accept?: string;
    value?: string; // Agregamos la prop value
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Agregamos la prop onChange
    required?:boolean
}

// Componente de entrada
const Input: React.FC<InputProps> = ({ type, name, id, placeholder, accept, value, onChange, required }) => {

    return (
        <input
            type={type}
            className={`border-gray-400 border-2 p-1 m-1 w-full rounded text-sm 

        file:mr-2 file:p-1
        file:rounded-md file:border-1
        file:text-sm file:font-semibold
        file:bg-white file:text-gray-500
        hover:file:bg-green-200
        `}
            required={required || false}
            placeholder={placeholder || ''}
            name={name || ''}
            id={id || ''}
            accept={accept || ""}
            value={value} // Añadimos el valor
            onChange={onChange} // Añadimos el manejador de eventos
        />
    );
}

export default Input;

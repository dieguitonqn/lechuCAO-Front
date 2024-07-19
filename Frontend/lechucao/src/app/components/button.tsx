import React from 'react';
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'default';
const Button = ({ children, type = 'button', variant = 'default', onClick }: { children: React.ReactNode; type?: 'button' | 'submit' | 'reset'; variant?: ButtonVariant; onClick?: () => void }) => {

    const buttonVariants: Record<ButtonVariant, string> = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-gray-800 text-white hover:bg-gray-900',
        outline: 'border border-gray-800 text-gray-800 hover:border-gray-900 hover:text-gray-100 hover:shadow-lg hover:bg-red-400',
        default: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    };

    return (
        <button
            className={`px-4 py-2 rounded-sm ${buttonVariants[variant] || 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            type={type}
            onClick={onClick}
            
        >
            {children}
        </button>
    );
};

export default Button;

import React, {ChangeEvent} from "react";

export default function Input({
    id = "",
    type = "text",
    required = false,
    labelText,
    className,
    value,
    defaultValue,
    onChange,
    error = false,
    errorMessage = "",
    placeholder,
    disabled = false,
}:{
    id?: string,
    type?: string,
    labelText: string,
    required?: boolean,
    placeholder?: string,
    className?: string,
    value?: string | number,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
    defaultValue?: string,
    error?: boolean,
    errorMessage?: string,
    disabled?: boolean
}){
    return (
        <>
            <label
                className="block uppercase text-gray-700 text-xs font-bold mb-2"
                htmlFor={id}
            >
                {labelText}
            </label>
            <input
                placeholder={placeholder}
                required={required}
                type={type}
                id={id}
                disabled={disabled}
                className={`px-3 py-3 placeholder-gray-400 text-gray-700 ${disabled?  "bg-gray-300" : "bg-white"} rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150 ${className}`}
                value={value}
                onChange={onChange}
                defaultValue={defaultValue}
            />
            {
                error ? 
                <span
                    className="uppercase text-red-700 text-xs font-bold mb-2"
                >
                    {errorMessage}
                </span> : null
            }
        </>
    );
}
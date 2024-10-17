import React from "react";

const FormField = ({ name, label, type, value, error, onChange }) => {
    return (
        <div className="form-control">
            <label className="label" htmlFor={name}>
                <span className="label-text">{label}</span>
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className={`input input-bordered ${error ? "input-error" : ""}`}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? `${name}-error` : undefined}
            />
            {error && (
                <span className="text-error text-sm mt-1" id={`${name}-error`}>
                    {error}
                </span>
            )}
        </div>
    );
};

export default FormField;

import { useState } from "react";

export function useForm(initialState, validate, onSubmit) {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        const validationErrors = validate({ ...formData, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: validationErrors[name] }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validate(formData);
        setErrors(validationErrors);

        if (Object.values(validationErrors).every((error) => error === "")) {
            setIsLoading(true);
            const success = await onSubmit(formData);
            setIsLoading(false);
            if (success) {
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                    resetForm();
                }, 1500);
            }
        }
    };

    const resetForm = () => {
        setFormData(initialState);
        setErrors({});
    };

    return {
        formData,
        errors,
        isLoading,
        isSuccess,
        handleInputChange,
        handleSubmit,
        resetForm,
    };
}

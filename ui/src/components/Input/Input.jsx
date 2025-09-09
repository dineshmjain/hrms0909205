import { Button, Input, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const InputWithHelperText = ({ value, OnChange, error, type, label, className, name, disabled }) => {
    return (
        <div>
            <Input disabled={disabled} type={type} name={name} error={!!error} className={className} value={value} onChange={OnChange} label={label} />
            {error &&
                <Typography
                    variant="small"
                    color="red"
                    style={{ fontSize: 12 }}
                    className="mt-1 flex items-center gap-1"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="-mt-px h-3 w-3"
                    >
                        <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error}
                </Typography>
            }
        </div>
    );
}

const PasswordWithHelperText = ({ value, OnChange, error, type, label, className, name }) => {
    const [open, setOpen] = useState(false)
    return (
        <div>
            <Input type={open ? "password" : "text"} name={name} error={!!error} className={className} value={value} onChange={OnChange} label={label}  autoComplete="off" icon={

                <Button className="p-0 m-0" onClick={() => setOpen(!open)} variant="text">
                    {
                        open ? <AiFillEye className="h-5 w-5 text-center text-primary" /> :
                            <AiFillEyeInvisible className="h-5 w-5 text-center text-primary" />
                    }

                </Button>

            } />
            {error &&
                <Typography
                    variant="small"
                    color="red"
                    style={{ fontSize: 12 }}
                    className="mt-1 flex items-center gap-1"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="-mt-px h-3 w-3"
                    >
                        <path
                            fillRule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error}
                </Typography>
            }
        </div>
    );
}

export { InputWithHelperText, PasswordWithHelperText }
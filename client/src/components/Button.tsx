import { MouseEventHandler, ReactNode } from "react"

interface IProps {
    onClick?: MouseEventHandler<HTMLButtonElement>,
    children: ReactNode
    isText?: boolean
}

const Button = ({ children, onClick, isText = false }: IProps) => {

    let className = 'rounded-lg font-bold px-3 py-2 hover:underline '

    if (isText) className += 'text-primary bg-white'
    else className += 'bg-primary text-white'

    return (
        <button
            onClick={onClick}
            className={className}
        >
            {children}
        </button>
    )
}

export default Button
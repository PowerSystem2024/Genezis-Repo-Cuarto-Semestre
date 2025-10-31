function Label({Children, htmlFor}){
    return(
    <Label className = 'block text-gray-400 text-sm font-medium mb-2' htmlFor={htmlFor}>
        {Children}
    </Label>
    )
}

export default Label
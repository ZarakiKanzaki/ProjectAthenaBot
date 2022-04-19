export function isNullOrUndefined(element: any): Boolean{
    return typeof element === 'undefined' || !element;
}

export function isNullOrEmpty(element: String): Boolean{
    return isNullOrUndefined(element) || element === '';
}
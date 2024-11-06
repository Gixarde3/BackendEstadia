class Functions{
    static shiftLetter(letter, shift) {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const index = alphabet.indexOf(letter.toUpperCase());
    
        if (index === -1) {
            throw new Error("Por favor, introduce una letra válida.");
        }
    
        // Calcular el nuevo índice usando el operador % para hacer el ciclo
        const newIndex = (index + shift) % 26;
    
        // Retornar la nueva letra
        return alphabet[newIndex];
    }
}

module.exports = Functions;
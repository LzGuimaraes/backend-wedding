export const isValidEmail = (email: string): boolean => {
    // Implemente uma validação de e-mail mais robusta se necessário
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
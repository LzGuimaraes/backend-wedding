"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = void 0;
const isValidEmail = (email) => {
    // Implemente uma validação de e-mail mais robusta se necessário
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
exports.isValidEmail = isValidEmail;
//# sourceMappingURL=helpers.js.map
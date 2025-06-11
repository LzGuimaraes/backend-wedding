"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./src/app"));
const PORT = parseInt(process.env.PORT || '3000', 10);
app_1.default.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        console.error(`Error starting server: ${err.message}`);
        process.exit(1);
    }
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map
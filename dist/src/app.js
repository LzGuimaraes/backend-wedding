"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const guestRoutes_1 = __importDefault(require("./routes/guestRoutes"));
const donationRoutes_1 = __importDefault(require("./routes/donationRoutes"));
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Rotas da API
app.use('/api/guests', guestRoutes_1.default);
app.use('/api/donations', donationRoutes_1.default);
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Wedding API is running!' });
});
exports.default = app;
//# sourceMappingURL=app.js.map
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import guestRoutes from "./routes/guestRoutes";
import donationRoutes from "./routes/donationRoutes";
import giftRoutes from "./routes/giftRoutes";

const app = express();

// --- CONFIGURAÇÃO DO CORS ---

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Middlewares para parsear JSON
app.use(express.json());

// Rotas da API
app.use("/api/guests", guestRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/gifts", giftRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "API do casamento já está quase pronta!" });
});

// Middleware de Tratamento de Erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Importe NextFunction para tipagem
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;

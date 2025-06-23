
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Connect to DB
connect();

// Routes
app.use("/api/v1", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});

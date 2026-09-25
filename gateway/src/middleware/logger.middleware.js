const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now();

  console.log("========== REQUEST ==========");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Time:", new Date().toISOString());

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    console.log("========== RESPONSE ==========");
    console.log("Status:", res.statusCode);
    console.log("Duration:", `${duration}ms`);
  });

  next();
};

export default loggerMiddleware;
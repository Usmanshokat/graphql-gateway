const serviceKeyMiddleware = (req, res, next) => {
  const serviceKey = req.headers["x-service-key"];
  console.log(serviceKey , 'check service key here')

  console.log("Received Service Key:", serviceKey);

  if (!serviceKey) {
    return res.status(403).json({
      error: "Service key is required",
    });
  }

  if (serviceKey !== process.env.SERVICE_SECRET) {
    return res.status(403).json({
      error: "Invalid service key",
    });
  }

  next();
};

export default serviceKeyMiddleware;
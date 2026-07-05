import mongoose from "mongoose";
import dns from "dns/promises";

// Replace this with your Atlas URI

console.log("Node Version:", process.version);

try {
  console.log("\n=== DNS SRV Test ===");
  const srv = await dns.resolveSrv("_mongodb._tcp.cluster0.62ellva.mongodb.net");
  console.log("✅ SRV Records:");
  console.log(srv);
} catch (err) {
  console.log("❌ DNS SRV Error:");
  console.error(err);
}

try {
  console.log("\n=== MongoDB Connection Test ===");

  const conn = await mongoose.connect(uri);

  console.log("✅ MongoDB Connected Successfully!");
  console.log("Host:", conn.connection.host);
  console.log("Database:", conn.connection.name);

  await mongoose.disconnect();
  console.log("✅ Connection Closed");
} catch (err) {
  console.log("❌ MongoDB Connection Failed");
  console.error(err);
}

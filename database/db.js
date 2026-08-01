import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Ensure environment variables are loaded
dotenv.config();

// Fix DNS resolution issues for MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  console.log('[Database] DNS servers configured to Google/Cloudflare resolvers (8.8.8.8, 1.1.1.1) to prevent querySrv ECONNREFUSED.');
} catch (dnsErr) {
  console.warn('[Database] Custom DNS configuration warning:', dnsErr.message);
}

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

const connectDB = async (attempt = 1) => {
  let uri = process.env.MONGODB_URI;

  // Clean URI in case password still has angle brackets
  if (uri) {
    uri = uri.replace('<zp2Uez9BwBMySloK>', 'zp2Uez9BwBMySloK');
    // Ensure database name is set if connecting to Atlas
    if (uri.includes('.mongodb.net/') && !uri.includes('.mongodb.net/academic-appraisal')) {
      uri = uri.replace('.mongodb.net/?', '.mongodb.net/academic-appraisal?');
      uri = uri.replace('.mongodb.net/', '.mongodb.net/academic-appraisal');
    }
  }

  // Fallback to local MongoDB if maximum retries exceeded on Atlas
  if (attempt > MAX_RETRIES) {
    const localFallback = 'mongodb://127.0.0.1:27017/academic-appraisal';
    console.warn(`\n[Database] Connection to Atlas failed after ${MAX_RETRIES} attempts.`);
    console.warn(`[Database] Falling back to local MongoDB: ${localFallback}\n`);
    try {
      const conn = await mongoose.connect(localFallback);
      console.log(`[Database] Connected successfully to Local MongoDB fallback: ${conn.connection.host}`);
      return conn;
    } catch (localErr) {
      console.error(`[Database] Local fallback connection also failed: ${localErr.message}`);
      throw localErr;
    }
  }

  try {
    console.log(`[Database] Connecting to MongoDB (Attempt ${attempt}/${MAX_RETRIES})...`);
    if (uri) {
      const masked = uri.replace(/:([^@]+)@/, ':****@');
      console.log(`[Database] URI: ${masked}`);
    } else {
      console.warn('[Database] MONGODB_URI is not defined in environment variables.');
    }

    const conn = await mongoose.connect(uri);
    console.log(`[Database] Connected successfully to MongoDB host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database] Connection error on attempt ${attempt}:`);
    console.error(`  Message: ${error.message}`);
    console.error(`  Code: ${error.code || 'N/A'}`);
    console.error(`  Hostname: ${error.hostname || 'N/A'}`);
    console.error(`  Syscall: ${error.syscall || 'N/A'}`);

    if (error.message.includes('querySrv') || error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error('  Diagnosis: DNS lookup failed for MongoDB Atlas. This usually happens if the current network blocks SRV requests or custom DNS servers.');
    }

    console.log(`[Database] Retrying connection in ${RETRY_DELAY_MS / 1000} seconds...`);
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    return connectDB(attempt + 1);
  }
};

export default connectDB;

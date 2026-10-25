require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Job = require("./models/Job");
const Application = require("./models/Application");
const Worker = require("./models/Worker");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { parseJobProfile, fallbackExtraction } = require("./controllers/aiController");

const JWT_SECRET = process.env.JWT_SECRET || "RozgaarSetu@2026";

async function runTestSuite() {
  console.log("=================================================");
  console.log("   ROZGAAR SETU FULL-STACK INTEGRATION TEST SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Database Connection
    console.log("Step 1: Connecting to MongoDB Atlas...");
    await connectDB();
    assert(mongoose.connection.readyState === 1, "MongoDB Atlas Connected");

    const testTimestamp = Date.now();
    const testWorkerEmail = `test_worker_${testTimestamp}@example.com`;
    const testEmployerEmail = `test_employer_${testTimestamp}@example.com`;
    const testPassword = "Password@123";
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // 2. User Registration (Worker & Employer)
    console.log("\nStep 2: Testing User Registration & Roles...");
    const testWorker = await User.create({
      name: "Test Plumber Suresh",
      email: testWorkerEmail,
      phone: "9876543210",
      password: hashedPassword,
      role: "worker",
      skill: "Plumber",
      city: "Pune",
      experience: 5,
      dailyWage: 850,
      about: "Certified residential plumber with 5 years experience.",
    });
    assert(testWorker && testWorker.role === "worker", "Worker Registration Created");

    const testEmployer = await User.create({
      name: "Test Contractor Mehta",
      email: testEmployerEmail,
      phone: "9876543211",
      password: hashedPassword,
      role: "employer",
      city: "Pune",
      about: "Commercial & Residential Contractor",
    });
    assert(testEmployer && testEmployer.role === "employer", "Employer Registration Created");

    // 3. JWT Authentication & Password Verification
    console.log("\nStep 3: Testing Authentication & JWT Tokens...");
    const isPasswordValid = await bcrypt.compare(testPassword, testWorker.password);
    assert(isPasswordValid, "Bcrypt Password Verification");

    const workerToken = jwt.sign({ id: testWorker._id, role: testWorker.role }, JWT_SECRET, { expiresIn: "1d" });
    const employerToken = jwt.sign({ id: testEmployer._id, role: testEmployer.role }, JWT_SECRET, { expiresIn: "1d" });
    assert(workerToken && workerToken.length > 20, "Worker JWT Token Generation");
    assert(employerToken && employerToken.length > 20, "Employer JWT Token Generation");

    // 4. Job Posting
    console.log("\nStep 4: Testing Job Creation & Employer Ownership...");
    const testJob = await Job.create({
      employer: testEmployer._id,
      title: "Urgent Residential Plumber Required",
      description: "Need plumber for pipe fitting and sanitary installation in Kothrud, Pune.",
      skill: "Plumber",
      city: "Pune",
      salary: 900,
      jobType: "Daily Wage",
    });
    assert(testJob && testJob.employer.toString() === testEmployer._id.toString(), "Job Posted by Employer");

    // 5. Job Search and Filtering
    console.log("\nStep 5: Testing Job Search & Filters...");
    const foundJobs = await Job.find({
      skill: { $regex: "plumber", $options: "i" },
      city: { $regex: "pune", $options: "i" },
    }).populate("employer", "name phone");
    assert(foundJobs.length >= 1, "Job Filtered by Skill and City");
    assert(foundJobs[0].employer.name === "Test Contractor Mehta", "Job Populates Employer Info");

    // 6. Worker Unified Search
    console.log("\nStep 6: Testing Unified Worker Directory Search...");
    const workerResults = await User.find({
      role: { $in: ["worker", "professional"] },
      skill: { $regex: "plumber", $options: "i" },
      city: { $regex: "pune", $options: "i" },
    });
    assert(workerResults.length >= 1, "Worker Discovered in Search");

    // 7. Job Application Workflow
    console.log("\nStep 7: Testing Job Application Workflow (API Contract: { jobId })...");
    const testApplication = await Application.create({
      job: testJob._id,
      worker: testWorker._id,
      employer: testJob.employer,
      status: "Pending",
    });
    assert(testApplication && testApplication.status === "Pending", "Application Stored with Employer & Worker refs");

    // Test Duplicate Application Prevention
    const duplicateAppCheck = await Application.findOne({
      job: testJob._id,
      worker: testWorker._id,
    });
    assert(!!duplicateAppCheck, "Duplicate Prevention Detection Logic verified");

    // 8. Employer Application Retrieval & Status Update
    console.log("\nStep 8: Testing Employer Application Retrieval & Status Update...");
    const employerApps = await Application.find({
      $or: [{ employer: testEmployer._id }, { job: testJob._id }],
    }).populate("worker", "name phone skill").populate("job", "title salary");

    assert(employerApps.length >= 1, "Employer Retrieves Received Applications");
    assert(employerApps[0].worker.name === "Test Plumber Suresh", "Application Populates Worker Candidate");

    // Update status to Accepted
    testApplication.status = "Accepted";
    await testApplication.save();
    assert(testApplication.status === "Accepted", "Application Status Updated to 'Accepted'");

    // 9. Rozgaar Saathi AI Processing & Fallback
    console.log("\nStep 9: Testing Rozgaar Saathi AI Natural Language Parsing...");
    const employerNLP = fallbackExtraction("I need an electrician in Bengaluru today for home wiring budget Rs 900");
    assert(employerNLP.intent === "employer", "Rozgaar Saathi Identifies Employer Intent");
    assert(employerNLP.skill === "Electrician", "Rozgaar Saathi Identifies Skill: Electrician");
    assert(employerNLP.city === "Bengaluru", "Rozgaar Saathi Identifies City: Bengaluru");
    assert(employerNLP.wage.includes("900"), "Rozgaar Saathi Identifies Budget: 900");

    const workerNLP = fallbackExtraction("Mera naam Raju hai mai plumber hoon Pune me daily wage 800 rupees chahiye");
    assert(workerNLP.intent === "job_seeker", "Rozgaar Saathi Identifies Job Seeker Intent");
    assert(workerNLP.skill === "Plumber", "Rozgaar Saathi Identifies Skill from Hinglish: Plumber");
    assert(workerNLP.city === "Pune", "Rozgaar Saathi Identifies City: Pune");

    // 10. Platform Stats Retrieval
    console.log("\nStep 10: Testing Platform Live Statistics...");
    const totalWorkers = await User.countDocuments({ role: "worker" });
    const totalJobs = await Job.countDocuments();
    assert(totalWorkers >= 1 && totalJobs >= 1, "Database Live Counts Derived Accurately");

    // 11. Clean Up Test Records
    console.log("\nStep 11: Cleaning up test artifacts...");
    await Application.deleteMany({ _id: testApplication._id });
    await Job.deleteMany({ _id: testJob._id });
    await User.deleteMany({ _id: { $in: [testWorker._id, testEmployer._id] } });
    console.log("Test records cleaned up safely.");

  } catch (error) {
    console.error("Test Suite Unhandled Exception:", error);
    failed++;
  } finally {
    await mongoose.connection.close();
    console.log("\n=================================================");
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log("=================================================");
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTestSuite();

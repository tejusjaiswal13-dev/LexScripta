/**
 * India Legal Assistant - API Test Suite
 * 
 * Run with: npm test
 */

const http = require('http');

// Configuration
const BASE_URL = 'http://localhost';
const PORT = process.env.PORT || 3000;
const API_URL = `${BASE_URL}:${PORT}`;

// Test utilities
let testsPassed = 0;
let testsFailed = 0;

function log(message, type = 'info') {
  const colors = {
    success: '\x1b[32m',
    error: '\x1b[31m',
    info: '\x1b[36m',
    warning: '\x1b[33m',
    reset: '\x1b[0m'
  };
  
  const color = colors[type] || colors.info;
  console.log(`${color}${message}${colors.reset}`);
}

function assert(condition, testName) {
  if (condition) {
    testsPassed++;
    log(`✓ ${testName}`, 'success');
    return true;
  } else {
    testsFailed++;
    log(`✗ ${testName}`, 'error');
    return false;
  }
}

// HTTP request helper
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            json: data ? JSON.parse(data) : null
          };
          resolve(response);
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            json: null
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    
    req.end();
  });
}

// Test functions

async function testHealthCheck() {
  log('\n▶ Testing Health Check Endpoint...', 'info');
  
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/health',
      method: 'GET'
    });
    
    assert(response.statusCode === 200, 'Health check returns 200 status');
    assert(response.json !== null, 'Health check returns JSON');
    assert(response.json.status === 'healthy', 'Health status is healthy');
    assert(response.json.service === 'India Legal Assistant API', 'Service name is correct');
    assert(response.json.timestamp !== undefined, 'Timestamp is present');
    
  } catch (error) {
    log(`Health check test failed: ${error.message}`, 'error');
    testsFailed++;
  }
}

async function testLegalAnalysis() {
  log('\n▶ Testing Legal Analysis Endpoint...', 'info');
  
  const testCases = [
    {
      name: 'Employment Issue',
      data: {
        description: 'My employer fired me without notice and has not paid my salary for 2 months',
        location: 'Mumbai, Maharashtra',
        profession: 'private_employee',
        language: 'en'
      },
      expectedCategory: 'Wrongful Termination'
    },
    {
      name: 'Consumer Issue',
      data: {
        description: 'I bought a defective refrigerator and the company is refusing refund',
        location: 'Delhi',
        profession: 'homemaker',
        language: 'en'
      }
    },
    {
      name: 'Property Issue',
      data: {
        description: 'My landlord is trying to evict me from my rented apartment without notice',
        location: 'Bengaluru, Karnataka',
        profession: 'student',
        language: 'en'
      }
    }
  ];
  
  for (const testCase of testCases) {
    try {
      const response = await makeRequest({
        hostname: 'localhost',
        port: PORT,
        path: '/api/analyze',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, testCase.data);
      
      assert(response.statusCode === 200, `${testCase.name}: Returns 200 status`);
      assert(response.json !== null, `${testCase.name}: Returns JSON`);
      assert(response.json.success === true, `${testCase.name}: Success flag is true`);
      assert(response.json.analysis !== undefined, `${testCase.name}: Contains analysis`);
      assert(response.json.applicableLaws !== undefined, `${testCase.name}: Contains applicable laws`);
      assert(response.json.recommendedSteps !== undefined, `${testCase.name}: Contains recommended steps`);
      assert(response.json.requiredDocuments !== undefined, `${testCase.name}: Contains required documents`);
      assert(response.json.jurisdiction !== undefined, `${testCase.name}: Contains jurisdiction info`);
      
      // Check analysis structure
      assert(response.json.analysis.category !== undefined, `${testCase.name}: Has category`);
      assert(response.json.analysis.urgency !== undefined, `${testCase.name}: Has urgency level`);
      assert(['LOW', 'MEDIUM', 'HIGH'].includes(response.json.analysis.urgency), `${testCase.name}: Valid urgency level`);
      
      // Check arrays are not empty
      assert(response.json.applicableLaws.length > 0, `${testCase.name}: Has applicable laws`);
      assert(response.json.recommendedSteps.length > 0, `${testCase.name}: Has recommended steps`);
      assert(response.json.requiredDocuments.length > 0, `${testCase.name}: Has required documents`);
      
    } catch (error) {
      log(`${testCase.name} test failed: ${error.message}`, 'error');
      testsFailed++;
    }
  }
}

async function testInvalidAnalysisRequest() {
  log('\n▶ Testing Invalid Analysis Requests...', 'info');
  
  try {
    // Test with missing description
    const response1 = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/analyze',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      location: 'Mumbai',
      profession: 'student'
    });
    
    assert(response1.statusCode === 400, 'Returns 400 for missing description');
    assert(response1.json.error !== undefined, 'Contains error message');
    
    // Test with very short description
    const response2 = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/analyze',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      description: 'help',
      location: 'Delhi'
    });
    
    assert(response2.statusCode === 400, 'Returns 400 for short description');
    
  } catch (error) {
    log(`Invalid request test failed: ${error.message}`, 'error');
    testsFailed++;
  }
}

async function testCategoriesEndpoint() {
  log('\n▶ Testing Categories Endpoint...', 'info');
  
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/categories',
      method: 'GET'
    });
    
    assert(response.statusCode === 200, 'Categories endpoint returns 200');
    assert(response.json !== null, 'Returns JSON');
    assert(response.json.success === true, 'Success flag is true');
    assert(response.json.categories !== undefined, 'Contains categories array');
    assert(Array.isArray(response.json.categories), 'Categories is an array');
    assert(response.json.categories.length > 0, 'Has at least one category');
    
    // Check category structure
    const category = response.json.categories[0];
    assert(category.id !== undefined, 'Category has ID');
    assert(category.name !== undefined, 'Category has name');
    assert(category.nameHindi !== undefined, 'Category has Hindi name');
    assert(category.nameTamil !== undefined, 'Category has Tamil name');
    
  } catch (error) {
    log(`Categories test failed: ${error.message}`, 'error');
    testsFailed++;
  }
}

async function testFeedbackEndpoint() {
  log('\n▶ Testing Feedback Endpoint...', 'info');
  
  try {
    // Valid feedback
    const response1 = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/feedback',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      rating: 5,
      comment: 'Very helpful information!',
      wasHelpful: true
    });
    
    assert(response1.statusCode === 200, 'Feedback submission returns 200');
    assert(response1.json.success === true, 'Feedback success flag is true');
    assert(response1.json.message !== undefined, 'Contains success message');
    assert(response1.json.feedbackId !== undefined, 'Returns feedback ID');
    
    // Invalid feedback (no rating)
    const response2 = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/feedback',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      comment: 'Test'
    });
    
    assert(response2.statusCode === 400, 'Returns 400 for missing rating');
    
    // Invalid rating
    const response3 = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/feedback',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      rating: 10,
      comment: 'Test'
    });
    
    assert(response3.statusCode === 400, 'Returns 400 for invalid rating');
    
  } catch (error) {
    log(`Feedback test failed: ${error.message}`, 'error');
    testsFailed++;
  }
}

async function testStatsEndpoint() {
  log('\n▶ Testing Stats Endpoint...', 'info');
  
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/stats',
      method: 'GET'
    });
    
    assert(response.statusCode === 200, 'Stats endpoint returns 200');
    assert(response.json !== null, 'Returns JSON');
    assert(response.json.success === true, 'Success flag is true');
    assert(response.json.stats !== undefined, 'Contains stats object');
    assert(response.json.stats.totalFeedback !== undefined, 'Has total feedback count');
    assert(response.json.stats.averageRating !== undefined, 'Has average rating');
    assert(response.json.stats.helpfulResponses !== undefined, 'Has helpful responses count');
    
  } catch (error) {
    log(`Stats test failed: ${error.message}`, 'error');
    testsFailed++;
  }
}

async function test404Endpoint() {
  log('\n▶ Testing 404 Handler...', 'info');
  
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/nonexistent',
      method: 'GET'
    });
    
    assert(response.statusCode === 404, '404 handler returns 404 status');
    assert(response.json !== null, 'Returns JSON');
    assert(response.json.error !== undefined, 'Contains error message');
    assert(response.json.availableEndpoints !== undefined, 'Lists available endpoints');
    
  } catch (error) {
    log(`404 test failed: ${error.message}`, 'error');
    testsFailed++;
  }
}

async function testJurisdictionDetection() {
  log('\n▶ Testing Jurisdiction Detection...', 'info');
  
  const locations = [
    { input: 'Mumbai, Maharashtra', expectedCity: 'Mumbai', expectedState: 'Maharashtra' },
    { input: 'Delhi', expectedCity: 'Delhi', expectedState: 'Delhi' },
    { input: 'Bengaluru', expectedCity: 'Bengaluru', expectedState: 'Karnataka' },
    { input: 'Unknown City', expectedDetected: false }
  ];
  
  for (const loc of locations) {
    try {
      const response = await makeRequest({
        hostname: 'localhost',
        port: PORT,
        path: '/api/analyze',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, {
        description: 'Test legal issue for jurisdiction detection',
        location: loc.input,
        language: 'en'
      });
      
      if (loc.expectedDetected === false) {
        assert(response.json.jurisdiction.detected === false, `${loc.input}: Not detected`);
      } else {
        assert(response.json.jurisdiction.detected === true, `${loc.input}: Detected`);
        if (loc.expectedCity) {
          assert(response.json.jurisdiction.city === loc.expectedCity, `${loc.input}: Correct city`);
        }
        if (loc.expectedState) {
          assert(response.json.jurisdiction.state === loc.expectedState, `${loc.input}: Correct state`);
        }
      }
      
    } catch (error) {
      log(`Jurisdiction test for ${loc.input} failed: ${error.message}`, 'error');
      testsFailed++;
    }
  }
}

// Main test runner
async function runAllTests() {
  log('\n╔════════════════════════════════════════════════╗', 'info');
  log('║     India Legal Assistant - API Test Suite    ║', 'info');
  log('╚════════════════════════════════════════════════╝', 'info');
  
  log(`\nTesting API at: ${API_URL}`, 'info');
  log('Make sure the server is running (npm start)\n', 'warning');
  
  try {
    await testHealthCheck();
    await testCategoriesEndpoint();
    await testLegalAnalysis();
    await testInvalidAnalysisRequest();
    await testJurisdictionDetection();
    await testFeedbackEndpoint();
    await testStatsEndpoint();
    await test404Endpoint();
    
    // Summary
    log('\n╔════════════════════════════════════════════════╗', 'info');
    log('║              Test Results Summary              ║', 'info');
    log('╚════════════════════════════════════════════════╝', 'info');
    
    const total = testsPassed + testsFailed;
    const passRate = ((testsPassed / total) * 100).toFixed(1);
    
    log(`\nTotal Tests: ${total}`, 'info');
    log(`Passed: ${testsPassed}`, 'success');
    log(`Failed: ${testsFailed}`, testsFailed > 0 ? 'error' : 'success');
    log(`Pass Rate: ${passRate}%`, passRate >= 90 ? 'success' : 'warning');
    
    if (testsFailed === 0) {
      log('\n🎉 All tests passed! The API is working correctly.', 'success');
      process.exit(0);
    } else {
      log('\n⚠️  Some tests failed. Please check the errors above.', 'warning');
      process.exit(1);
    }
    
  } catch (error) {
    log(`\n❌ Test suite failed: ${error.message}`, 'error');
    log('Make sure the server is running on port 3000', 'warning');
    process.exit(1);
  }
}

// Check if server is running before starting tests
async function checkServerRunning() {
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: PORT,
      path: '/api/health',
      method: 'GET'
    });
    
    if (response.statusCode === 200) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

// Entry point
(async () => {
  const serverRunning = await checkServerRunning();
  
  if (!serverRunning) {
    log('\n❌ Server is not running!', 'error');
    log('Please start the server first:', 'warning');
    log('  npm start\n', 'info');
    log('Then run the tests in a new terminal:', 'warning');
    log('  npm test\n', 'info');
    process.exit(1);
  }
  
  runAllTests();
})();
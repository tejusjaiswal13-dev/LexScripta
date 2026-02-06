// Test script for India Legal Assistant
// Run with: node test.js

const http = require('http');

const testCases = [
    {
        name: 'Test Case 1: Landlord-Tenant Dispute',
        data: {
            problem: 'My landlord is not returning my security deposit of ₹20,000 even after 3 months of vacating the property',
            state: 'Maharashtra',
            city: 'Mumbai',
            language: 'English',
            profession: 'Employee'
        }
    },
    {
        name: 'Test Case 2: Consumer Complaint',
        data: {
            problem: 'I bought a mobile phone that is defective and the shop refuses to replace it or give refund',
            state: 'Karnataka',
            city: 'Bangalore',
            language: 'Hindi',
            profession: 'Student'
        }
    },
    {
        name: 'Test Case 3: Cyber Crime',
        data: {
            problem: 'Someone hacked my bank account and transferred ₹50,000. I need urgent help',
            state: 'Delhi',
            city: 'Delhi',
            language: 'English',
            profession: 'Business Owner'
        }
    },
    {
        name: 'Test Case 4: Employment Dispute',
        data: {
            problem: 'My company terminated me without notice and is not paying 2 months salary',
            state: 'Tamil Nadu',
            city: 'Chennai',
            language: 'Tamil',
            profession: 'Employee'
        }
    }
];

function makeRequest(testCase) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(testCase.data);
        
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/analyze',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve({ success: true, response, testCase: testCase.name });
                } catch (error) {
                    reject({ success: false, error: error.message, testCase: testCase.name });
                }
            });
        });
        
        req.on('error', (error) => {
            reject({ success: false, error: error.message, testCase: testCase.name });
        });
        
        req.write(postData);
        req.end();
    });
}

async function runTests() {
    console.log('🧪 Starting India Legal Assistant Tests\n');
    console.log('=' .repeat(60));
    
    // Check if server is running
    console.log('\n📡 Checking if server is running on http://localhost:3000...\n');
    
    let passed = 0;
    let failed = 0;
    
    for (const testCase of testCases) {
        try {
            console.log(`\n🔍 Running: ${testCase.name}`);
            console.log('-'.repeat(60));
            
            const result = await makeRequest(testCase);
            
            if (result.success) {
                console.log('✅ Status: PASSED');
                console.log(`📋 Title: ${result.response.title}`);
                console.log(`⚡ Urgency: ${result.response.urgency_level}`);
                console.log(`📍 Jurisdiction: ${result.response.jurisdiction ? 'Detected' : 'N/A'}`);
                console.log(`📝 Action Steps: ${result.response.action_steps.length} steps provided`);
                console.log(`📄 Documents: ${result.response.documents.length} documents listed`);
                passed++;
            }
        } catch (error) {
            console.log('❌ Status: FAILED');
            console.log(`Error: ${error.error}`);
            failed++;
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 TEST SUMMARY');
    console.log('-'.repeat(60));
    console.log(`Total Tests: ${testCases.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed/testCases.length)*100).toFixed(1)}%`);
    console.log('\n' + '='.repeat(60));
    
    if (passed === testCases.length) {
        console.log('\n🎉 All tests passed! Application is working correctly.\n');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the server logs.\n');
    }
    
    // Test feedback endpoint
    console.log('\n🔍 Testing feedback endpoint...');
    try {
        await new Promise((resolve, reject) => {
            const postData = JSON.stringify({ feedback: 'helpful' });
            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/api/feedback',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };
            
            const req = http.request(options, (res) => {
                console.log('✅ Feedback endpoint working');
                resolve();
            });
            
            req.on('error', reject);
            req.write(postData);
            req.end();
        });
    } catch (error) {
        console.log('❌ Feedback endpoint failed');
    }
    
    // Test stats endpoint
    console.log('\n🔍 Testing stats endpoint...');
    try {
        await new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/api/stats',
                method: 'GET'
            };
            
            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    const stats = JSON.parse(data);
                    console.log('✅ Stats endpoint working');
                    console.log(`   Total feedback: ${stats.total_feedback}`);
                    console.log(`   Helpful: ${stats.helpful}`);
                    console.log(`   Not helpful: ${stats.not_helpful}`);
                    resolve();
                });
            });
            
            req.on('error', reject);
            req.end();
        });
    } catch (error) {
        console.log('❌ Stats endpoint failed');
    }
    
    console.log('\n✨ Testing complete!\n');
}

// Check if server is running first
const checkServer = http.get('http://localhost:3000/', (res) => {
    console.log('✅ Server is running!\n');
    runTests();
});

checkServer.on('error', (error) => {
    console.error('\n❌ ERROR: Server is not running!');
    console.error('\nPlease start the server first:');
    console.error('  npm start\n');
    console.error('Then run this test again:');
    console.error('  node test.js\n');
    process.exit(1);
});

const TestConfiguration = require('../entities/TestConfiguration');

const response = require('./response.json');
const testJson  = require('./test.json');

const testConfiguration = new TestConfiguration(testJson.test);
const results = testConfiguration.checkAssertions(response);

describe("Status Code", () => {
  const statusCodeAssertion = results.find(obj => obj.assertionType === 'statusCode');
  test("actual value is string", () => {
    expect(statusCodeAssertion.targetValue).toEqual('200')
  });
  test('comparing targetValue and actualValue returns true if they are equal', () => {
    expect(statusCodeAssertion.success).toBe(true);
  });

  test('actualValue is not undefined', () => {
   expect(statusCodeAssertion.actualValue).not.toBe(undefined);
  });

  test('targetValue is not undefined', () => {
    expect(statusCodeAssertion.actualValue).not.toBe(undefined);
   });

   test('property is null', () => {
    expect(statusCodeAssertion.property).toBe(null);
   });

   test('200 less than 300 status code returns true', () => {
    const data = {
      targetValue: 300,
      actualValue: 200,
      comparisonType: 'lessThan'
    }
    expect(TestConfiguration.checkResTimeOrStatusCode(data)).toBe(true);
   });

   test('200 less than 300 status code returns true', () => {
    const data = {
      targetValue: 200,
      actualValue: 200,
      comparisonType: 'notEqualTo'
    }
    expect(TestConfiguration.checkResTimeOrStatusCode(data)).toBe(false);
   });

});

describe('Response Time', () => {
  const responseTimeAssertion = results.find(obj => obj.assertionType === 'responseTime');
  
  test('actualValue is not undefined', () => {
    expect(responseTimeAssertion.actualValue).not.toBe(undefined);
   });
 
   test('targetValue is not undefined', () => {
     expect(responseTimeAssertion.actualValue).not.toBe(undefined);
    });

  test('property is null', () => {
    expect(responseTimeAssertion.property).toBe(null);
    });

  test('570 notEqualTo returns false', () => {
    const data = {
      targetValue: '570',
      actualValue: 570,
      comparisonType: 'lessThan',
    }
    expect(TestConfiguration.checkResTimeOrStatusCode(data)).toBe(false);
    });
});

describe('header', () => {
  const headerAssertion = results.find(obj => obj.assertionType === 'header');
  
  test('actualValue is not undefined', () => {
    expect(headerAssertion.actualValue).not.toBe(undefined);
   });

  test('property is not null', () => {
  expect(headerAssertion.property).not.toBe(null);
  });

  test('targetValue is not undefined', () => {
    expect(headerAssertion.actualValue).not.toBe(undefined);
  });

  test('targetValue and actualValue of headers are equal', () => {
    const assertion = {
        "type": 'header',
        "property": 'server',
        "target": '(Ubuntu)'
      };

    expect(TestConfiguration.checkHeaders(assertion, response.headers, 'contains' )).toBe(true);
  })

  test('targetValue and actualValue are greater than or equal when they are numberic', () => {
    const assertion = {
        "type": 'header',
        "property": 'request-duration',
        "target": '723'
      };
    const comparison = 'greaterThanOrEqualTo';
    expect(TestConfiguration.checkHeaders(assertion, response.headers, comparison )).toBe(true);
  })
});

describe('body', () => {
  const bodyAssertion = results.filter(obj => obj.assertionType === 'body');
  test('actualValue is not undefined', () => {
    expect(bodyAssertion[0].actualValue).not.toBe(undefined);
   });
 
  test('targetValue is not undefined', () => {
    expect(bodyAssertion[1].actualValue).not.toBe(undefined);
  });

  test('property format ($[0].title) allow accessing properties of response body', () => {
    const assertionResult = results.filter((result) => result.assertionType === 'body')
    expect(assertionResult[1].success).toBe(true);
  });

  test('comparisonType "contains": actualValue is nested object in which there is at least one key or value that is equal target value', () => {
    const actualValue = {
        name: 'John',
        children: {
          'Melanie' : {age: 13}
        }
      };
    const targetValue = 'age';
    const comparisonType = 'contains';

    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(true);
    });

    test('comparisonType "contains": actualValue is nested object in which there is at least one key or value that is equal target value', () => {
      const actualValue = {};
      const targetValue = 'age';
      const comparisonType = 'contains';
  
      expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(false);
      });

    test('comparisonType "contains": actualValue is a boolean returns true', () => {
      const targetValue = 'true';
      const actualValue = true;
      const comparisonType = 'contains';
    
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue, comparisonType)).toBe(true);
    });

    test('comparisonType "contains": actualValue is a number returns true', () => {
      const targetValue = '72';
      const actualValue = 72
      const comparisonType = 'contains';
      
    
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(true);
    });

    test('comparisonType "contains": actualValue is null contains true', () => {
      const targetValue = 'null';
      const actualValue = null
      const comparisonType = 'contains';
      
    
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(true);
    });

    test('comparisonType "contains": actualValue is undefined returns false', () => {
      const targetValue = 'undefined';
      const actualValue = null
      const comparisonType = 'contains';
      
    
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(false);
    });

    test('comparisonType "hasKey": actualValue is null or undefined returns false', () => {
      const targetValue = 'null';
      const actualValue = undefined
      const comparisonType = 'hasKey';
        
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(false);
    });

    test('comparisonType "hasKey": actualValue is an empty object, returns false', () => {
      const targetValue = 'age';
      const actualValue = {};
      const comparisonType = 'hasKey';
        
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(false);
    });

    test('comparisonType "hasKey": actualValue is an empty object, returns false', () => {
      const targetValue = 'age';
      const actualValue = [];
      const comparisonType = 'hasKey';
        
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(false);
    });

    test('comparisonType "hasValues": actualValue is not typeof object, returns false', () => {
      const targetValue = 'age';
      const actualValue = 'string';
      const comparisonType = 'hasValues';
        
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(false);
    });

    test('comparisonType "notHasKey": actualValue is not typeof object, returns true', () => {
      const targetValue = 'age';
      const actualValue = 'string';
      const comparisonType = 'notHasKey';
        
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(true);
    });

    test('comparisonType "notHasValue": actualValue is not typeof object, returns true', () => {
      const targetValue = 'age';
      const actualValue = 'string';
      const comparisonType = 'notHasValue';
        
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(true);
    });

    test('comparisonType "isEmpty": actualValue is empty object, returns true', () => {
      const targetValue = null;
      const actualValue = {};
      const comparisonType = 'isEmpty';
        
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(true);
    });

    test('comparisonType "isEmpty": actualValue is empty array, returns true', () => {
      const targetValue = null;
      const actualValue = [];
      const comparisonType = 'isEmpty';
        
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(true);
    });

    test('comparisonType "isEmpty": actualValue is not an empty array, returns false', () => {
      const targetValue = null;
      const actualValue = [1,2,3];
      const comparisonType = 'isEmpty';
        
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(false);
    });

    test('comparisonType "isEmpty": actualValue is not an empty object, returns false', () => {
      const targetValue = null;
      const actualValue = {1:1};
      const comparisonType = 'isEmpty';
        
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(false);
    });

    test('comparisonType "isNotEmpty": actualValue is not an empty object, returns true', () => {
      const targetValue = null;
      const actualValue = [1,2,3];
      const comparisonType = 'isNotEmpty';
        
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(true);
    });

    test('comparisonType "isNotEmpty": actualValue is not object or array, returns false', () => {
      const targetValue = null;
      const actualValue = 'string';
      const comparisonType = 'isNotEmpty';
        
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(false);
    });

    test('comparisonType "isNull": actualValue is null, returns true', () => {
      const targetValue = null;
      const actualValue = null;
      const comparisonType = 'isNull';
        
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(true);
    });

    test('comparisonType "isNull": actualValue is not null, returns false', () => {
      const targetValue = null;
      const actualValue = 'string';
      const comparisonType = 'isNull';
        
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(false);
    });

    test('comparisonType "isNotNull": actualValue is not null, returns true', () => {
      const targetValue = null;
      const actualValue = 'string';
      const comparisonType = 'isNotNull';
        
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(true);
    });

    test('comparisonType "isNotNull": actualValue is not null, returns false', () => {
      const targetValue = null;
      const actualValue = null;
      const comparisonType = 'isNotNull';
        
    expect(TestConfiguration.checkJsonBody(targetValue, actualValue,  comparisonType)).toBe(false);
    });

})




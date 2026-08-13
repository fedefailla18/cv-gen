# Testing Interview Questions & Answers Guide
Great question! Here's a structured breakdown of what you might be asked and how to answer confidently, tailored to your stack (JUnit 5 + Mockito for unit tests, Spock for both unit and integration tests).
## 🧩 1. Fundamentals
### Q: What's the difference between a Unit Test and an Integration Test?
**Answer:**
- **Unit Test (UT):** Tests a single class/method in isolation. All dependencies are **mocked**. Fast, no I/O, no Spring context.
- **Integration Test (IT):** Tests how multiple components work **together** — often involving a real database, HTTP calls, or Spring context wiring.

💡 Key phrase: "A unit test verifies behavior in isolation; an integration test verifies collaboration."## 🔧 2. JUnit 5 + Mockito
### Q: What annotations do you commonly use in JUnit 5?

| Annotation | Purpose |
| --- | --- |
| `@Test` | Marks a test method |
| `@BeforeEach` | Runs before each test |
| `@AfterEach` | Runs after each test |
| `@BeforeAll` / `@AfterAll` | Static setup/teardown once per class |
| `@ParameterizedTest` | Data-driven tests |
| `@ExtendWith` | Integrates extensions (e.g., Mockito) |
### Q: What's the difference between and `@Spy`? `@Mock`
**Answer:**
- creates a **full mock** — all methods return default values unless stubbed. `@Mock`
- `@Spy` wraps a **real object** — real methods are called unless overridden.``` java
@Mock
private RedisTemplate<String, Object> redisTemplate; // fully mocked

@Spy
private MyRealService realService; // real object, can override specific methods
```

 
Q: What does verify() do and when should you use it?
Answer: verify() asserts that a specific method was called on a mock, optionally with argument matchers and invocation counts. Use it when the side effect (the call itself) is the behavior being tested — not just a return value.``` java
verify(valueOps).set(SESSION_KEY, session, 30L, TimeUnit.MINUTES);
verify(jwtAuthContext, never()).getCurrentIssuedAt();
```

 
Q: What is inOrder() and why is it useful?
Answer: inOrder() verifies that mocked methods were called in a specific sequence. This is valuable when the order of operations has semantic importance.``` java
var order = inOrder(valueOps);
order.verify(valueOps).set(eq(SESSION_KEY), any(), anyLong(), any());
order.verify(valueOps).set(eq(POINTER_KEY), any(), anyLong(), any());
```

This guarantees the session is written before the pointer, preventing a race condition. 
Q: How do you test that an exception is thrown?``` java
assertThrows(RuntimeException.class, () -> sut.saveSession(OID, IAT, session()));
```

 
🧪 3. Spock Framework
Q: What is Spock and what makes it different from JUnit?
Answer: Spock is a Groovy-based testing framework that uses a BDD-style (given/when/then) structure. Key advantages:
More readable test names as natural language strings
Built-in mocking/stubbing (no need for Mockito)
Native support for data-driven tests via where: blocks
 
Q: Explain the Spock test structure blocks.
Block
Purpose
given:
Setup / preconditions
when:
The action being tested
then:
Assertions and interaction verifications
and:
Logical continuation of any block
expect:
Combined when/then for simple cases
where:
Data table for parameterized tests
cleanup:
Teardown (like @AfterEach)
 
Q: How does mocking and stubbing work in Spock?``` groovy
def ispService = Mock(IspService)          // creates a mock

// Stubbing (return value):
ispService.findByIspOwner(123) >> someIsp

// Interaction verification (called exactly once):
1 * ispService.findByIspOwner(123) >> someIsp

// Never called:
0 * ispService.findByIspOwner(_)
```

💡 In Spock, stubbing and verification can be combined in then: blocks with cardinality (1 *, 0 *). 
Q: How do you write a data-driven test in Spock?``` groovy
def "part specialist level resolves correctly"() {
    given:
    def user = new SystemUser()
    user.setAuthGroups(USER_GROUPS)

    when:
    def response = mockMvc.perform(get("/private/users/{userId}/part-specialist-level", ID))

    then:
    1 * ispService.findUserById(ID) >> user
    response.andExpect(jsonPath("\$").value(RESULT))

    where:
    USER_GROUPS                  | ID  || RESULT
    ['Part Specialist I']        | 123 || 1
    ['Part Specialist II']       | 456 || 2
    ['Service Advisors']         | 285 || 1
}
```

The where: table runs the entire test for each row automatically. 
Q: What is noExceptionThrown() vs thrown() in Spock?``` groovy
then:
noExceptionThrown()  // asserts the happy path completed without errors

// or:
def ex = thrown(BadRequestException)
ex.message == "Cannot deactivate user assigned to a van"
```

 
🏗️ 4. Test Design Principles
Q: What makes a good unit test?
A good answer touches on FIRST:
Principle
Meaning
Fast
No I/O, no sleep, milliseconds
Isolated
No shared state between tests
Repeatable
Same result every run
Self-validating
Pass/fail without manual inspection
Timely
Written alongside (or before) production code
 
Q: What's the difference between a stub and a mock?
Answer:
Stub: Returns a pre-configured value. You don't care how many times it's called.
Mock: You assert how it was called (number of times, with what arguments).``` groovy
// Stub — just returns a value
ispService.findByIspOwner(_) >> TestUtils.createDefaultIsp()

// Mock — verifies the interaction
1 * userCacheService.writeDisabledTombstone("test-oid")
```

 
Q: How do you handle testing code with @Value injected fields?
Answer: Use ReflectionTestUtils.setField() to inject values without a Spring context:``` java
ReflectionTestUtils.setField(sut, "environment", "test-env");
ReflectionTestUtils.setField(sut, "sessionTtlMinutes", 30);
```

 
🌐 5. Controller / Integration Testing
Q: How do you test Spring MVC controllers without starting a full server?
Answer: Using MockMvc, which simulates the HTTP layer without launching a real server:``` groovy
def result = mockMvc.perform(get("/private/users/names")
    .param("ispOwnerUuids", uuid.toString())
    .contentType(MediaType.APPLICATION_JSON))

result.andExpect(status().isOk())
result.andExpect(jsonPath("$", hasSize(3)))
```

 
Q: What is jsonPath() used for in tests?
Answer: It asserts specific values in the JSON response body using JSONPath expressions:``` groovy
result.andExpect(jsonPath("$.firstName", equalTo("John")))
result.andExpect(jsonPath("$.technicianNames", hasSize(3)))
```
 
🎯 Quick Tips for the Interview
Name your tests descriptively — behavior, not implementation (saveSession_writesSessionBeforePointer not testSaveSession2)
Arrange-Act-Assert / Given-When-Then — always explain your structure
Test edge cases — null inputs, exceptions, empty collections, type mismatches
Don't test the framework — test your logic
Integration tests are slower — mention the tradeoff between coverage confidence and test speed
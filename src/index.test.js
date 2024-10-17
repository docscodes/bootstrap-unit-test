describe("metadata microservice", () => {
  const mockListenFn = jest.fn();
  const mockGetFn = jest.fn();

  jest.doMock("express", () => {
    return () => {
      return {
        listen: mockListenFn,
        get: mockGetFn,
      };
    };
  });

  const mockVideosCollection = {};

  const mockDb = {
    collection: () => {
      return mockVideosCollection;
    },
  };

  const mockMongoClient = {
    db: () => {
      return mockDb;
    },
  };

  jest.doMock("mongodb", () => {
    return {
      MongoClient: {
        connect: async () => {
          return mockMongoClient;
        },
      },
    };
  });

  const { startMicroservice } = require("./index");

  test("microservice starts web server on startup", async () => {
    await startMicroservice("dbhost", "dbname", 3000);

    expect(mockListenFn.mock.calls.length).toEqual(1); // Check only 1 call to 'listen'.
    expect(mockListenFn.mock.calls[0][0]).toEqual(3000); // Check for port 3000.
  });

  test("/videos route is handled", async () => {
    await startMicroservice("dbhost", "dbname", 3000);

    expect(mockGetFn).toHaveBeenCalled();

    const videosRoute = mockGetFn.mock.calls[0][0];
    expect(videosRoute).toEqual("/videos");
  });

  test("/videos route retreives data via videos collection", async () => {
    await startMicroservice("dbhost", "dbname", 3000);

    const mockRequest = {};
    const mockJsonFn = jest.fn();
    const mockResponse = {
      json: mockJsonFn,
    };

    const mockRecord1 = {};
    const mockRecord2 = {};

    // Mock the find function to return some mock records.
    mockVideosCollection.find = () => {
      return {
        toArray: async () => {
          // This is set up to follow the convention of the Mongodb library.
          return [mockRecord1, mockRecord2];
        },
      };
    };

    const videosRouteHandler = mockGetFn.mock.calls[0][1]; // Extract the /videos route handler function.
    await videosRouteHandler(mockRequest, mockResponse); // Invoke the request handler.

    expect(mockJsonFn.mock.calls.length).toEqual(1); // Expect that the json fn was called.
    expect(mockJsonFn.mock.calls[0][0]).toEqual({
      videos: [mockRecord1, mockRecord2], // Expect that the mock records were retrieved via the mock database function.
    });
  });
});

import swaggerAutogen from 'swagger-autogen';
const port = process.env.PORT || 3000

const doc = {
     openapi: "3.0.0",
  info: {
    title: "REST API",
    version: "1.0.0",
  },

   servers: [
    {
      url: `http://localhost:${port}/api`, // This makes /api the base path
    },
  ],
   components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
   tags: [
    { name: "Auth", description: "Authentication routes" },
    // { name: "Product", description: "Product routes" },
  ],

   host: undefined,
  basePath: undefined,
  schemes: undefined,
};


// Output file (used by Swagger UI)
const outputFile = "./src/swagger-output.json";

// Files where your routes exist
const routes = ["./src/server.js"]; // <-- swagger-autogen will scan all routes here


swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes);
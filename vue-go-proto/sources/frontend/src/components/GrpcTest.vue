<script setup lang="ts">
import { createPromiseClient } from "@bufbuild/connect";
import { createConnectTransport } from "@bufbuild/connect-web";
import { TestService } from "@template/grpc/dist/web/src/v1/services_connect";
import { ref } from "vue";

// The transport defines what type of endpoint we're hitting.
// In our example we'll be communicating with a Connect endpoint.
// If your endpoint only supports gRPC-web, make sure to use
// `createGrpcWebTransport` instead.
const transport = createConnectTransport({
  baseUrl: "http://localhost:5000",
});

// Here we make the client itself, combining the service
// definition with the transport.
const client = createPromiseClient(TestService, transport);

const response = ref({});

async function test() {
  const res = await client.test({ request: "test grpc" });
  response.value = res;
}
</script>

<template>
  <button @click="test">Test</button>
  <p>{{ response }}</p>
</template>

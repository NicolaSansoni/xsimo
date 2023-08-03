package server

import (
	"context"
	v1 "hip/grpc/dist/go/src/v1"
	"hip/grpc/dist/go/src/v1/v1connect"
	"log"
	"net/http"

	"github.com/bufbuild/connect-go"
	"github.com/rs/cors"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

type TestServer struct {
	v1connect.UnimplementedTestServiceHandler
}

func (ps *TestServer) Test(
	ctx context.Context,
	req *connect.Request[v1.TestRequest],
) (*connect.Response[v1.TestResponse], error) {
	// connect.Request and connect.Response give you direct access to headers and
	// trailers. No context-based nonsense!
	log.Println(req.Header().Get("Some-Header"))
	res := connect.NewResponse(&v1.TestResponse{
		Response: req.Msg.Request,
	})
	// res.Header().Set("Some-Other-Header", "hello!")
	return res, nil
}

func Main() {
	mux := http.NewServeMux()
	// The generated constructors return a path and a plain net/http
	// handler.
	mux.Handle(v1connect.NewTestServiceHandler(&TestServer{}))

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowCredentials: true,
		AllowedHeaders:   []string{"Connect-Protocol-Version", "Content-Type"},
		Debug:            true,
	})
	handler := c.Handler(mux)

	err := http.ListenAndServe(
		"localhost:5000",
		// For gRPC clients, it's convenient to support HTTP/2 without TLS. You can
		// avoid x/net/http2 by using http.ListenAndServeTLS.
		h2c.NewHandler(handler, &http2.Server{}),
	)

	log.Fatalf("listen failed: %v", err)
}

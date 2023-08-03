module template/server

go 1.20

require (
	github.com/bufbuild/connect-go v1.7.0
	github.com/rs/cors v1.9.0
	golang.org/x/net v0.9.0
	template/grpc v0.0.0
)

require (
	golang.org/x/text v0.9.0 // indirect
	google.golang.org/protobuf v1.30.0 // indirect
)

replace template/grpc v0.0.0 => ../proto

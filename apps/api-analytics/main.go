package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "ok")
	})

	http.HandleFunc("/analytics", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Analytics service is running!")
	})

	port := "4011"
	host := "localhost"
	if os.Getenv("NODE_ENV") == "production" {
		host = "0.0.0.0"
	}
	addr := fmt.Sprintf("%s:%s", host, port)
	log.Printf("api-analytics service running on %s", addr)
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
